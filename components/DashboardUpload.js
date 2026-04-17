import { bulkCargarInmueblesAN8N, crearInmuebleAN8N } from '../services/api.js';
import { escapeHTML } from '../services/sanitize.js';

class DashboardUpload extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      file: null,
      status: 'idle', // 'idle' | 'processing' | 'success' | 'uploaded' | 'error'
      errors: [],
      properties: []
    };
    
    this.enterpriseSchema = [
      'referencia', 'operacion', 'tipo', 'titulo', 
      'municipio', 'barrio', 'precio', 'habitaciones', 
      'banos', 'superficie', 'estado', 'url_ficha', 
      'descripcion', 'imagen_url'
    ];

    this.headerAliases = {
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
      'foto': 'imagen_url',
      'imagen_url': 'imagen_url',
      'imagen': 'imagen_url'
    };
  }

  connectedCallback() {
    this.render();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  async processFile(file) {
    this.setState({ status: 'processing', errors: [], properties: [] });
    
    try {
      // 1. Validate Extension
      const isCSV = file.name.endsWith('.csv');
      const isJSON = file.name.endsWith('.json');
      
      if (!isCSV && !isJSON) {
        throw new Error('Formato no soportado. Use .csv o .json');
      }

      // 2. Validate Encoding (Force UTF-8)
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      let text;
      try {
        text = decoder.decode(buffer);
      } catch (e) {
        throw new Error('Error de Encoding: El archivo debe ser UTF-8 puro. Se han detectado caracteres inválidos.');
      }

      // 3. Parse and Validate Structure
      let data;
      if (isJSON) {
        data = JSON.parse(text);
      } else {
        data = this.parseCSV(text);
      }

      // 4. Validate Enterprise Schema
      const normalizedData = this.normalizeData(data);
      this.validateData(normalizedData);

      this.setState({ 
        status: 'success', 
        properties: normalizedData,
        file: file
      });

    } catch (error) {
      this.setState({ status: 'error', errors: [error.message] });
    }
  }

  parseCSV(text) {
    // Basic CSV parser that checks for double quote qualifiers as requested
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) throw new Error('El archivo está vacío.');

    const headers = this.splitCSVLine(lines[0]);
    
    // Check if descriptions have double quotes if they contain commas
    // This is a requirement: "asegúrate de que el CSV use \" (comillas dobles) como calificador de texto"
    const rows = lines.slice(1).map((line, idx) => {
      const values = this.splitCSVLine(line);
      const row = {};
      headers.forEach((h, i) => {
        row[h.trim().toLowerCase()] = values[i] || '';
      });
      return row;
    });

    return rows;
  }

  splitCSVLine(line) {
    // Robust split respecting double quotes
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

  normalizeData(data) {
    if (!Array.isArray(data)) data = [data];

    return data.map(row => {
      const normalized = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim().toLowerCase();
        const targetKey = this.headerAliases[cleanKey] || cleanKey;
        let value = row[key];
        
        // Convert to numbers or null for numeric fields to prevent database errors
        const numericFields = ['precio', 'habitaciones', 'banos', 'superficie'];
        if (numericFields.includes(targetKey)) {
          if (value === '' || value === null || value === undefined) {
             value = null;
          } else {
             const parsed = Number(value);
             value = isNaN(parsed) ? null : parsed;
          }
        }
        
        normalized[targetKey] = value;
      });
      return normalized;
    });
  }

  validateData(data) {
    if (data.length === 0) throw new Error('No se detectaron propiedades válidas.');
    
    const firstRow = data[0];
    const missing = this.enterpriseSchema.filter(field => !(field in firstRow));
    
    if (missing.length > 0) {
      throw new Error(`Inconsistencia en el esquema Enterprise. Faltan columnas: ${missing.join(', ')}`);
    }

    // Validation for specific fields
    data.forEach((row, index) => {
      if (!row.referencia) throw new Error(`Fila ${index + 2}: Falta la referencia (obligatoria para Supabase).`);
      if (!['venta', 'alquiler'].includes(row.operacion?.toLowerCase())) {
        throw new Error(`Fila ${index + 2}: La operación debe ser 'venta' o 'alquiler'.`);
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
        }

        .drop-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
        }

        .drop-zone.dragover {
          border-color: #000082;
          background: rgba(0, 0, 130, 0.05);
          transform: scale(1.02);
        }

        .icon-box {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .status-idle { color: #64748b; }
        .status-processing { color: #000082; }
        .status-success, .status-uploaded { color: #059669; }
        .status-error { color: #dc2626; }

        .error-list {
          margin-top: 20px;
          padding: 15px;
          background: #fef2f2;
          border-radius: 8px;
          border-left: 4px solid #dc2626;
          text-align: left;
        }

        .success-box {
          margin-top: 20px;
          padding: 15px;
          background: #ecfdf5;
          border-radius: 8px;
          border-left: 4px solid #059669;
          text-align: left;
        }

        .btn-upload {
          margin-top: 20px;
          background: #000082;
          color: white;
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-upload:disabled { opacity: 0.5; cursor: not-allowed; }

        h4 { margin: 0 0 10px 0; }
        p { margin: 0; font-size: 0.9rem; }
      </style>

      <div class="upload-container">
        <div class="drop-zone ${this.state.status === 'dragover' ? 'dragover' : ''}" id="dropZone">
          <div class="icon-box">
            ${this.state.status === 'success' || this.state.status === 'uploaded' ? '✅' : (this.state.status === 'error' ? '❌' : '📁')}
          </div>
          <div class="text-box">
            ${this.getStatusBarText()}
          </div>
          <input type="file" id="fileInput" hidden accept=".csv,.json">
        </div>

        ${this.state.status === 'error' ? `
          <div class="error-list">
            <h4>Se encontraron errores de validación:</h4>
            ${this.state.errors.map(err => `<p>• ${escapeHTML(err)}</p>`).join('')}
          </div>
        ` : ''}

        ${this.state.status === 'success' ? `
          <div class="success-box">
            <h4>¡Archivo Validado con Éxito!</h4>
            <p>Se han preparado <strong>${this.state.properties.length}</strong> inmuebles para el envío al VPS (n8n).</p>
            <button class="btn-upload" id="finalUpload">Subir a Supabase via n8n (Modo Bulk)</button>
          </div>
        ` : ''}
      </div>
    `;

    this.setupListeners();
  }

  getStatusBarText() {
    switch (this.state.status) {
      case 'processing': return '<b>Procesando...</b><br>Comunicando con n8n y Supabase';
      case 'success': return '<b>' + escapeHTML(this.state.file?.name) + '</b><br>Validación completa';
      case 'uploaded': return '<b style="color: #059669">¡Carga completa!</b><br>Los inmuebles ya están en Supabase';
      case 'error': return '<b>Error en la carga</b><br>Haga clic para intentar de nuevo';
      default: return '<b>Arrastre su archivo CSV/JSON</b><br>o haga clic para seleccionar';
    }
  }

  setupListeners() {
    const zone = this.shadowRoot.getElementById('dropZone');
    const input = this.shadowRoot.getElementById('fileInput');
    const finalBtn = this.shadowRoot.getElementById('finalUpload');

    zone.addEventListener('click', () => input.click());
    
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) this.processFile(file);
    });

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.processFile(file);
    });

    if (finalBtn) {
      finalBtn.addEventListener('click', () => this.triggerFinalUpload());
    }
  }

  async triggerFinalUpload() {
    const finalBtn = this.shadowRoot.getElementById('finalUpload');
    
    try {
      this.setState({ status: 'processing' });
      const result = await bulkCargarInmueblesAN8N(this.state.properties);
      
      if (result.success || result.output) {
        this.setState({ 
          status: 'uploaded', 
          properties: [], 
          file: null,
          errors: [] 
        });
      }
    } catch (error) {
      this.setState({ status: 'error', errors: [error.message] });
    }
  }
}

customElements.define('dashboard-upload', DashboardUpload);
