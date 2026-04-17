// bulkUpload.js – Script para subir el CSV de inmuebles en modo bulk
// Ejecutar con: node scripts/bulkUpload.js

import fs from 'fs';
import path from 'path';
// No usamos bulkCargarInmueblesAN8N porque depende de sessionStorage (solo navegador).
// En su lugar usamos fetch directamente (Node >=18 tiene fetch global).

// Configuración del CSV
const CSV_PATH = path.resolve('importacion_masiva_10_inmuebles.csv');

// Alias de cabeceras (mismo que DashboardUpload)
const headerAliases = {
  'ref': 'referencia',
  'ref.': 'referencia',
  'id_inmovilla': 'referencia',
  'id': 'referencia',
  'tipo_inmueble': 'tipo',
  'operación': 'operacion',
  'precio_venta': 'precio',
  'precio_alquiler': 'precio',
  'm2': 'superficie',
  'superficie_construida': 'superficie',
  'habitaciones': 'habitaciones',
  'dormitorios': 'habitaciones',
  'baños': 'banos',
  'localización': 'municipio',
  'población': 'municipio',
  'ciudad': 'municipio',
  'zona': 'barrio',
  'descripción': 'descripcion',
  'foto': 'imagen',
  'imagen_url': 'imagen'
};

// Esquema esperado (para validar)
const enterpriseSchema = [
  'referencia', 'operacion', 'tipo', 'titulo',
  'municipio', 'barrio', 'precio', 'habitaciones',
  'banos', 'superficie', 'estado', 'url_ficha',
  'descripcion', 'imagen'
];

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) throw new Error('CSV vacío');
  const headers = splitCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim().toLowerCase()] = values[i] || '';
    });
    return row;
  });
  return rows;
}

function normalizeData(data) {
  if (!Array.isArray(data)) data = [data];
  return data.map(row => {
    const normalized = {};
    Object.keys(row).forEach(key => {
      const cleanKey = key.trim().toLowerCase();
      const targetKey = headerAliases[cleanKey] || cleanKey;
      normalized[targetKey] = row[key];
    });
    return normalized;
  });
}

function validateData(data) {
  if (data.length === 0) throw new Error('No hay propiedades válidas');
  const missing = enterpriseSchema.filter(f => !(f in data[0]));
  if (missing.length) {
    throw new Error('Faltan campos obligatorios: ' + missing.join(', '));
  }
}

async function main() {
  try {
    const csvText = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });
    const raw = parseCSV(csvText);
    const normalized = normalizeData(raw);
    validateData(normalized);
    console.log('Enviando', normalized.length, 'inmuebles a n8n...');
    const response = await fetch('https://cerebro.agencialquimia.com/webhook/admin-inmuebles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action: 'BULK_CREATE', payload: normalized })
    });
    if (!response.ok) {
      throw new Error(`Error en n8n bulk upload: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    console.log('Respuesta de n8n:', result);
  } catch (err) {
    console.error('Error durante la carga bulk:', err.message);
    process.exit(1);
  }
}

main();
