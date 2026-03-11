// main.js - The Cerebro de Cristal Engine
console.log('Midnight Gold Engine Initialized');

import { soloDisponibles, propiedadesAlquiler } from './propiedades_alquiler.js';
import { propiedadesVenta } from './propiedades_venta.js';

// --- STUBS DE COMPONENTES ---
// import './components/NeuralSearch.js';
// import './components/PropertyCard.js';
// import './components/LifestyleIndex.js'; 
// import './components/BrokerAlex.js';

// 1. Motor de Renderizado Inmobiliario
// 1. Motor de Renderizado Inmobiliario
export function renderProperties(filtro = 'todos', dataset = propiedadesAlquiler, limit = null) {
  const grid = document.querySelector('.property-grid');
  if (!grid) return;
  
  grid.innerHTML = ''; // Limpiamos el grid
  
  // Lógica de filtrado interna (para llamadas directas con filtro)
  let propiedades = dataset;
  if (filtro === 'alquiler_pisos') {
      propiedades = dataset.filter(p => p.tipo === 'piso' && p.precio !== null);
  } else if (filtro === 'venta') {
      propiedades = dataset.filter(p => p.precio !== null);
  } else if (filtro === 'destacados') {
      propiedades = dataset.slice(0, 6);
  }

  // Aplicar límite si se especifica
  if (limit) {
    propiedades = propiedades.slice(0, limit);
  }

  // Si no hay resultados
  if (propiedades.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-slate); text-align: center; grid-column: 1/-1;">No hay propiedades que coincidan con la búsqueda.</p>';
    return;
  }

  // Pintamos las tarjetas
  propiedades.forEach(prop => {
    // --- LÓGICA DE IA ---
    const solar = prop.exterior ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 40;
    const tranquility = prop.barrio === 'Ensanche' || prop.barrio === 'Hórreo' ? 55 : 85;
    const services = prop.barrio === 'Ensanche' || prop.barrio === 'Hórreo' ? 98 : 70;

    const imagenUrl = prop.imagen || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
    
    // Detectar si es alquiler para poner el /mes (buscando si tiene unidad_precio o el dataset es de alquiler)
    const esAlquiler = prop.unidad_precio === 'mes' || (prop.precio < 5000 && prop.tipo !== 'garaje' && prop.tipo !== 'terreno');

    const cardHTML = `
      <div class="glass-panel property-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 240px; position: relative;">
          <img src="${imagenUrl}" alt="${prop.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
          ${prop.estado === 'reservado' ? '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(239, 68, 68, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">RESERVADO</span>' : ''}
          ${prop.estado === 'opcion_compra' ? '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(59, 130, 246, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Venta o Alquiler</span>' : ''}
          ${prop.estado === 'disponible' ? '<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(34, 197, 94, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">DISPONIBLE</span>' : ''}
          <div style="position: absolute; right: 20px; bottom: 10px; width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); overflow: hidden;">
              <img src="./img/LOGO_BEST_HOUSE_RECTANGULAR.png" alt="Best House Logo" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.2);">
          </div>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
            <h2 style="color: var(--brand-blue); font-size: 1.8rem; font-weight: 800; margin: 0;">
              ${prop.precio ? prop.precio.toLocaleString() + " €" + (esAlquiler ? "/mes" : "") : 'Consultar'}
            </h2>
            <span style="color: #94a3b8; font-size: 0.8rem;">Ref. ${prop.referencia}</span>
          </div>
          <h3 style="color: var(--text-slate); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.8rem; line-height: 1.4;">${prop.titulo}</h3>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            ${prop.habitaciones ? `<span><strong>${prop.habitaciones}</strong> habs.</span>` : ''}
            ${prop.banos ? `<span><strong>${prop.banos}</strong> baños</span>` : ''}
            ${prop.superficie_construida ? `<span><strong>${prop.superficie_construida}</strong> m²</span>` : ''}
            <span style="text-transform: capitalize;">${prop.tipo}</span>
          </p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 0.5rem;">
              <a href="tel:881123462" class="btn-card-secondary">Llamar</a>
              <a href="mailto:santiago@best-house.com" class="btn-card-primary">Contactar</a>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });
}

// 2. Routing e Inicialización
function init() {
  const path = window.location.pathname;
  
  // Actualizar el título de la sección si existe en la página actual
  const h2 = document.querySelector('.properties-section h2');

  // Lógica para Alquiler.html
  if (path.includes('alquiler.html')) {
    if (h2) h2.textContent = 'Catálogo Completo: Alquiler (21 Inmuebles)';
    renderProperties('todos'); // Muestra los 21 por defecto en alquiler
    setupFilters(propiedadesAlquiler);
  } 
  // Lógica para Venta.html
  else if (path.includes('venta.html')) {
    if (h2) h2.textContent = 'Catálogo Completo: Venta (44 Inmuebles)';
    renderProperties('todos', propiedadesVenta);
    setupFilters(propiedadesVenta);
  }
  // Lógica para index.html (Home)
  else {
    // Si estamos en la home, pintamos un mix de propiedades destacadas
    if (h2) h2.textContent = 'Últimas Novedades Inmobiliarias';
    const grid = document.querySelector('.property-grid');
    if (grid) { 
      renderProperties('destacados', propiedadesAlquiler);
    }
  }

  // Listener para los botones del Hero (Si estamos en index.html)
  const btnSearch = document.querySelector('.fotocasa-search-btn');
  if(btnSearch) {
      btnSearch.addEventListener('click', (e) => {
          e.preventDefault();
          const operacion = document.getElementById('operacion')?.value || 'comprar';
          const zonaRaw = document.getElementById('zona')?.value || '';
          const zona = zonaRaw.trim().toLowerCase();
          const tipo = document.getElementById('tipo')?.value || '';
          
          console.log(`[N8N Tracker] Intención capturada: Búsqueda ejecutada (Operación: ${operacion}, Zona: ${zona})`);
          
          // Decide which dataset to filter
          let datasetBase = (operacion === 'alquilar') ? propiedadesAlquiler : propiedadesVenta;
          let resultados = datasetBase;

          // Filter by city/zone
          if (zona) {
             resultados = resultados.filter(p => 
                 (p.municipio && p.municipio.toLowerCase().includes(zona)) ||
                 (p.barrio && p.barrio.toLowerCase().includes(zona)) ||
                 (p.provincia && p.provincia.toLowerCase().includes(zona))
             );
          }

          // Filter by type if not generic
          if (tipo && tipo !== 'vivienda') {
             resultados = resultados.filter(p => p.tipo && p.tipo.toLowerCase().includes(tipo));
          }
          
          // Get top 6
          const top6 = resultados.slice(0, 6);
          
          // Re-render the local grid using the global function
          const h2 = document.querySelector('.properties-section h2');
          if (h2) {
             const locationText = zonaRaw ? ` en ${zonaRaw}` : '';
             h2.textContent = `Resultados: ${resultados.length} Inmuebles${locationText} para ${operacion === 'alquilar' ? 'alquilar' : 'comprar'}`;
          }
          
          renderProperties('custom', resultados, 6);
          document.querySelector('.properties-section')?.scrollIntoView({ behavior: 'smooth' });
      });
  }
}

// --- LÓGICA: Pestañas de Búsqueda (Comprar, Alquilar, Compartir...) ---
// Placing it completely globally inside DOMContentLoaded so it always binds if the elements are on page
const searchTabs = document.querySelectorAll('.search-tab');
const operacionInput = document.getElementById('operacion');

if (searchTabs.length > 0) {
  searchTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Quitar la clase 'active' a todas las pestañas
      searchTabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottom = ''; // Reset inline styles if any
      });
      
      // Añadir la clase 'active' a la pestaña clickeada
      tab.classList.add('active');
      
      // Actualizar el valor del input oculto 'operacion' si existe
      if(operacionInput) {
        operacionInput.value = tab.getAttribute('data-type');
      }
    });
  });
}

// 3. Lógica de Filtros UI
function setupFilters(sourceDataset) {
  const btn = document.getElementById('btn-aplicar-filtros');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const tipo = document.getElementById('filter-tipo').value;
    const hab = parseInt(document.getElementById('filter-hab').value) || 0;
    const precioMax = parseFloat(document.getElementById('filter-precio-max').value) || Infinity;

    let filtradas = sourceDataset;

    // Filter by type
    if (tipo) {
      if (tipo === 'piso') {
        filtradas = filtradas.filter(p => p.tipo === 'piso' || p.tipo === 'apartamento' || p.tipo === 'duplex');
      } else if (tipo === 'casa') {
        filtradas = filtradas.filter(p => p.tipo === 'casa' || p.tipo === 'adosado');
      } else if (tipo === 'terreno') {
        filtradas = filtradas.filter(p => p.tipo === 'terreno' || p.tipo === 'rustico');
      } else if (tipo === 'local') {
        filtradas = filtradas.filter(p => p.tipo === 'local' || p.tipo === 'nave');
      } else {
        filtradas = filtradas.filter(p => p.tipo === tipo);
      }
    }
    
    // Filter by rooms
    if (hab > 0) {
      filtradas = filtradas.filter(p => (p.habitaciones || 0) >= hab);
    }

    // Filter by max price
    if (precioMax !== Infinity && precioMax > 0) {
      filtradas = filtradas.filter(p => p.precio !== null && p.precio <= precioMax);
    }
    
    // Sort by price
    const order = document.getElementById('filter-orden') ? document.getElementById('filter-orden').value : '';
    if (order === 'asc') {
        filtradas = filtradas.sort((a, b) => (a.precio || Infinity) - (b.precio || Infinity));
    } else if (order === 'desc') {
        filtradas = filtradas.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    }

    renderProperties('custom', filtradas);
    
    const h2 = document.querySelector('.properties-section h2');
    if (h2) {
      h2.textContent = `Resultados: ${filtradas.length} Propiedades`;
    }
  });
}

// En los módulos ES (type="module"), el DOMContentLoaded puede haber saltado ya.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // El DOM ya está listo
}
