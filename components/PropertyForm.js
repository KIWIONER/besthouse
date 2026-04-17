import { crearInmuebleAN8N, actualizarImagenInmuebleDirecto, subirImagenViaWebhook, getPublicUrl } from '../services/api.js';

class PropertyForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      status: 'idle', // 'idle' | 'sending' | 'success' | 'error'
      error: null
    };
    // Inicializar estado de edición
    this.isEditMode = false;
    this.editRef = null;
    this.editId = null;
    this.galleryImages = []; // Lista de URLs de la galería
  }

  connectedCallback() {
    // Si ya hay un shadowRoot con contenido, no volvemos a renderizar
    // para evitar perder datos si se rellena antes de conectar.
    if (!this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  setEditData(data) {
    console.log('[PropertyForm] Recibiendo datos para edición:', data.referencia);
    
    // Asegurar que el componente esté renderizado antes de inyectar datos
    if (!this.shadowRoot.innerHTML || !this.shadowRoot.getElementById('propertyForm')) {
      this.render();
    }

    this.isEditMode = true;
    this.editRef = data.referencia;
    this.editId = data.id;

    // --- SINCRONIZACIÓN Y MAPEO DE CAMPOS ---
    // Mapear campos antiguos o con nombres distintos al inicio
    if (data.superficie_construida && !data.superficie) data.superficie = data.superficie_construida;
    if (data.url_ficha_crm && !data.url_ficha) data.url_ficha = data.url_ficha_crm;
    
    // Rellenar campos de texto, select y números
    const form = this.shadowRoot.getElementById('propertyForm');
    Object.keys(data).forEach(key => {
      const field = form.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = !!data[key];
        } else {
          field.value = data[key] || '';
        }
      }
    });

    // Cambiar visualmente el botón
    const btn = this.shadowRoot.getElementById('submitBtn');
    if (btn) btn.innerHTML = '<span>💾</span> Guardar Cambios';

    // Casos especiales: Imagen / Galería
    let imgData = data.imagen_url || data.imagen;
    
    if (imgData) {
      try {
        // Intentamos parsear como JSON si parece una lista
        let parsed;
        if (typeof imgData === 'string' && (imgData.startsWith('[') || imgData.includes('"'))) {
            try {
                parsed = JSON.parse(imgData);
            } catch(e) {
                parsed = imgData.split(',').map(s => s.trim());
            }
        } else {
            parsed = String(imgData).split(',').map(s => s.trim());
        }

        const rawUrls = Array.isArray(parsed) ? parsed : [parsed];
        
        this.galleryImages = rawUrls.map(u => {
          u = String(u).replace(/[\[\]"]/g, '').trim();
          // Ignorar Base64 corruptos
          if (u.startsWith('data:') && u.length > 5000) return null;
          
          return getPublicUrl(u);
        }).filter(u => u !== null && u !== '');

        const dataField = this.shadowRoot.getElementById('imageDataField');
        if (dataField) dataField.value = this.galleryImages.join(',');
        
        this.refreshGallery();
      } catch (err) {
        console.warn('[PropertyForm] Fallo crítico parseando imágenes:', err);
        this.galleryImages = [];
        this.refreshGallery();
      }
    } else {
      this.clearPreview();
    }

    // Asegurar que el scroll suba al principio del formulario
    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }

        .form-container {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .form-section:last-child { border-bottom: none; }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #000082;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }

        input, select, textarea {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #000082;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .checkbox-item input { width: auto; }

        .btn-submit {
          width: 100%;
          background: #000082;
          color: white;
          padding: 16px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,130,0.2); }
        .btn-submit:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }

        .status-msg {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }

        .status-error { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
        .status-success { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }

        textarea { resize: vertical; min-height: 100px; }

        /* Image Upload Styles */
        .image-upload-wrapper {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          background: #f8fafc;
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .image-upload-wrapper:hover, .image-upload-wrapper.drag-over {
          border-color: #000082;
          background: #f0f4ff;
        }

        .upload-placeholder {
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
        }

        .upload-placeholder span {
          color: #000082;
          font-weight: 700;
          text-decoration: underline;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 15px;
          width: 100%;
          margin-bottom: 20px;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        }

        .gallery-item:hover {
          transform: scale(1.02);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-item .badge-main {
          position: absolute;
          bottom: 5px;
          left: 5px;
          background: #000082;
          color: white;
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .btn-remove-gallery {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .url-fallback {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
      </style>

      <div class="form-container">
        <form id="propertyForm">
          <!-- SECCIÓN 1: BÁSICO -->
          <div class="form-section">
            <div class="section-title"><span>🏠</span> Información Básica</div>
            <div class="grid">
              <div class="field-group" style="grid-column: span 2;">
                <label>Título del Inmueble *</label>
                <input type="text" name="titulo" required placeholder="Ej: Atico de lujo en el Ensanche">
              </div>
              <div class="field-group">
                <label>Referencia *</label>
                <input type="text" name="referencia" required placeholder="Ej: 690882">
              </div>
              <div class="field-group">
                <label>Operación *</label>
                <select name="operacion" required>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              <div class="field-group">
                <label>Tipo *</label>
                <select name="tipo" required>
                  <option value="piso">Piso</option>
                  <option value="casa">Casa / Chalet</option>
                  <option value="local">Local Comercial</option>
                  <option value="terreno">Terreno</option>
                  <option value="garaje">Garaje</option>
                </select>
              </div>
              <div class="field-group">
                <label>Subtipo (Opcional)</label>
                <input type="text" name="subtipo" placeholder="Ej: Ático, Duplex">
              </div>
            </div>
            <div class="field-group" style="margin-top: 20px;">
              <label>Descripción Completa *</label>
              <textarea name="descripcion" required placeholder="Detalla las características para que Alex IA pueda informar a los clientes..."></textarea>
            </div>
          </div>

          <!-- SECCIÓN 2: UBICACIÓN Y PRECIO -->
          <div class="form-section">
            <div class="section-title"><span>📍</span> Ubicación y Finanzas</div>
            <div class="grid">
              <div class="field-group">
                <label>Municipio *</label>
                <input type="text" name="municipio" required value="Santiago de Compostela">
              </div>
              <div class="field-group">
                <label>Barrio / Zona *</label>
                <input type="text" name="barrio" required placeholder="Ej: Ensanche, Vite, Conxo">
              </div>
              <div class="field-group">
                <label>Precio (€) *</label>
                <input type="number" name="precio" required placeholder="0">
              </div>
              <div class="field-group">
                <label>Unidad Precio</label>
                <select name="unidad_precio">
                  <option value="total">Total (Venta)</option>
                  <option value="mes">Al Mes (Alquiler)</option>
                </select>
              </div>
              <div class="field-group">
                <label>Precio Anterior (Opcional)</label>
                <input type="number" name="precio_anterior" placeholder="Para mostrar rebaja">
              </div>
              <div class="field-group">
                <label>Precio Compra (Opción a compra)</label>
                <input type="number" name="precio_compra" placeholder="Precio final de venta">
              </div>
            </div>
          </div>

          <!-- SECCIÓN 3: DETALLES TÉCNICOS -->
          <div class="form-section">
            <div class="section-title"><span>📏</span> Detalles Técnicos</div>
            <div class="grid">
              <div class="field-group">
                <label>Habitaciones</label>
                <input type="number" name="habitaciones" value="0">
              </div>
              <div class="field-group">
                <label>Baños</label>
                <input type="number" name="banos" value="0">
              </div>
              <div class="field-group">
                <label>Superficie (m²)</label>
                <input type="number" name="superficie" placeholder="0">
              </div>
              <div class="field-group">
                <label>Sup. Extra (Terrazas, etc)</label>
                <input type="number" name="superficie_extra" placeholder="0">
              </div>
              <div class="field-group">
                <label>Sup. Parcela (Metros finca)</label>
                <input type="number" name="superficie_parcela" placeholder="0">
              </div>
            </div>
          </div>

          <!-- SECCIÓN 4: COMODIDADES Y MARKETING -->
          <div class="form-section">
            <div class="section-title"><span>✨</span> Servicios y Visibilidad</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><input type="checkbox" name="ascensor"> Ascensor</label>
              <label class="checkbox-item"><input type="checkbox" name="terraza"> Terraza</label>
              <label class="checkbox-item"><input type="checkbox" name="amueblado"> Amueblado</label>
              <label class="checkbox-item"><input type="checkbox" name="exterior"> Exterior</label>
              <label class="checkbox-item"><input type="checkbox" name="garaje"> Garaje</label>
              <label class="checkbox-item"><input type="checkbox" name="piscina"> Piscina</label>
              <label class="checkbox-item" style="background: #fffbeb;"><input type="checkbox" name="destacado"> ⭐ Destacado</label>
            </div>
            <div class="grid" style="margin-top: 25px; grid-template-columns: 1fr 1.2fr;">
              <!-- Columna Izquierda: Controles y Carga -->
              <div class="field-groups-column">
                <div class="field-group" style="margin-bottom: 20px;">
                  <label>Estado del Inmueble</label>
                  <select name="estado">
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="opcion_compra">Alquiler con Opción a Compra</option>
                  </select>
                </div>
                
                <div class="field-group" style="margin-bottom: 20px;">
                  <label>URL Ficha CRM (Inmovilla)</label>
                  <input type="url" name="url_ficha" placeholder="https://www.best-house.es/...">
                </div>

                <!-- Botón de carga compacto -->
                <div class="field-group">
                  <label>Añadir Nuevas Fotos</label>
                  <div class="image-upload-wrapper" id="imageDropzone" style="min-height: 80px; padding: 10px;">
                    <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                    <div class="upload-placeholder" style="flex-direction: row; justify-content: center; gap: 15px; padding: 10px;">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <p style="font-size: 0.8rem; margin: 0;">Haz clic o arrastra <span>imágenes</span></p>
                    </div>
                  </div>
                </div>

                <div class="url-fallback" style="margin-top: 15px;">
                  <label style="font-size: 0.7rem; color: #64748b;">O añade una URL manual:</label>
                  <input type="url" id="manualUrlInput" placeholder="https://..." style="font-size: 0.75rem; padding: 6px 10px; border-color: #e2e8f0;">
                </div>
              </div>

              <!-- Columna Derecha: Solo Galería de Imágenes -->
              <div class="multimedia-column" style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <label style="font-weight: 700; color: #000082; display: block; margin-bottom: 15px;">Fotos del Inmueble</label>
                
                <div class="gallery-grid" id="galleryGrid" style="display: none;">
                  <!-- Las imágenes se cargarán aquí dinámicamente -->
                </div>

                <div id="noImagesMsg" style="text-align: center; color: #94a3b8; padding: 40px 20px; font-style: italic;">
                  No hay imágenes seleccionadas todavía.
                </div>

                <input type="hidden" name="imagen_url" id="imageDataField">
              </div>
            </div>
          </div>

          <button type="submit" class="btn-submit" id="submitBtn">
            <span>🚀</span> Enviar a Supabase via Cerebro n8n
          </button>
        </form>

        <div id="statusMsg" class="status-msg" style="display: none;"></div>
      </div>
    `;

    this.setupListeners();
    this.setupImageHandling();
  }

  setupImageHandling() {
    const dropzone = this.shadowRoot.getElementById('imageDropzone');
    const fileInput = this.shadowRoot.getElementById('fileInput');
    const dataField = this.shadowRoot.getElementById('imageDataField');
    const manualUrlInput = this.shadowRoot.getElementById('manualUrlInput');

    // Click triggers
    dropzone.addEventListener('click', (e) => {
      // Evitar que el click en el botón de borrar propague al dropzone
      if (e.target.closest('.btn-remove-gallery')) return;
      fileInput.click();
    });

    // Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFile(e.dataTransfer.files);
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFile(e.target.files);
      }
    });

    // Manual URL Input (ahora añade a la galería)
    manualUrlInput.addEventListener('change', (e) => {
      const val = e.target.value.trim();
      if (val) {
        const urls = val.includes(',') ? val.split(',') : [val];
        this.galleryImages = [...this.galleryImages, ...urls.map(u => u.trim())];
        dataField.value = this.galleryImages.join(',');
        this.refreshGallery();
        e.target.value = ''; // Limpiar para permitir añadir más
      }
    });
  }

  async handleFile(data) {
    if (!data) return;
    
    // Si pasamos un solo archivo (desde drop), lo convertimos en array
    const fileList = data instanceof FileList ? Array.from(data) : (Array.isArray(data) ? data : [data]);
    if (fileList.length === 0) return;

    if (!this.editRef) {
      alert('Para añadir fotos, primero carga o guarda el inmueble (Referencia necesaria).');
      return;
    }

    const btn = this.shadowRoot.getElementById('submitBtn');
    const placeholder = this.shadowRoot.querySelector('.upload-placeholder');
    const originalText = btn ? btn.innerHTML : '';
    const originalPlaceholder = placeholder ? placeholder.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>⏳</span> Procesando ${fileList.length} imagen(es)...`;
      }
      if (placeholder) placeholder.innerHTML = '<span>☁️</span> Convirtiendo y subiendo...';

      // Procesar cada archivo en secuencia para no saturar el webhook
      for (const file of fileList) {
        if (!file.type.startsWith('image/')) continue;

        console.log(`[PropertyForm] Convirtiendo a Base64: ${file.name}`);
        
        // 1. Leer como Base64
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        // 2. Subir vía Webhook (n8n se encarga de Storage y DB)
        const publicUrl = await subirImagenViaWebhook(this.editRef, base64Data, file.name);

        if (publicUrl) {
          console.log(`[PropertyForm] ✅ URL recibida: ${publicUrl}`);
          this.galleryImages.push(publicUrl);
        }
      }

      // 3. Actualizar campo y vista
      const dataField = this.shadowRoot.getElementById('imageDataField');
      if (dataField) dataField.value = this.galleryImages.join(',');
      
      this.refreshGallery();
      
      // Restaurar UI
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
      if (placeholder) placeholder.innerHTML = originalPlaceholder;

    } catch (err) {
      console.error('[PropertyForm] Error en el flujo de subida:', err);
      alert('Error al procesar imágenes. Revisa el webhook.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
      if (placeholder) placeholder.innerHTML = originalPlaceholder;
    }
  }

  refreshGallery() {
    const grid = this.shadowRoot.getElementById('galleryGrid');
    const noImagesMsg = this.shadowRoot.getElementById('noImagesMsg');
    
    if (this.galleryImages.length === 0) {
      grid.style.display = 'none';
      grid.innerHTML = '';
      if (noImagesMsg) noImagesMsg.style.display = 'block';
      return;
    }

    if (noImagesMsg) noImagesMsg.style.display = 'none';
    grid.style.display = 'grid';
    
    grid.innerHTML = this.galleryImages.map((url, index) => `
      <div class="gallery-item ${index === 0 ? 'main-item' : ''}" data-index="${index}" title="Haz clic para hacerla principal">
        <img src="${url}" 
             alt="Foto ${index + 1}" 
             loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=200&auto=format&fit=crop';">
        ${index === 0 ? '<span class="badge-main">PRINCIPAL</span>' : '<span class="badge-set-main">Hacer portada</span>'}
        <button type="button" class="btn-remove-gallery" data-index="${index}" title="Quitar imagen">×</button>
      </div>
    `).join('');
    
    // Listeners para toda la rejilla
    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.onclick = (e) => {
        // No disparar si se pincha en el botón de borrar
        if (e.target.closest('.btn-remove-gallery')) return;
        const idx = parseInt(item.dataset.index);
        this.setMainImage(idx);
      };
    });
    
    // Botón temporal de diagnóstico
    const debugBtn = document.createElement('button');
    debugBtn.type = 'button';
    debugBtn.style = 'font-size: 0.6rem; margin-top: 10px; opacity: 0.5; border: none; background: none; cursor: help;';
    debugBtn.textContent = '🔍 Ver URLs (Debug)';
    debugBtn.onclick = () => alert('URLs actuales:\n' + this.galleryImages.join('\n'));
    grid.appendChild(debugBtn);

    // Re-añadir listeners de borrado
    grid.querySelectorAll('.btn-remove-gallery').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        this.removeImage(idx);
      };
    });
  }

  setMainImage(index) {
    if (index === 0 || index >= this.galleryImages.length) return;
    
    console.log('[PropertyForm] Cambiando imagen principal:', this.galleryImages[index]);
    
    // Mover la imagen elegida a la primera posición
    const selected = this.galleryImages.splice(index, 1)[0];
    this.galleryImages.unshift(selected);
    
    const dataField = this.shadowRoot.getElementById('imageDataField');
    if (dataField) dataField.value = this.galleryImages.join(',');
    
    this.refreshGallery();
    this.syncGalleryToBackend();
  }

  async removeImage(index) {
    this.galleryImages.splice(index, 1);
    const dataField = this.shadowRoot.getElementById('imageDataField');
    if (dataField) dataField.value = this.galleryImages.join(',');
    this.refreshGallery();
    this.syncGalleryToBackend();
  }

  async syncGalleryToBackend() {
    // PERSISTENCIA INSTANTÁNEA al modificar la galería
    if (this.isEditMode && this.editRef) {
      console.log('[PropertyForm] Sincronizando cambios en galería...');
      try {
        const fullGallery = this.galleryImages.join(',');
        await actualizarImagenInmuebleDirecto(this.editRef, fullGallery);
        
        await crearInmuebleAN8N({
          referencia: this.editRef,
          imagen_url: fullGallery,
          action: 'UPDATE_PROPERTY'
        });
        
        console.log('[PropertyForm] ✅ Galería sincronizada con éxito');
      } catch (syncErr) {
        console.warn('[PropertyForm] Error sincronizando galería:', syncErr);
      }
    }
  }

  clearPreview() {
    this.galleryImages = [];
    const dataField = this.shadowRoot.getElementById('imageDataField');
    const fileInput = this.shadowRoot.getElementById('fileInput');
    const manualUrlInput = this.shadowRoot.getElementById('manualUrlInput');
    if (dataField) dataField.value = '';
    if (fileInput) fileInput.value = '';
    if (manualUrlInput) manualUrlInput.value = '';
    this.refreshGallery();
  }

  setupListeners() {
    const form = this.shadowRoot.getElementById('propertyForm');
    const msg = this.shadowRoot.getElementById('statusMsg');
    const btn = this.shadowRoot.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {};
      
      // Convertir FormData a JSON plano
      formData.forEach((value, key) => {
        // Manejar números (Normalizado a los nombres de n8n)
        if (['precio', 'precio_anterior', 'precio_compra', 'habitaciones', 'banos', 'superficie', 'superficie_extra', 'superficie_parcela'].includes(key)) {
          data[key] = value === '' ? null : Number(value);
        } else {
          data[key] = value;
        }
      });

      // La imagen ahora es una URL directa de Supabase
      if (data.imagen_url) {
        data.image_type = 'url_reference';
        // Enviar también como 'imagen' para retrocompatibilidad
        data.imagen = data.imagen_url;
      } else if (data.imagen) {
        data.image_type = 'url_reference';
        // Asegurar que imagen_url tenga el valor si solo hay imagen
        data.imagen_url = data.imagen;
      }

      // Manejar checkboxes (booleanos)
      const checkboxes = ['ascensor', 'terraza', 'amueblado', 'exterior', 'garaje', 'piscina', 'destacado'];
      checkboxes.forEach(cb => {
        data[cb] = form.elements[cb].checked;
      });

      // Calcular descuento si aplica
      if (data.precio_anterior && data.precio) {
        data.descuento_pct = Math.round(((data.precio_anterior - data.precio) / data.precio_anterior) * 100);
      } else {
        data.descuento_pct = null;
      }

      this.setStatus('sending');
      
      try {
        // Añadir el id y la acción dinámica para n8n
        if (this.isEditMode && (this.editId || this.editRef)) {
          data.action = 'UPDATE_PROPERTY';
          data.id = this.editId;
          data.referencia = this.editRef || data.referencia;
          data.original_referencia = this.editRef;
        } else {
          data.action = 'CREATE_PROPERTY';
        }
        
        const result = await crearInmuebleAN8N(data);
        
        if (result.success || result.output) {
          const successMsg = this.isEditMode ? '¡Inmueble actualizado con éxito!' : '¡Inmueble enviado con éxito!';
          this.setStatus('success', `${successMsg} El cerebro de n8n lo está procesando.`);
          
          // Solo reseteamos en modo creación. En edición, mantenemos los datos.
          if (!this.isEditMode) {
            form.reset();
            this.clearPreview();
          } else {
            console.log('[PropertyForm] Edición completada con éxito. Manteniendo datos.');
          }
          
          // Notificar al sistema para que refresque el inventario
          window.dispatchEvent(new CustomEvent('property-created'));

          // Si es un alta nueva, volvemos a modo creación por si quieren añadir otro.
          // Si es edición, dejamos que el usuario decida si quiere seguir editando 
          // o cerrar manualmente.
        } else {
          throw new Error('El servidor no devolvió una respuesta de éxito.');
        }
      } catch (err) {
        this.setStatus('error', 'Error al enviar: ' + err.message);
      }
    });
  }

  setStatus(status, message = '') {
    const msg = this.shadowRoot.getElementById('statusMsg');
    const btn = this.shadowRoot.getElementById('submitBtn');

    if (status === 'sending') {
      btn.disabled = true;
      const hasImage = this.shadowRoot.getElementById('imageDataField').value.startsWith('data:image');
      btn.innerHTML = hasImage ? '<span>☁️</span> Subiendo imagen y datos...' : '<span>⏳</span> Transmitiendo datos...';
      msg.style.display = 'none';
    } else if (status === 'success') {
      btn.disabled = false;
      btn.innerHTML = '<span>🚀</span> Enviar a Supabase via Cerebro n8n';
      msg.textContent = message;
      msg.className = 'status-msg status-success';
      msg.style.display = 'block';
    } else if (status === 'error') {
      btn.disabled = false;
      btn.innerHTML = '<span>🚀</span> Enviar a Supabase via Cerebro n8n';
      msg.textContent = message;
      msg.className = 'status-msg status-error';
      msg.style.display = 'block';
    }
  }
}

customElements.define('property-form', PropertyForm);
