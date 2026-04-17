import { propiedadesAlquiler } from './propiedades_alquiler.js';
import { propiedadesVenta } from './propiedades_venta.js';
import fs from 'fs';

const all = [
  ...propiedadesAlquiler.map(p => ({ ...p, operacion: 'alquiler' })),
  ...propiedadesVenta.map(p => ({ ...p, operacion: 'venta' }))
];

fs.writeFileSync('datos_inmuebles_supabase.json', JSON.stringify(all, null, 2), 'utf-8');
console.log('Archivo generado con éxito: ' + all.length + ' inmuebles.');
