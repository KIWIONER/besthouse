// details.js - Motor de Detalle de Inmueble V2.0 Ultimate
import { propiedadesAlquiler } from './propiedades_alquiler.js';
import { propiedadesVenta } from './propiedades_venta.js';
import { obtenerInmueblesAN8N, getPublicUrl } from './services/api.js';
import { escapeHTML, sanitizeURL } from './services/sanitize.js';

// Iconos SVG Premium
const ICONS = {
    superficie: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="3"></line></svg>`,
    habitaciones: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    banos: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"></path><path d="M19 8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"></path><path d="M21 12H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4z"></path></svg>`,
    planta: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="12" y1="10" x2="12" y2="10"></line></svg>`
};

let currentProperty = null;

async function initDetalle() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    if (!ref) {
        window.location.href = '/index.html';
        return;
    }

    // 1. Cargar catálogo unificado
    let catalogo = [...propiedadesAlquiler, ...propiedadesVenta];
    try {
        const realData = await obtenerInmueblesAN8N();
        if (Array.isArray(realData)) {
            catalogo = [...realData, ...catalogo];
        }
    } catch (err) {
        console.warn('Usando catálogo estático fallback.');
    }

    // 2. Buscar inmueble
    currentProperty = catalogo.find(p => p.referencia === ref);

    if (!currentProperty) {
        document.getElementById('prop-title').textContent = 'Inmueble no encontrado';
        return;
    }

    renderData(currentProperty);
    renderRecommendations(currentProperty, catalogo);
    setupMortgageCalculator(currentProperty);
    setupSidebarAlex(currentProperty);
}

async function setupSidebarAlex(prop) {
    const alex = document.getElementById('sidebar-alex');
    const waBtn = document.getElementById('whatsapp-btn');
    
    // Esperar a que el componente esté definido para evitar contextos null
    if (alex) {
        await customElements.whenDefined('broker-alex');
        if (typeof alex.setContext === 'function') {
            alex.setContext(prop);
        }
    }

    if (waBtn) {
        const text = encodeURIComponent(`Hola, me interesa el inmueble "${prop.titulo}" (Ref: ${prop.referencia}). ¿Cuándo podríamos quedar para verlo?`);
        waBtn.href = `https://wa.me/34881123462?text=${text}`;
    }
}

function renderData(prop) {
    const titulo = escapeHTML(prop.titulo);
    const municipio = escapeHTML(prop.municipio);
    const barrio = escapeHTML(prop.barrio || '');
    const precioVal = prop.precio || 0;
    const esAlquiler = prop.operacion === 'alquiler' || prop.unidad_precio === 'mes';

    // Breadcrumbs
    document.getElementById('breadcrumb-op').textContent = esAlquiler ? 'Alquiler' : 'Venta';
    document.getElementById('breadcrumb-loc').textContent = municipio;

    // Header
    document.getElementById('prop-title').textContent = titulo;
    document.getElementById('prop-location').textContent = `${barrio}${barrio ? ', ' : ''}${municipio}`;
    document.getElementById('prop-description').textContent = escapeHTML(prop.descripcion || 'Sin descripción disponible.');
    document.getElementById('prop-price').textContent = prop.precio ? `${prop.precio.toLocaleString()} €${esAlquiler ? '/mes' : ''}` : "Consultar";
    document.getElementById('prop-ref').textContent = escapeHTML(prop.referencia);
    document.getElementById('prop-type-badge').textContent = (prop.tipo || 'Inmueble').toUpperCase();

    // Imagen
    if (prop.imagen) {
        document.getElementById('main-img').src = sanitizeURL(getPublicUrl(prop.imagen));
    }

    // Certificado Energético (Simulado si no existe)
    const rating = prop.certificado_energetico || 'G';
    const energyContainer = document.getElementById('energy-rating-container');
    energyContainer.innerHTML = `
        <div class="energy-badge energy-${rating}">
            Energía: ${rating}
        </div>
    `;

    // Specs Grid con Iconos
    const specsGrid = document.getElementById('specs-grid');
    const superficieVal = prop.superficie_construida || prop.superficie || prop.m2;
    const specs = [
        { lab: 'Superficie', val: superficieVal ? `${superficieVal} m²` : '--', icon: ICONS.superficie },
        { lab: 'Habitaciones', val: prop.habitaciones || '0', icon: ICONS.habitaciones },
        { lab: 'Baños', val: prop.banos || '0', icon: ICONS.banos },
        { lab: 'Planta', val: prop.planta || 'Bajo', icon: ICONS.planta }
    ];

    specsGrid.innerHTML = specs.map(s => `
        <div class="spec-card" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <div style="color: var(--brand-blue); opacity: 0.7;">${s.icon}</div>
            <strong style="font-size: 1.4rem;">${escapeHTML(s.val)}</strong>
            <span style="font-size: 0.7rem; color: #94a3b8;">${escapeHTML(s.lab)}</span>
        </div>
    `).join('');
}

function setupMortgageCalculator(prop) {
    const mortgageSection = document.getElementById('mortgage-section');
    const esAlquiler = prop.operacion === 'alquiler' || prop.unidad_precio === 'mes';

    if (esAlquiler || !prop.precio) {
        mortgageSection.style.display = 'none';
        return;
    }

    const sliderAhorro = document.getElementById('slider-ahorro');
    const sliderPlazo = document.getElementById('slider-plazo');
    const valAhorro = document.getElementById('val-ahorro');
    const valPlazo = document.getElementById('val-plazo');
    const monthlyDisplay = document.getElementById('monthly-payment');

    const calculate = () => {
        const ahorroPct = parseInt(sliderAhorro.value);
        const plazoAnios = parseInt(sliderPlazo.value);
        const precio = prop.precio;
        
        const ahorroDinero = precio * (ahorroPct / 100);
        const capital = precio - ahorroDinero;
        const interesAnual = 0.035; // 3.5%
        const interesMensual = interesAnual / 12;
        const numPagos = plazoAnios * 12;

        // Fórmula de amortización francesa: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        const cuota = (capital * interesMensual * Math.pow(1 + interesMensual, numPagos)) / (Math.pow(1 + interesMensual, numPagos) - 1);
        
        valAhorro.textContent = ahorroPct;
        valPlazo.textContent = plazoAnios;
        monthlyDisplay.textContent = `${Math.round(cuota).toLocaleString()} €/mes`;
    };

    sliderAhorro.addEventListener('input', calculate);
    sliderPlazo.addEventListener('input', calculate);
    calculate();
}

function renderRecommendations(current, catalogo) {
    const recGrid = document.getElementById('rec-grid');
    
    // Filtrar similares (mismo tipo o mismo municipio)
    const similares = catalogo
        .filter(p => p.referencia !== current.referencia)
        .filter(p => p.tipo === current.tipo || p.municipio === current.municipio)
        .slice(0, 3);

    recGrid.innerHTML = similares.map(p => `
        <a href="detalle.html?ref=${p.referencia}" class="glass-panel property-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; text-decoration: none;">
            <div style="height: 180px;">
                <img src="${sanitizeURL(getPublicUrl(p.imagen)) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 1rem;">
                <h4 style="color: var(--brand-blue); margin: 0;">${p.precio ? p.precio.toLocaleString() + ' €' : 'Consultar'}</h4>
                <p style="font-size: 0.85rem; color: #475569; margin: 5px 0;">${escapeHTML(p.titulo)}</p>
            </div>
        </a>
    `).join('');
}

initDetalle();
