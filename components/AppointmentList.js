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

        /* CRM Tickets Table - Modern Layout */
        .tickets-container {
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          text-align: left;
        }

        .appointments-table th {
          background: #f8fafc;
          padding: 16px 20px;
          font-weight: 700;
          color: #64748b;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }

        .ticket-row {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
          animation: slideIn 0.4s ease-out forwards;
        }

        .ticket-row:hover {
          background: #f8fafc;
          transform: scale(1.002);
        }

        .ticket-row:last-child { border-bottom: none; }

        .appointments-table td {
          padding: 16px 20px;
          vertical-align: middle;
        }

        /* Column contents */
        .prop-ref-badge {
          font-size: 0.7rem;
          background: #ffda2a;
          color: #000;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 800;
          display: inline-block;
        }

        .client-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .client-avatar {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .client-info h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }

        .contact-actions {
          display: flex;
          gap: 8px;
        }

        .action-icon-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
        }

        .action-icon-btn:hover {
          background: var(--accent);
          color: white;
        }

        .date-time-cell {
          white-space: nowrap;
        }

        .date-text {
          font-weight: 700;
          color: #1e293b;
          display: block;
        }

        .time-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Dropdown customizado para fila */
        .status-select-wrapper {
          position: relative;
          min-width: 150px;
        }

        .row-status-dropdown {
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e293b;
          background: #fff;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }

        .row-status-dropdown:focus {
          border-color: var(--accent);
          outline: none;
        }

        .loading, .error, .empty {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
          font-weight: 600;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
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
          <div class="loading">Sincronizando Leads...</div>
        ` : errorMessage ? `
          <div class="error">⚠️ Error de conexión: ${errorMessage}</div>
        ` : filteredAppointments.length === 0 ? `
          <div class="empty">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">📂</div>
            <p>No hay tickets en la bandeja de <strong>${this.states.find(s => s.id === this.activeTab).label}</strong></p>
          </div>
        ` : `
          <div class="tickets-container">
            <table class="appointments-table">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Cita / Horario</th>
                  <th>Estado del Ticket</th>
                </tr>
              </thead>
              <tbody>
                ${filteredAppointments.map(a => this.renderRow(a)).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.setupEventListeners();
  }

  renderRow(a) {
    const id = a.id || '';
    const nombre = escapeHTML(a.nombre || 'Interesado');
    const tel = escapeHTML(a.telefono || '');
    const email = escapeHTML(a.email || '');
    const ref = escapeHTML(a.referencia_inmueble || 'General');
    const fecha = a.fecha ? new Date(a.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '--';
    const franja = escapeHTML(a.franja || '');
    const hora = a.hora ? a.hora.substring(0, 5) : '';
    const currentStatus = (a.estado || 'PENDIENTE').toUpperCase();
    
    return `
      <tr class="ticket-row">
        <td><span class="prop-ref-badge">PROP ${ref}</span></td>
        <td>
          <div class="client-cell">
            <div class="client-avatar">${ICONS.user}</div>
            <div class="client-info">
              <h4>${nombre}</h4>
            </div>
          </div>
        </td>
        <td>
          <div class="contact-actions">
            ${tel ? `<a href="tel:${tel}" class="action-icon-btn" title="Llamar">${ICONS.phone}</a>` : ''}
            ${email ? `<a href="mailto:${email}" class="action-icon-btn" title="Email">${ICONS.mail}</a>` : ''}
            ${tel ? `<a href="https://wa.me/34${tel.replace(/\s+/g, '')}" class="action-icon-btn" style="color: #25d366" title="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg></a>` : ''}
          </div>
        </td>
        <td>
          <div class="date-time-cell">
            <span class="date-text">${fecha}</span>
            <span class="time-text">${hora ? `<strong>${hora}h</strong>` : franja}</span>
          </div>
        </td>
        <td>
          <div class="status-select-wrapper">
            <select class="status-dropdown row-status-dropdown" data-id="${id}">
              ${this.states.map(s => `
                <option value="${s.id}" ${currentStatus === s.id ? 'selected' : ''}>
                  ${s.label}
                </option>
              `).join('')}
            </select>
          </div>
        </td>
      </tr>
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
