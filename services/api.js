/**
 * Genera o recupera un ID de sesión persistente durante la navegación actual.
 * Vital para que el cerebro de IA en n8n/Supabase mantenga la memoria.
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('bh_chat_session_id');
  
  // Si existe pero tiene el formato viejo (con guiones), lo descartamos
  if (sessionId && sessionId.includes('-')) {
    sessionId = null;
  }

  if (!sessionId) {
    // Formato alfanumérico simple sin guiones para compatibilidad con n8n/Postgres
    sessionId = 'bh' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('bh_chat_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Envía el mensaje al cerebro de IA en n8n siguiendo el esquema estricto de "Grandes Ligas".
 */
export const enviarAN8N = async (payload) => {
  const isObject = typeof payload === 'object' && payload !== null;
  const mensaje = isObject ? payload.mensaje : payload;
  const ref = isObject ? payload.referencia : null;
  const sid = (isObject && payload.sessionId) ? payload.sessionId : getSessionId();

  try {
    const response = await fetch('https://cerebro.agencialquimia.com/webhook/inmobiliaria-alquimia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        chatInput: mensaje,       
        mensaje: mensaje,         
        sessionId: sid,
        referencia: ref
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error en el webhook: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error enviando a n8n:', error);
    return { 
      output: "Lo siento, hubo un problema conectando con mi cerebro digital. Por favor, inténtalo de nuevo en unos instantes." 
    };
  }
};
/**
 * Envía los datos de un nuevo inmueble al cerebro de n8n para su inserción en Supabase.
 * Se envía una estructura PLANA para que n8n pueda validar titulo, referencia, etc.
 */
export const crearInmuebleAN8N = async (datosInmueble) => {
  try {
    const response = await fetch('https://cerebro.agencialquimia.com/webhook/admin-inmuebles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Enviamos el objeto plano directamente para que coincida con b.titulo, b.referencia...
      body: JSON.stringify({
        action: 'CREATE_PROPERTY', // Valor por defecto
        ...datosInmueble,
        sessionId: getSessionId()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error en el servidor n8n: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error enviando inmueble a n8n:', error);
    throw error;
  }
};
/**
 * Normaliza los nombres de campo que n8n puede devolver con distintos alias.
 * Supabase usa snake_case, pero un nodo Set/Code en n8n puede renombrar los campos.
 */
function normalizarInmuebles(lista) {
  return lista.map(p => {
    // Superficie: varios nombres posibles según el nodo n8n
    if (p.superficie_construida == null) {
      p.superficie_construida =
        p.superficie     ??   // alias habitual en nodos Set
        p.m2             ??   // alias de exportaciones Inmovilla
        p.built_area     ??   // si el workflow está en inglés
        p.area           ??
        p.metros         ??
        p.metros_cuadrados ??
        null;
    }

    // Habitaciones: alias frecuentes
    if (p.habitaciones == null) {
      p.habitaciones =
        p.dormitorios  ??
        p.rooms        ??
        p.bedrooms     ??
        null;
    }

    // Baños: alias frecuentes
    if (p.banos == null) {
      p.banos =
        p.baños        ??
        p.bathrooms    ??
        p.banyos       ??
        null;
    }

    // Operación: normalizar mayúsculas/minúsculas
    if (p.operacion) {
      p.operacion = p.operacion.toLowerCase().trim();
    } else if (p.operación) {
      p.operacion = p.operación.toLowerCase().trim();
    }

    return p;
  });
}

/**
 * Obtiene el catálogo completo de inmuebles desde Supabase vía n8n.
 */
export const obtenerInmueblesAN8N = async () => {
  try {
    const response = await fetch('https://cerebro.agencialquimia.com/webhook/inmuebles-catalogo', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error obteniendo catálogo: ${response.statusText}`);
    }

    const data = await response.json();
    const lista = Array.isArray(data) ? data : (data.inmuebles || data.payload || []);

    if (lista.length > 0) {
      const primero = lista[0];
      console.log('[n8n DEBUG] Campos recibidos:', Object.keys(primero).join(', '));
      console.log('[n8n DEBUG] Inmueble completo (copia esto):', JSON.stringify(primero, null, 2));
    }

    return normalizarInmuebles(lista);
  } catch (error) {
    console.error('Error obteniendo inmuebles de n8n, usando Mock:', error);
    return [
        { referencia: '752324', tipo: 'casa', operacion: 'venta', titulo: 'Casa en O Pino', precio: 140000, superficie: 204, municipio: 'O Pino', estado: 'disponible', imagen: './img/house1.png' },
        { referencia: '752114', tipo: 'casa', operacion: 'venta', titulo: 'Casa en Cerceda', precio: 299000, superficie: 245, municipio: 'Cerceda', estado: 'disponible', imagen: './img/house2.png' },
        { referencia: '755169', tipo: 'garaje', operacion: 'venta', titulo: 'Garaje en Ensanche', precio: 38500, superficie: 23, municipio: 'Santiago de Compostela', estado: 'disponible', imagen: './img/house3.png' },
        { referencia: '752285', tipo: 'adosado', operacion: 'venta', titulo: 'Adosado con Jardín', precio: 369000, superficie: 209, municipio: 'Santiago de Compostela', estado: 'disponible', imagen: './img/house4.png' }
    ];
  }
};
/**
 * Envía múltiples inmuebles (desde CSV/JSON masivo) a n8n.
 */
export const bulkCargarInmueblesAN8N = async (listaInmuebles) => {
  try {
    const response = await fetch('https://cerebro.agencialquimia.com/webhook/admin-inmuebles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'BULK_CREATE',
        payload: listaInmuebles,
        sessionId: getSessionId()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error en carga masiva: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en bulk upload:', error);
    throw error;
  }
};

/**
 * Obtiene las citas agendadas desde n8n/Postgres.
 * Incluye datos de prueba como fallback si falla la conexión.
 */
export const obtenerCitas = async () => {
    try {
        const response = await fetch('https://cerebro.agencialquimia.com/webhook/obtener-citas', {
            method: 'GET'
        });
        
        if (!response.ok) throw new Error('Error al obtener citas en n8n');
        
        const data = await response.json();
        // n8n puede devolver el array directamente o envuelto en 'citas' o 'payload'
        const citas = Array.isArray(data) ? data : (data.citas || data.payload || []);
        return citas;
    } catch (error) {
        console.warn('[api.js] Error al conectar con n8n/Postgres. Usando datos Mock:', error.message);
        return [
            { id: 'mock-1', nombre: 'Juan Pérez', telefono: '600111222', email: 'juan@example.com', referencia_inmueble: '752324', fecha: new Date().toISOString(), franja: 'Mañana (10:00 - 12:00)', estado: 'confirmada' },
            { id: 'mock-2', nombre: 'María García', telefono: '611222333', email: 'maria@example.com', referencia_inmueble: '759624', fecha: new Date(Date.now() + 86400000).toISOString(), franja: 'Tarde (16:00 - 18:00)', estado: 'pendiente' },
            { id: 'mock-3', nombre: 'Carlos Ruiz', telefono: '622333444', email: 'carlos@example.com', referencia_inmueble: null, fecha: new Date(Date.now() + 172800000).toISOString(), franja: 'Mañana (09:00 - 11:00)', estado: 'completada' }
        ];
    }
};

/**
 * Actualiza el estado de una cita en Supabase vía n8n.
 */
export const actualizarEstadoCita = async (id, nuevoEstado) => {
    try {
        // Cambiamos a GET para evitar problemas de CORS/Preflight en el webhook de n8n
        // Pasamos los parámetros directamente en la URL
        const url = new URL('https://cerebro.agencialquimia.com/webhook/actualizar-estado-cita');
        url.searchParams.append('id', id);
        url.searchParams.append('estado', nuevoEstado.toUpperCase());

        const response = await fetch(url.toString(), {
            method: 'GET'
        });
        
        if (!response.ok) throw new Error('Error al actualizar la cita');
        return await response.json();
    } catch (error) {
        console.error('Error actualizando estado de cita:', error);
        throw error;
    }
};

// Configuración de Supabase para subida de imágenes
export const SUPABASE_URL = 'https://ybqzcxabblyzqhezanaf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_srdA6MTx8hiKPHBV1ahM2w_xZBX85Eb';

/**
 * Normaliza una URL o ruta de imagen para que sea siempre una URL pública válida
 * de Supabase, respetando la estructura de carpetas (bucket/carpetas/archivo).
 */
export const getPublicUrl = (pathOrUrl) => {
    if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
    
    let path = pathOrUrl.trim();

    // 1. Si es Base64 (data:image/...) devolver tal cual
    if (path.startsWith('data:')) return path;

    // 2. Si contiene comas (lista), tomar la primera
    if (path.includes(',')) {
        path = path.split(',')[0].trim();
    }
    
    // 3. Limpieza de caracteres de escape de JSON mal parseado
    path = path.replace(/[\[\]"]/g, '').trim();

    // 4. Si ya es una URL de nuestro Supabase, normalizamos el bucket y la carpeta
    if (path.includes('ybqzcxabblyzqhezanaf.supabase.co')) {
        // Asegurarnos de que usa el formato /public/inmuebles/imagenes/...
        if (!path.includes('/public/inmuebles/imagenes/')) {
             // Caso A: Tiene el bucket correcto pero falta la carpeta imagenes/
             if (path.includes('/public/inmuebles/') && !path.includes('/public/inmuebles/imagenes/')) {
                 path = path.replace('/public/inmuebles/', '/public/inmuebles/imagenes/');
             }
             // Caso B: Viene de un bucket antiguo 'imagenes/' directamente
             else if (path.includes('/public/imagenes/')) {
                 path = path.replace('/public/imagenes/', '/public/inmuebles/imagenes/');
             }
        }
        return path;
    }

    // 5. Si es una URL externa (http), devolver tal cual
    if (path.startsWith('http')) return path;

    // 6. Si es una ruta relativa, asegurar que termina siendo /public/inmuebles/imagenes/...
    // Quitamos 'inmuebles/' si ya lo trae para no duplicar
    if (path.startsWith('inmuebles/')) path = path.replace('inmuebles/', '');
    
    // Aseguramos que tenga el prefijo imagenes/ dentro del bucket
    if (!path.startsWith('imagenes/')) path = `imagenes/${path}`;
    
    return `${SUPABASE_URL}/storage/v1/object/public/inmuebles/${path}`;
};

/**
 * Sube una imagen a Supabase Storage A TRAVÉS de n8n (Base64).
 * n8n recibe el Base64, lo sube al bucket y nos devuelve la URL final.
 */
export const subirImagenViaWebhook = async (referencia, base64Data, fileName) => {
    try {
        const extension = fileName.split('.').pop().toLowerCase() || 'jpg';
        
        console.log(`[API] Enviando imagen Base64 para ${referencia} a n8n...`);
        
        const response = await fetch('https://cerebro.agencialquimia.com/webhook/admin-inmuebles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'UPLOAD_IMAGE',
                referencia: referencia,
                imagen_base64: base64Data,
                extension: extension
            })
        });

        if (!response.ok) {
            throw new Error(`Error en el webhook de subida: ${response.statusText}`);
        }

        const result = await response.json();
        
        // n8n debe devolver la URL en un campo como 'url' o 'imagen_url'
        return result.url || result.imagen_url || result.publicUrl;
    } catch (error) {
        console.error('Error subiendo imagen vía webhook:', error);
        throw error;
    }
};

/**
 * Sube una imagen directamente al Bucket 'inmuebles' de Supabase Storage.
 * Retorna la URL pública de la imagen.
 */
export const subirImagenASupabase = async (file, fileName) => {
    // Limpiar el nombre del archivo de caracteres raros
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
    // Restauramos la carpeta imagenes/ ahora que los permisos están OK
    const path = `imagenes/${cleanFileName}`;
    
    try {
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/inmuebles/${path}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'apikey': SUPABASE_KEY,
                'Content-Type': file.type || 'image/jpeg',
                'x-upsert': 'true'
            },
            body: file
        });

        const status = response.status;
        console.log(`[Supabase Upload] Status: ${status} - Path: ${path}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[Supabase Upload Error Body]:', errorData);
            throw new Error(`Error en Supabase Storage (${status}): ${errorData.message || errorData.error || response.statusText}`);
        }

        // Si la subida es exitosa, la URL pública sigue este patrón:
        return `${SUPABASE_URL}/storage/v1/object/public/inmuebles/${path}`;
    } catch (error) {
        console.error('Error subiendo imagen a Supabase:', error);
        throw error;
    }
};

/**
 * Actualiza la galería de imágenes de un inmueble.
 * AHORA: Usa exclusivamente el webhook para mayor consistencia (Opción B).
 */
export const actualizarImagenInmuebleDirecto = async (referencia, urls) => {
    return await crearInmuebleAN8N({
        action: 'UPDATE_PROPERTY',
        referencia: referencia,
        imagen_url: urls
    });
};
/**
 * Elimina un inmueble vía webhook de n8n.
 */
export const eliminarInmuebleDirecto = async (referencia) => {
    try {
        console.log(`[API] Solicitando borrado de ${referencia} vía Webhook...`);
        const response = await fetch('https://cerebro.agencialquimia.com/webhook/admin-inmuebles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'DELETE',
                referencia: referencia
            })
        });

        if (!response.ok) {
            throw new Error(`Error en el webhook de borrado: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al eliminar inmueble:', error);
        throw error;
    }
};
