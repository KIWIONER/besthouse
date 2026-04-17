// main.js - The Cerebro de Cristal Engine
console.log('Midnight Gold Engine Initialized');

import { soloDisponibles, propiedadesAlquiler } from './propiedades_alquiler.js';
import { propiedadesVenta } from './propiedades_venta.js';
import { enviarAN8N, obtenerInmueblesAN8N, getPublicUrl } from './services/api.js';
import { escapeHTML, sanitizeURL } from './services/sanitize.js';

let catalogoReal = []; // Para almacenar datos de Supabase

// --- STUBS DE COMPONENTES ---
// import './components/NeuralSearch.js';
import './components/PropertyCard.js';
import './components/LifestyleIndex.js'; 
import './components/BrokerAlex.js';

// 1. Motor de Renderizado Inmobiliario
// 1. Motor de Renderizado Inmobiliario
export function renderProperties(filtro = 'todos', dataset = null, limit = null) {
  const grid = document.querySelector('.property-grid');
  if (!grid) return;
  
  // Si no se pasa dataset, intentamos usar el catálogo real unificado
  if (!dataset) {
    dataset = [...catalogoReal, ...propiedadesAlquiler, ...propiedadesVenta];
  }

  // Eliminar duplicados por referencia
  const uniqueDataset = [];
  const seenRefs = new Set();
  dataset.forEach(p => {
    if (p.referencia && !seenRefs.has(p.referencia)) {
      uniqueDataset.push(p);
      seenRefs.add(p.referencia);
    } else if (!p.referencia) {
      uniqueDataset.push(p); // Por si acaso hay stubs sin ref
    }
  });
  
  dataset = uniqueDataset;

  grid.innerHTML = ''; 
  
  let propiedades = dataset;
  if (filtro === 'alquiler_pisos') {
      propiedades = dataset.filter(p => p.tipo === 'piso' && p.precio !== null && p.operacion === 'alquiler');
  } else if (filtro === 'venta') {
      propiedades = dataset.filter(p => p.precio !== null && p.operacion === 'venta');
  } else if (filtro === 'destacados') {
      // Priorizamos los reales para los destacados
      propiedades = dataset.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)).slice(0, 6);
  }

  if (limit) {
    propiedades = propiedades.slice(0, limit);
  }

  if (propiedades.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-slate); text-align: center; grid-column: 1/-1;">No hay propiedades que coincidan con la búsqueda.</p>';
    return;
  }

  propiedades.forEach(prop => {
    let rawImg = prop.imagen_url || prop.imagen;
    const imagenUrl = sanitizeURL(getPublicUrl(rawImg)) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
    const titulo = escapeHTML(prop.titulo);
    const referencia = escapeHTML(prop.referencia);
    const tipo = escapeHTML(prop.tipo);
    const habitaciones = escapeHTML(prop.habitaciones);
    const banos = escapeHTML(prop.banos);
    const superficieVal = prop.superficie_construida || prop.superficie || prop.m2;
    const superficie = superficieVal ? escapeHTML(superficieVal.toString()) : '';

    // Normalización de operación/alquiler
    const esAlquiler = prop.operacion === 'alquiler' || prop.unidad_precio === 'mes';

    // Whitelist estado to prevent class/content injection
    const ESTADOS_VALIDOS = ['reservado', 'opcion_compra', 'disponible'];
    const estado = ESTADOS_VALIDOS.includes(prop.estado) ? prop.estado : 'disponible';

    const estadoBadge = estado === 'reservado'
      ? '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(239, 68, 68, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">RESERVADO</span>'
      : estado === 'opcion_compra'
        ? '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(59, 130, 246, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Venta o Alquiler</span>'
        : '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(34, 197, 94, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">DISPONIBLE</span>';

    const cardHTML = `
      <a href="detalle.html?ref=${referencia}" class="glass-panel property-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; text-decoration: none; transition: transform 0.3s ease;">
        <div style="height: 240px; position: relative;">
          <img src="${imagenUrl}" alt="${titulo}" style="width: 100%; height: 100%; object-fit: cover;">
          ${estadoBadge}
          <div style="position: absolute; right: 20px; bottom: 10px; width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); overflow: hidden;">
              <img src="./img/LOGO_BEST_HOUSE_RECTANGULAR.png" alt="Best House Logo" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.2);">
          </div>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
            <h2 style="color: var(--brand-blue); font-size: 1.8rem; font-weight: 800; margin: 0;">
              ${prop.precio ? prop.precio.toLocaleString() + " €" + (esAlquiler ? "/mes" : "") : 'Consultar'}
            </h2>
            <span style="color: #94a3b8; font-size: 0.8rem;">Ref. ${referencia}</span>
          </div>
          <h3 style="color: var(--text-slate); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.8rem; line-height: 1.4;">${titulo}</h3>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            ${habitaciones ? `<span><strong>${habitaciones}</strong> habs.</span>` : ''}
            ${banos ? `<span><strong>${banos}</strong> baños</span>` : ''}
            ${superficie ? `<span><strong>${superficie}</strong> m²</span>` : ''}
            <span style="text-transform: capitalize;">${tipo}</span>
          </p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: center;">
             <span style="color: var(--brand-blue); font-weight: 700; font-size: 0.9rem;">Ver disponibilidad →</span>
          </div>
        </div>
      </a>
    `;
    grid.innerHTML += cardHTML;
  });
}

// 2. Routing e Inicialización
async function init() {
  const path = window.location.pathname;
  
  // 1. Cargar datos reales de Supabase al inicio
  try {
    const data = await obtenerInmueblesAN8N();
    catalogoReal = Array.isArray(data) ? data : [];
    console.log(`[Supabase] Cargados ${catalogoReal.length} inmuebles reales.`);
  } catch (err) {
    console.warn('[Supabase] No se pudo conectar con el catálogo real. Usando fallbacks estáticos.', err);
  }

  // Actualizar el título de la sección si existe en la página actual
  const h2 = document.querySelector('.properties-section h2');

  // Lógica para Alquiler.html
  if (path.includes('alquiler.html')) {
    const datasetAlquiler = [...catalogoReal.filter(p => p.operacion === 'alquiler'), ...propiedadesAlquiler];
    if (h2) h2.textContent = `Catálogo Completo: Alquiler (${datasetAlquiler.length} Inmuebles)`;
    renderProperties('todos', datasetAlquiler);
    setupFilters(datasetAlquiler);
  } 
  // Lógica para Venta.html
  else if (path.includes('venta.html')) {
    const datasetVenta = [...catalogoReal.filter(p => p.operacion === 'venta'), ...propiedadesVenta];
    if (h2) h2.textContent = `Catálogo Completo: Venta (${datasetVenta.length} Inmuebles)`;
    renderProperties('todos', datasetVenta);
    setupFilters(datasetVenta);
  }
  // Lógica para index.html (Home)
  else {
    if (h2) h2.textContent = 'Últimas Novedades Inmobiliarias';
    const grid = document.querySelector('.property-grid');
    if (grid) { 
      // Mostramos un mix destacado y reciente
      const datasetMix = [...catalogoReal, ...propiedadesAlquiler];
      renderProperties('destacados', datasetMix, 6);
    }
  }

  // Listener para los botones del Hero (Si estamos en index.html)
  const btnSearch = document.querySelector('.fotocasa-search-btn');
  if(btnSearch) {
      btnSearch.addEventListener('click', (e) => {
          e.preventDefault();
          const operacion = document.getElementById('operacion')?.value || 'comprar';
          const zonaRaw = document.getElementById('zona')?.value || '';
          const zona = zonaRaw.trim().toLowerCase();
          const tipo = document.getElementById('tipo')?.value || '';
          
          console.log(`[N8N Tracker] Intención capturada: Búsqueda ejecutada (Operación: ${operacion}, Zona: ${zona})`);
          enviarAN8N(`INTENT_TRACKING: Búsqueda de ${tipo} para ${operacion} en ${zona || 'toda la zona'}`);
          
          // Decide which dataset to filter
          let datasetBase = (operacion === 'alquilar') 
              ? [...catalogoReal.filter(p => p.operacion === 'alquiler'), ...propiedadesAlquiler] 
              : [...catalogoReal.filter(p => p.operacion === 'venta'), ...propiedadesVenta];
          
          let resultados = datasetBase;

          // Filter by city/zone or reference
          if (zona) {
             resultados = resultados.filter(p => 
                 (p.referencia && p.referencia.toLowerCase().includes(zona)) ||
                 (p.municipio && p.municipio.toLowerCase().includes(zona)) ||
                 (p.barrio && p.barrio.toLowerCase().includes(zona)) ||
                 (p.provincia && p.provincia.toLowerCase().includes(zona))
             );
          }

          // Filter by type if not generic
          if (tipo && tipo !== 'vivienda') {
             resultados = resultados.filter(p => p.tipo && p.tipo.toLowerCase().includes(tipo));
          }
          
          // Re-render the local grid using the global function
          const h2 = document.querySelector('.properties-section h2');
          if (h2) {
             const locationText = zonaRaw ? ` en ${zonaRaw}` : '';
             h2.textContent = `${resultados.length} Resultado(s) encontrado(s)${locationText} para ${operacion === 'alquiler' ? 'alquilar' : 'comprar'}`;
          }
          
          renderProperties('custom', resultados, 6);
          document.querySelector('.properties-section')?.scrollIntoView({ behavior: 'smooth' });
      });
  }
}

// --- LÓGICA: Pestañas de Búsqueda (Comprar, Alquilar, Compartir...) ---
// Placing it completely globally inside DOMContentLoaded so it always binds if the elements are on page
const searchTabs = document.querySelectorAll('.search-tab');
const operacionInput = document.getElementById('operacion');

if (searchTabs.length > 0) {
  searchTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Quitar la clase 'active' a todas las pestañas
      searchTabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottom = ''; // Reset inline styles if any
      });
      
      // Añadir la clase 'active' a la pestaña clickeada
      tab.classList.add('active');
      
      // Actualizar el valor del input oculto 'operacion' si existe
      if(operacionInput) {
        operacionInput.value = tab.getAttribute('data-type');
      }
    });
  });
  // --- LÓGICA: Menú Hamburguesa ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Cerrar al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
}

// 3. Lógica de Filtros UI
function setupFilters(sourceDataset) {
  const btn = document.getElementById('btn-aplicar-filtros');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const tipo = document.getElementById('filter-tipo').value;
    const hab = parseInt(document.getElementById('filter-hab').value) || 0;
    const precioMax = parseFloat(document.getElementById('filter-precio-max').value) || Infinity;

    let filtradas = sourceDataset;

    // Filter by type
    if (tipo) {
      if (tipo === 'piso') {
        filtradas = filtradas.filter(p => p.tipo === 'piso' || p.tipo === 'apartamento' || p.tipo === 'duplex');
      } else if (tipo === 'casa') {
        filtradas = filtradas.filter(p => p.tipo === 'casa' || p.tipo === 'adosado');
      } else if (tipo === 'terreno') {
        filtradas = filtradas.filter(p => p.tipo === 'terreno' || p.tipo === 'rustico');
      } else if (tipo === 'local') {
        filtradas = filtradas.filter(p => p.tipo === 'local' || p.tipo === 'nave');
      } else {
        filtradas = filtradas.filter(p => p.tipo === tipo);
      }
    }
    
    // Filter by rooms
    if (hab > 0) {
      filtradas = filtradas.filter(p => (p.habitaciones || 0) >= hab);
    }

    // Filter by max price
    if (precioMax !== Infinity && precioMax > 0) {
      filtradas = filtradas.filter(p => p.precio !== null && p.precio <= precioMax);
    }
    
    // Sort by price
    const order = document.getElementById('filter-orden') ? document.getElementById('filter-orden').value : '';
    if (order === 'asc') {
        filtradas = filtradas.sort((a, b) => (a.precio || Infinity) - (b.precio || Infinity));
    } else if (order === 'desc') {
        filtradas = filtradas.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    }

    renderProperties('custom', filtradas);
    
    const h2 = document.querySelector('.properties-section h2');
    if (h2) {
      h2.textContent = `Resultados: ${filtradas.length} Propiedades`;
    }
  });
}

// En los módulos ES (type="module"), el DOMContentLoaded puede haber saltado ya.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // El DOM ya está listo
}
