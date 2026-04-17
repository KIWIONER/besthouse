import { obtenerInmueblesAN8N, eliminarInmuebleDirecto, getPublicUrl } from '../services/api.js';
import { escapeHTML, sanitizeURL } from '../services/sanitize.js';

class InventoryList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.properties = [];
    this.allProperties = []; // Copia original para filtrado
    this.searchTerm = '';
    this.isLoading = false;
    this.selectedRefs = []; // Track selected property references
  }

  // Handle individual checkbox selection
  toggleSelection(ref) {
    if (this.selectedRefs.includes(ref)) {
      this.selectedRefs = this.selectedRefs.filter(r => r !== ref);
    } else {
      this.selectedRefs.push(ref);
    }
    this.render();
  }

  // Handle select all toggle
  toggleSelectAll() {
    if (this.selectedRefs.length === this.properties.length && this.properties.length > 0) {
      this.selectedRefs = [];
    } else {
      this.selectedRefs = this.properties.map(p => p.referencia);
    }
    this.render();
  }

  async handleBulkDelete() {
    const count = this.selectedRefs.length;
    if (!confirm(`¿Estás seguro de que quieres eliminar DEFINITIVAMENTE los ${count} inmuebles seleccionados? n8n procesará los cambios.`)) {
      return;
    }

    const deleteBtn = this.shadowRoot.getElementById('bulkDeleteBtn');
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.innerHTML = `<span>⏳</span> Borrando ${count}...`;
    }

    let successCount = 0;
    let failCount = 0;

    // Procesar en secuencia para seguridad
    for (const ref of this.selectedRefs) {
      try {
        console.log(`[Bulk Delete] Borrando ${ref}...`);
        await eliminarInmuebleDirecto(ref);
        successCount++;
      } catch (err) {
        console.error(`[Bulk Delete] Error borrando ${ref}:`, err);
        failCount++;
      }
    }

    alert(`Proceso masivo finalizado.\n✅ Éxito: ${successCount}\n❌ Fallos: ${failCount}`);
    
    this.selectedRefs = [];
    this.loadData(); // Recargar lista
  }

  connectedCallback() {
    this.loadData();
    // Escuchar actualizaciones globales
    window.addEventListener('property-created', () => this.loadData());
  }

  async loadData() {
    this.isLoading = true;
    this.render();
    try {
      let data = await obtenerInmueblesAN8N();
      // Ordenar por referencia descendente
      this.allProperties = data.sort((a, b) => {
        const refA = parseInt(a.referencia) || 0;
        const refB = parseInt(b.referencia) || 0;
        return refB - refA;
      });
      this.applyFilter();
    } catch (error) {
      this.isLoading = false;
      this.render(error.message);
    }
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.properties = [...this.allProperties];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.properties = this.allProperties.filter(p => 
        (p.referencia && p.referencia.toString().toLowerCase().includes(term)) ||
        (p.titulo && p.titulo.toLowerCase().includes(term)) ||
        (p.municipio && p.municipio.toLowerCase().includes(term)) ||
        (p.barrio && p.barrio.toLowerCase().includes(term))
      );
    }
    this.isLoading = false;
    this.render();
  }

  render(errorMessage = null) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .stat-info .label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
          text-transform: capitalize;
          margin-bottom: 0.5rem;
          display: block;
        }

        .stat-info .value {
          font-size: 2.2rem;
          font-weight: 800;
          color: #000155;
          margin-bottom: 0.5rem;
          display: block;
        }

        .stat-info .trend {
          font-size: 0.85rem;
          font-weight: 700;
          color: #16a34a;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .stat-card.navy { background: #000155; color: white; }
        .stat-card.navy .label { color: rgba(255,255,255,0.6); }
        .stat-card.navy .value { color: white; }
        .stat-card.navy .subtitle { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }

        .stat-chart-placeholder {
          width: 120px;
          height: 100px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: flex-end;
          gap: 6px;
          padding: 10px;
        }

        .bar { width: 14px; background: #e2e8f0; border-radius: 4px; transition: height 0.3s; }
        .bar.active { background: #cbd5e1; }

        /* Inventory Table Style */
        .inventory-wrapper {
          background: white;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .bulk-actions-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fff1f2;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          border: 1px solid #fecaca;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-bulk-delete {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s;
        }

        .btn-bulk-delete:hover { background: #dc2626; }
        .btn-bulk-delete:disabled { background: #94a3b8; cursor: not-allowed; }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.8rem;
        }

        th {
          padding: 1rem 1.5rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: left;
        }

        .checkbox-cell { width: 40px; text-align: center; }
        
        .custom-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #000155;
        }

        tr td {
          padding: 1.2rem 1.5rem;
          background: white;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #334155;
          transition: background 0.2s;
        }

        tr.selected-row td {
          background: #f0f7ff;
          border-color: #3b82f644;
        }

        tr td:first-child { border-left: 1px solid #f1f5f9; border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
        tr td:last-child { border-right: 1px solid #f1f5f9; border-top-right-radius: 10px; border-bottom-right-radius: 10px; }

        tr:hover td {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .prop-img {
          width: 48px;
          height: 38px;
          border-radius: 6px;
          object-fit: cover;
          background: #f1f5f9;
        }

        .ref-code { font-weight: 800; color: #000155; font-size: 0.95rem; }
        .address { font-size: 0.85rem; color: var(--dash-text-muted); display: block; }
        .city { font-size: 0.75rem; color: #cbd5e1; font-weight: 600; }

        .price-tag { font-weight: 800; color: #0f172a; }

        .badge-op {
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .badge-op.venta { background: #dcfce7; color: #166534; }
        .badge-op.alquiler { background: #dbeafe; color: #1e40af; }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .btn-edit {
          background: #f0f7ff;
          color: #000155;
          border-color: #dbeafe;
        }
        .btn-edit:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        .btn-delete {
          background: #fef2f2;
          color: #ef4444;
          border-color: #fee2e2;
        }
        .btn-delete:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        .actions-container {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        /* Fila destacada */
        tr.row-destacada td {
          background: #fffdf5;
          border-top-color: #fef3c7;
          border-bottom-color: #fef3c7;
        }
        tr.row-destacada td:first-child {
          border-left: 3px solid #fbbf24;
        }

        .loading-overlay { padding: 4rem; text-align: center; color: #94a3b8; font-weight: 600; }

        /* Estilos del buscador integrado */
        .search-bar-inline {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0 0.5rem 0 1rem;
          height: 44px;
          width: 420px;
          transition: all 0.2s ease;
        }

        .btn-search {
          background: #000155;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-search:hover {
          background: #000082;
          box-shadow: 0 2px 8px rgba(0, 1, 85, 0.2);
        }

        .results-info {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          margin-left: 1rem;
        }

        .search-bar-inline:focus-within {
          border-color: #000155;
          box-shadow: 0 0 0 3px rgba(0, 1, 85, 0.05);
          background: white;
        }

        .search-bar-inline svg {
          color: #94a3b8;
          margin-right: 0.8rem;
          flex-shrink: 0;
        }

        .search-bar-inline input {
          border: none;
          background: none;
          font-size: 0.9rem;
          color: #1e293b;
          width: 100%;
          outline: none;
        }

        .search-bar-inline input::placeholder {
          color: #94a3b8;
        }
      </style>

      <!-- Section: Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="label">Rendimiento Mensual</span>
            <span class="value">124 Operaciones</span>
            <span class="trend">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              +12.4% desde el mes anterior
            </span>
          </div>
          <div class="stat-chart-placeholder">
            <div class="bar" style="height: 40%"></div>
            <div class="bar" style="height: 60%"></div>
            <div class="bar active" style="height: 85%"></div>
            <div class="bar" style="height: 50%"></div>
          </div>
        </div>
        <div class="stat-card navy">
          <div class="stat-info">
            <span class="label">Total Inventario</span>
            <span class="value">${this.isLoading ? '...' : this.properties.length}</span>
            <span class="subtitle">Activos en plataforma</span>
          </div>
        </div>
      </div>

      <!-- Section: Inventory Table -->
      <div class="inventory-wrapper">
        <div class="table-header">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="search-bar-inline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="inlineSearch" placeholder="Filtrar por REF, título o zona..." value="${this.searchTerm}">
              <button class="btn-search" id="searchBtn">Buscar</button>
            </div>
            <span class="results-info">Encontrados: <strong>${this.properties.length}</strong></span>
          </div>

          ${this.selectedRefs.length > 0 ? `
            <div class="bulk-actions-bar">
              <span style="font-size: 0.85rem; font-weight: 700; color: #ef4444;">${this.selectedRefs.length} seleccionados</span>
              <button class="btn-bulk-delete" id="bulkDeleteBtn">
                 Eliminar estos inmuebles
              </button>
            </div>
          ` : ''}

          <div class="header-actions">
             <button class="icon-btn" id="refreshBtn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
          </div>
        </div>

        ${this.isLoading ? `
            <div class="loading-overlay">Cargando datos maestros...</div>
        ` : errorMessage ? `
            <div class="loading-overlay" style="color:red">⚠️ ${errorMessage}</div>
        ` : `
          <table>
            <thead>
              <tr>
                <th class="checkbox-cell">
                  <input type="checkbox" class="custom-checkbox" id="selectAll" ${this.selectedRefs.length === this.properties.length && this.properties.length > 0 ? 'checked' : ''}>
                </th>
                <th style="width: 40%;">Inmueble & Ubicación</th>
                <th style="width: 15%;">Operación</th>
                <th style="width: 20%;">Precio</th>
                <th style="width: 20%; text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.properties.map(prop => {
                const isSelected = this.selectedRefs.includes(prop.referencia);
                const ref = escapeHTML(prop.referencia || 'N/A');
                const titulo = escapeHTML(prop.titulo || 'Sin título');
                const municipio = escapeHTML(prop.municipio || 'Santiago de Compostela');
                const barrio = escapeHTML(prop.barrio || '');
                const operacion = (prop.operacion || 'venta').toLowerCase();
                const precio = prop.precio ? prop.precio.toLocaleString('es-ES') : '---';
                
                const imagenUrl = sanitizeURL(getPublicUrl(prop.imagen_url || prop.imagen)) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80';
                const isDestacado = !!prop.destacado;

                return `
                  <tr class="${isSelected ? 'selected-row' : ''} ${isDestacado ? 'row-destacada' : ''}">
                    <td class="checkbox-cell">
                      <input type="checkbox" class="custom-checkbox row-checkbox" data-ref="${prop.referencia}" ${isSelected ? 'checked' : ''}>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${imagenUrl}" class="prop-img" alt="${titulo}">
                        <div>
                          <span class="ref-code">${isDestacado ? '⭐ ' : ''}#${ref}</span>
                          <span class="address">${titulo}</span>
                          <span class="city">${municipio}${barrio ? ', ' + barrio : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge-op ${operacion}">${operacion}</span></td>
                    <td><span class="price-tag">${precio}${operacion === 'alquiler' ? '/mes' : '€'}</span></td>
                    <td>
                      <div class="actions-container">
                        <a href="#" class="btn-action btn-edit" data-ref="${ref}">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          Editar
                        </a>
                        <button type="button" class="btn-action btn-delete" data-ref="${ref}">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const shadow = this.shadowRoot;
    
    // Filtro de búsqueda
    // Lógica de búsqueda manual
    const searchInput = shadow.getElementById('inlineSearch');
    const searchBtn = shadow.getElementById('searchBtn');
    
    if (searchBtn && searchInput) {
      const perfomSearch = () => {
        this.searchTerm = searchInput.value;
        this.applyFilter();
      };

      searchBtn.addEventListener('click', perfomSearch);
      
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          perfomSearch();
        }
      });
    }

    // Refrescar datos
    const refreshBtn = shadow.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadData());
    }

    // Selección global (Select All)
    const selectAllCheck = shadow.getElementById('selectAll');
    if (selectAllCheck) {
      selectAllCheck.addEventListener('change', () => this.toggleSelectAll());
    }

    // Selección individual
    shadow.querySelectorAll('.row-checkbox').forEach(check => {
      check.addEventListener('change', (e) => {
        this.toggleSelection(e.target.dataset.ref);
      });
    });

    // Borrado masivo
    const bulkDeleteBtn = shadow.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener('click', () => this.handleBulkDelete());
    }

    // Edición individual
    shadow.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ref = e.target.dataset.ref;
        const prop = this.properties.find(p => p.referencia === ref);
        if (prop) {
          window.dispatchEvent(new CustomEvent('edit-property', { 
            detail: prop,
            bubbles: true,
            composed: true 
          }));
        }
      });
    });

    // Borrado individual
    shadow.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const ref = e.target.dataset.ref;
        if (confirm(`¿Borrar el inmueble #${ref}? Esta acción avisará a n8n.`)) {
          try {
            await eliminarInmuebleDirecto(ref);
            this.loadData();
          } catch (err) {
            alert('Error al borrar: ' + err.message);
          }
        }
      });
    });
  }
}

customElements.define('inventory-list', InventoryList);
