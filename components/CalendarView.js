import { obtenerCitas, actualizarEstadoCita } from '../services/api.js';

class CalendarView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.citas = [];
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            // En producción esto vendría de n8n -> Postgres
            const data = await obtenerCitas();
            this.citas = Array.isArray(data) ? data : [];
            this.render();
        } catch (error) {
            console.error('Error al cargar citas:', error);
            this.render();
        }
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Ajustar para que la semana empiece en Lunes (0=Lunes, 6=Domingo)
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                font-family: 'Inter', sans-serif;
                color: #1e293b;
            }
            .calendar-container {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 2rem;
                background: white;
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            @media (max-width: 900px) {
                .calendar-container { grid-template-columns: 1fr; }
            }
            
            /* Calendar Header */
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            .month-title {
                font-size: 1.5rem;
                font-weight: 800;
                color: #000082;
                text-transform: capitalize;
            }
            .nav-btn {
                background: #f1f5f9;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                color: #000082;
                transition: background 0.2s;
            }
            .nav-btn:hover { background: #e2e8f0; }

            /* Grid Layout */
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 10px;
            }
            .weekday {
                text-align: center;
                font-size: 0.8rem;
                font-weight: 700;
                color: #64748b;
                padding-bottom: 10px;
            }
            .day {
                aspect-ratio: 1/1;
                border: 1px solid #f1f5f9;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
                font-weight: 600;
            }
            .day:hover { border-color: #ffda2a; background: rgba(255, 218, 42, 0.05); }
            .day.empty { border: none; cursor: default; }
            .day.today { border-color: #000082; background: rgba(0, 0, 130, 0.03); }
            .day.selected { 
                background: rgba(0, 0, 130, 0.1); 
                border-color: #000082; 
                border-width: 2px;
                color: #000082;
            }
            
            /* Indicadores de Citas */
            .day-counter {
                position: absolute;
                top: 6px;
                right: 6px;
                background: #64748b;
                color: white;
                font-size: 0.65rem;
                min-width: 18px;
                height: 18px;
                padding: 0 4px;
                border-radius: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.2s;
            }
            .day.has-pending {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.05);
                border-width: 2px;
            }
            .day.has-pending .day-counter {
                background: #f59e0b;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
            }

            /* Details Panel */
            .details-panel {
                border-left: 1px solid #f1f5f9;
                padding-left: 2rem;
            }
            .details-header { margin-bottom: 1.5rem; }
            .details-header h3 { font-size: 1.2rem; color: #000082; margin: 0; }
            .details-header p { font-size: 0.9rem; color: #64748b; margin: 5px 0 0; }

            .citas-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .cita-card {
                background: #f8fafc;
                border-radius: 12px;
                padding: 1.2rem;
                border-left: 4px solid #ffda2a;
            }
            .cita-time { font-weight: 800; color: #000082; font-size: 0.9rem; }
            .cita-client { display: block; font-weight: 600; margin: 4px 0; }
            .cita-ref { font-size: 0.8rem; color: #64748b; }
            .no-citas { text-align: center; padding: 2rem; color: #94a3b8; font-style: italic; }

            /* Action Buttons */
            .btn-contacted {
                background: #10b981;
                color: white;
                border: none;
                padding: 6px 14px;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .btn-contacted:hover { background: #059669; transform: translateY(-1px); }
            .btn-contacted:disabled { background: #94a3b8; cursor: not-allowed; }

            .status-badge {
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 0.7rem;
                font-weight: 800;
                text-transform: uppercase;
            }
            .status-badge.contactado {
                background: #d1fae5;
                color: #065f46;
            }
        </style>

        <div class="calendar-container">
            <div class="main-calendar">
                <div class="calendar-header">
                    <button class="nav-btn" id="prevMonth">← Anterior</button>
                    <div class="month-title">${monthName} ${year}</div>
                    <button class="nav-btn" id="nextMonth">Siguiente →</button>
                </div>

                <div class="calendar-grid" id="grid">
                    <div class="weekday">LU</div>
                    <div class="weekday">MA</div>
                    <div class="weekday">MI</div>
                    <div class="weekday">JU</div>
                    <div class="weekday">VI</div>
                    <div class="weekday">SA</div>
                    <div class="weekday">DO</div>
                </div>
            </div>

            <div class="details-panel" id="details">
                <!-- Se llena dinámicamente -->
            </div>
        </div>
        `;

        this.renderGrid(year, month, startOffset, daysInMonth);
        this.renderDetails();
        this.setupEventListeners();
    }

    renderGrid(year, month, offset, totalDays) {
        const grid = this.shadowRoot.getElementById('grid');
        const today = new Date();

        // Celdas vacías al inicio
        for (let i = 0; i < offset; i++) {
            const empty = document.createElement('div');
            empty.className = 'day empty';
            grid.appendChild(empty);
        }

        // Días del mes
        for (let d = 1; d <= totalDays; d++) {
            const dayEl = document.createElement('div');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            dayEl.className = 'day';
            dayEl.textContent = d;

            const dayCitas = this.citas.filter(c => c.fecha && c.fecha.includes(dateStr));
            const totalCount = dayCitas.length;
            const hasPending = dayCitas.some(c => (c.estado || '').toUpperCase() === 'PENDIENTE');

            if (totalCount > 0) {
                const counter = document.createElement('span');
                counter.className = 'day-counter';
                counter.textContent = totalCount;
                dayEl.appendChild(counter);

                if (hasPending) dayEl.classList.add('has-pending');
            }

            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            if (d === this.selectedDate.getDate() && month === this.selectedDate.getMonth() && year === this.selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }

            dayEl.addEventListener('click', () => {
                this.selectedDate = new Date(year, month, d);
                this.render();
            });

            grid.appendChild(dayEl);
        }
    }

    renderDetails() {
        const panel = this.shadowRoot.getElementById('details');
        const year = this.selectedDate.getFullYear();
        const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const dayCitas = this.citas.filter(c => c.fecha && c.fecha.includes(dateStr));
        const formattedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(this.selectedDate);

        panel.innerHTML = `
            <div class="details-header">
                <h3>Detalle del Día</h3>
                <p>${formattedDate}</p>
            </div>
            <div class="citas-list">
                ${dayCitas.length > 0 ? dayCitas.map(c => {
                    const isContacted = (c.estado || '').toUpperCase() === 'CONTACTADO';
                    return `
                        <div class="cita-card" style="border-left-color: ${isContacted ? '#10b981' : '#ffda2a'}">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <span class="cita-time">${c.hora ? `<strong>${c.hora.substring(0, 5)}h</strong>` : c.franja}</span>
                                ${isContacted ? 
                                    '<span class="status-badge contactado">✓ Contactado</span>' : 
                                    `<button class="btn-contacted" data-id="${c.id}">Marcar Contactado</button>`
                                }
                            </div>
                            <span class="cita-client">${c.nombre}</span>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="cita-ref">Ref: ${c.referencia_inmueble || 'General'}</span>
                                <a href="tel:${c.telefono}" style="text-decoration: none; background: #e2e8f0; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;" title="Llamar">📞</a>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="no-citas">No hay llamadas programadas para este día.</div>'}
            </div>
        `;
    }

    async handleContacted(id, btn) {
        if (!id) return;

        // 1. Actualización Optimista (Local)
        // Convertimos a String para evitar fallos si uno es Number y otro String
        const index = this.citas.findIndex(c => String(c.id) === String(id));
        if (index !== -1) {
            this.citas[index].estado = 'CONTACTADO';
            this.render(); // Re-renderizado instantáneo
        }

        // Si es un mock, ya hemos terminado
        if (id.startsWith('mock')) {
            console.log('Update simulado para ID de prueba.');
            return;
        }

        // 2. Sincronización con el Servidor
        try {
            await actualizarEstadoCita(id, 'CONTACTADO');
            // Refrescamos los datos reales para asegurar sincronización
            await this.loadData();
        } catch (error) {
            console.error('Error al sincronizar con el servidor:', error);
            // Si falla, avisamos pero mantenemos el estado local si el usuario prefiere
            // En una app robusta aquí revertiríamos el cambio, pero para esta fase
            // el GET ya debería funcionar y evitar este catch.
            alert('Aviso: La cita se marcó localmente pero hubo un error de conexión con el servidor.');
        }
    }

    setupEventListeners() {
        this.shadowRoot.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });
        this.shadowRoot.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        // Delegación para botones de contactado
        this.shadowRoot.getElementById('details').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-contacted')) {
                const id = e.target.getAttribute('data-id');
                this.handleContacted(id, e.target);
            }
        });
    }
}

customElements.define('calendar-view', CalendarView);
