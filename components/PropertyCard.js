class PropertyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'price', 'image', 'location'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Propiedad Premium';
    const price = this.getAttribute('price') || 'Consultar';
    const image = this.getAttribute('image') || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
    const location = this.getAttribute('location') || 'Santiago de Compostela';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }
        
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          border-color: rgba(251, 191, 36, 0.4);
        }

        .image-container {
          width: 100%;
          height: 240px;
          overflow: hidden;
          position: relative;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .card:hover .image-container img {
          transform: scale(1.05);
        }

        .content {
          padding: 20px;
        }

        .price {
          color: #fbbf24;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .location {
          color: #cbd5e1;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        /* Health Score Container */
        .health-score-wrapper {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
        }
      </style>
      
      <div class="card">
        <div class="image-container">
          <img src="${image}" alt="${title}" loading="lazy"/>
          <div class="health-score-wrapper">
            <slot name="health-score"></slot>
          </div>
        </div>
        <div class="content">
          <div class="price">${price}</div>
          <h3>${title}</h3>
          <div class="location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${location}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('property-card', PropertyCard);
