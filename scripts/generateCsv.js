// generateCsv.js
import fs from 'fs';
import { propiedadesVenta } from '../propiedades_venta.js';
import { propiedadesAlquiler } from '../propiedades_alquiler.js';

const allProps = [
  ...propiedadesVenta.map(p => ({ ...p, operacion: p.operacion || 'venta', estado: p.estado || 'disponible' })),
  ...propiedadesAlquiler.map(p => ({ ...p, operacion: p.operacion || 'alquiler', estado: p.estado || 'disponible' }))
];

const headers = [
  'referencia', 'operacion', 'tipo', 'titulo',
  'municipio', 'barrio', 'precio', 'habitaciones',
  'banos', 'superficie', 'estado', 'url_ficha',
  'descripcion', 'imagen'
];

let csv = headers.join(',') + '\n';

csv += allProps.map(p => {
  return headers.map(h => {
    // Map superficie_construida to superficie for the output
    let key = h === 'superficie' ? 'superficie_construida' : h;
    let val = p[key];
    if (val == null) val = '';
    
    val = String(val).replace(/"/g, '""');
    // Si contiene comas, comillas o saltos de línea, envuelve en comillas
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val}"`;
    }
    return val;
  }).join(',');
}).join('\n');

fs.writeFileSync('todos_los_inmuebles_bulk.csv', csv, 'utf-8');
console.log(`Archivo todos_los_inmuebles_bulk.csv generado con ${allProps.length} propiedades.`);
