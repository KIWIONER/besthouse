import fs from 'fs';

// Cargar los datos consolidados
const data = JSON.parse(fs.readFileSync('datos_inmuebles_supabase.json', 'utf8'));

let sql = `
-- 1. LIMPIEZA PREVIA (Opcional, cuidado en producción)
-- TRUNCATE TABLE inmobiliaria.inmuebles;

-- 2. INSERCIÓN MASIVA 'GRANDES LIGAS' (65 REGISTROS)
INSERT INTO inmobiliaria.inmuebles (
  operacion, referencia, tipo, subtipo, titulo, municipio, barrio, 
  precio, unidad_precio, precio_compra, precio_anterior, descuento_pct,
  habitaciones, banos, superficie_construida, superficie_extra, superficie_parcela,
  ascensor, terraza, amueblado, exterior, garaje, piscina, 
  estado, destacado, url_ficha, descripcion, imagen
) VALUES
`;

const escape = (str) => {
  if (!str && str !== 0) return '';
  return str.toString().replace(/'/g, "''");
};

const rows = data.map(p => {
  // Mapeo inteligente de campos
  const operacion = p.operacion || '';
  const referencia = p.referencia || '';
  const tipo = p.tipo || '';
  const subtipo = p.subtipo || '';
  const titulo = p.titulo || '';
  const municipio = p.municipio || '';
  const barrio = p.barrio || '';
  const precio = p.precio || 'NULL';
  const unidad_precio = p.unidad_precio || 'total';
  const precio_compra = p.precio_compra || 'NULL';
  const precio_anterior = p.precio_anterior || 'NULL';
  const descuento_pct = p.descuento_pct || 'NULL';
  const habitaciones = p.habitaciones || 0;
  const banos = p.banos || 0;
  const superficie_construida = p.superficie_construida || p.superficie || 'NULL';
  const superficie_extra = p.superficie_extra || 'NULL';
  const superficie_parcela = p.superficie_parcela || 'NULL';
  const ascensor = p.ascensor || false;
  const terraza = p.terraza || false;
  const amueblado = p.amueblado || false;
  const exterior = p.exterior || false;
  const garaje = p.garaje || false;
  const piscina = p.piscina || false;
  const estado = p.estado || 'disponible';
  const destacado = p.destacado || false;
  const url_ficha = p.url_ficha || '';
  const descripcion = p.descripcion || '';
  const imagen = p.imagen || '';

  return `('${escape(operacion)}', '${escape(referencia)}', '${escape(tipo)}', '${escape(subtipo)}', '${escape(titulo)}', '${escape(municipio)}', '${escape(barrio)}', ${precio}, '${escape(unidad_precio)}', ${precio_compra}, ${precio_anterior}, ${descuento_pct}, ${habitaciones}, ${banos}, ${superficie_construida}, ${superficie_extra}, ${superficie_parcela}, ${ascensor}, ${terraza}, ${amueblado}, ${exterior}, ${garaje}, ${piscina}, '${escape(estado)}', ${destacado}, '${escape(url_ficha)}', '${escape(descripcion)}', '${escape(imagen)}')`;
}).join(',\n');

fs.writeFileSync('inmuebles_supabase_GRANDES_LIGAS.sql', sql + rows + ';', 'utf8');

console.log(`Script SQL generado con éxito:
- Archivo: inmuebles_supabase_GRANDES_LIGAS.sql
- Registros procesados: ${data.length}`);

fs.writeFileSync('inmuebles_supabase.sql', sql + rows + ';', 'utf8');

console.log(`Script SQL generado con éxito:
- Archivo: inmuebles_supabase.sql
- Registros procesados: ${data.length}`);
