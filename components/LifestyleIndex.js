class LifestyleIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['solar-exposure', 'tranquility', 'services-index'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    // Scores out of 100
    const solar = parseInt(this.getAttribute('solar-exposure') || '80');
    const tranquility = parseInt(this.getAttribute('tranquility') || '85');
    const services = parseInt(this.getAttribute('services-index') || '90');
    
    // Calculate a naive average for the center score
    const avg = Math.round((solar + tranquility + services) / 3);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .score-badge {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(251, 191, 36, 0.5);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fbbf24;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          position: relative;
          cursor: pointer;
        }

        .tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: -10px;
          right: 60px; /* To the left of the badge */
          width: 240px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 12px;
          color: #f8fafc;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          transform: translateX(10px);
          pointer-events: none;
        }

        .score-badge:hover .tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        
        .stat-bar-container {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        
        .stat-bar {
          height: 100%;
          background: var(--accent-amber, #fbbf24);
          border-radius: 2px;
        }
      </style>
      
      <div class="score-badge">
        ${avg}
        <div class="tooltip">
          <div style="font-weight:600; text-align:center; color:#fbbf24; margin-bottom:8px">Lifestyle Index</div>
          
          <div class="stat-row"><span>☀️ Incidencia Solar</span><span>${solar}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${solar}%"></div></div>
          
          <div class="stat-row"><span>🍃 Silencio/Zonas Verdes</span><span>${tranquility}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${tranquility}%"></div></div>
          
          <div class="stat-row"><span>📍 Conexión/Ubicación</span><span>${services}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${services}%"></div></div>
        </div>
      </div>
    `;
  }
}

customElements.define('lifestyle-index', LifestyleIndex);
