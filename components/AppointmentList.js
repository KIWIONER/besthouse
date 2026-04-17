import { obtenerCitas, actualizarEstadoCita } from '../services/api.js';
import { escapeHTML } from '../services/sanitize.js';

const ICONS = {
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
};

class AppointmentList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.appointments = [];
    this.isLoading = false;
    this.activeTab = 'PENDIENTE';
    this.states = [
      { id: 'PENDIENTE', label: 'Pendiente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      { id: 'LLAMADA_REALIZADA', label: 'Contactado', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      { id: 'VISITA_AGENDADA', label: 'Visita', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      { id: 'CERRADO', label: 'Cerrado', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      { id: 'CANCELADO', label: 'Cancelado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    ];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    this.render();
    try {
      this.appointments = await obtenerCitas();
      this.isLoading = false;
      this.render();
    } catch (error) {
      this.isLoading = false;
      this.render(error.message);
    }
  }

  render(errorMessage = null) {
    const filteredAppointments = this.appointments.filter(a => {
      const state = (a.estado || 'PENDIENTE').toUpperCase();
      return state === this.activeTab.toUpperCase();
    });

    const counts = this.states.reduce((acc, state) => {
      acc[state.id] = this.appointments.filter(a => (a.estado || 'PENDIENTE').toUpperCase() === state.id).length;
      return acc;
    }, {});

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #1e293b;
          --accent: #000082;
          --accent-hover: #0000a5;
          --bg-main: #f8fafc;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 2rem;
        }

        /* Tabs Premium Navigation */
        .header-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .tabs-header {
          display: flex;
          background: rgba(241, 245, 249, 0.8);
          backdrop-filter: blur(10px);
          padding: 5px;
          border-radius: 16px;
          gap: 2px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs-header::-webkit-scrollbar { display: none; }

        .tab-btn {
          flex: 1;
          min-width: 130px;
          border: none;
          background: transparent;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .tab-btn:hover {
          color: var(--accent);
          background: rgba(255, 255, 255, 0.5);
        }

        .tab-btn.active {
          background: white;
          color: var(--accent);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02);
          transform: translateY(-1px);
        }

        .count-pill {
          background: rgba(100, 116, 139, 0.1);
          color: #64748b;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .active .count-pill {
          background: var(--accent);
          color: white;
        }

        /* CRM Grid & Staggered Animation */
        .crm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .client-card {
          background: white;
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .client-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
          border-color: var(--accent);
        }

        .client-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 4px; height: 100%;
          background: var(--status-color, var(--accent));
          border-radius: 0 4px 4px 0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .client-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar-ui {
          width: 42px;
          height: 42px;
          background: #f1f5f9;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .client-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .prop-ref {
          font-size: 0.65rem;
          background: #ffda2a;
          color: #000;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          color: #64748b;
          text-decoration: none;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.2s;
          font-weight: 600;
        }
        .contact-item:hover { 
          color: var(--accent); 
          background: #f1f5f9;
        }
        .contact-item svg { color: #94a3b8; }

        .time-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(241, 245, 249, 0.5);
          border-radius: 14px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
        }
        .time-badge .icon-text {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Dropdown Stylized */
        .status-box {
          position: relative;
          margin-top: 0.5rem;
        }
        .status-dropdown {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 2px solid #f1f5f9;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          background: #fff;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .status-dropdown:focus { border-color: var(--accent); }
        .status-dropdown:hover { border-color: #e2e8f0; }

        .loading, .error, .empty {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
          font-weight: 600;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Staggered load offsets */
        .client-card:nth-child(1) { animation-delay: 0.05s; }
        .client-card:nth-child(2) { animation-delay: 0.1s; }
        .client-card:nth-child(3) { animation-delay: 0.15s; }
        .client-card:nth-child(4) { animation-delay: 0.2s; }
        .client-card:nth-child(5) { animation-delay: 0.25s; }
        .client-card:nth-child(6) { animation-delay: 0.3s; }
      </style>

      <div class="container">
        <!-- Tabs -->
        <div class="tabs-header">
          ${this.states.map(s => `
            <button class="tab-btn ${this.activeTab === s.id ? 'active' : ''}" data-state="${s.id}">
              ${s.label}
              <span class="count-pill">${counts[s.id] || 0}</span>
            </button>
          `).join('')}
        </div>

        <!-- content -->
        ${this.isLoading ? `
          <div class="loading">Iniciando motor de gestión...</div>
        ` : errorMessage ? `
          <div class="error">⚠️ Sistema temporalmente fuera de servicio: ${errorMessage}</div>
        ` : filteredAppointments.length === 0 ? `
          <div class="empty">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">📂</div>
            <p>Bandeja vacía en <strong>${this.states.find(s => s.id === this.activeTab).label}</strong></p>
          </div>
        ` : `
          <div class="crm-grid">
            ${filteredAppointments.map(a => this.renderCard(a)).join('')}
          </div>
        `}
      </div>
    `;

    this.setupEventListeners();
  }

  renderCard(a) {
    const id = a.id || '';
    const nombre = escapeHTML(a.nombre || 'Interesado');
    const tel = escapeHTML(a.telefono || '');
    const email = escapeHTML(a.email || '');
    const ref = escapeHTML(a.referencia_inmueble || 'General');
    const fecha = a.fecha ? new Date(a.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '--';
    const franja = escapeHTML(a.franja || '');
    const currentStatus = (a.estado || 'PENDIENTE').toUpperCase();
    const stateConfig = this.states.find(s => s.id === currentStatus) || this.states[0];

    return `
      <div class="client-card" style="--status-color: ${stateConfig.color}">
        <div class="card-header">
          <div class="client-info">
            <div class="avatar-ui">${ICONS.user}</div>
            <h3 class="client-name">${nombre}</h3>
          </div>
          <span class="prop-ref">PROP ${ref}</span>
        </div>

        <div class="contact-grid">
          <a href="tel:${tel}" class="contact-item">${ICONS.phone} ${tel}</a>
          <a href="mailto:${email}" class="contact-item">${ICONS.mail} ${email}</a>
        </div>

        <div class="time-badge">
          <div class="icon-text">${ICONS.calendar} ${fecha}</div>
          <div class="icon-text">${ICONS.clock} ${franja}</div>
        </div>

        <div class="status-box">
          <select class="status-dropdown" data-id="${id}">
            ${this.states.map(s => `
              <option value="${s.id}" ${currentStatus === s.id ? 'selected' : ''}>
                ${s.label}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.state;
        this.render();
      };
    });

    this.shadowRoot.querySelectorAll('.status-dropdown').forEach(select => {
      select.onchange = async (e) => {
        const id = select.dataset.id;
        const newStatus = e.target.value;
        if (!id) return;

        const appt = this.appointments.find(a => String(a.id) === String(id));
        if (appt) {
          appt.estado = newStatus;
          this.activeTab = newStatus; 
          this.render();
        }

        try {
          await actualizarEstadoCita(id, newStatus);
        } catch (err) {
          console.warn('Error de sincronización:', err);
        }
      };
    });
  }
}

customElements.define('appointment-list', AppointmentList);
