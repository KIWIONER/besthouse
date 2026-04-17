/**
 * AdminAuth — Web Component que protege el dashboard administrativo
 * con usuario + contraseña.
 *
 * CÓMO FUNCIONA:
 *  - Primera visita: el administrador crea sus credenciales (usuario + contraseña).
 *    Los hashes SHA-256 se guardan en localStorage. Nunca se almacena el texto plano.
 *  - Visitas posteriores: se piden usuario + contraseña y se comparan con los hashes.
 *  - Dentro de una misma sesión de navegador (sessionStorage) no se vuelve a pedir.
 *
 * CÓMO RESETEAR LAS CREDENCIALES:
 *  Abre la consola del navegador y ejecuta:
 *    localStorage.removeItem('bh_admin_user_hash');
 *    localStorage.removeItem('bh_admin_pass_hash');
 *  Recarga la página para volver al flujo de configuración inicial.
 */

class AdminAuth extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isFirstSetup = !(
      localStorage.getItem('bh_admin_user_hash') &&
      localStorage.getItem('bh_admin_pass_hash')
    );
    this._attempts = 0;
    this._locked = false;
  }

  async connectedCallback() {
    if (sessionStorage.getItem('bh_admin_session') === 'ok') {
      this._grantAccess();
      return;
    }
    this.render();
    this.setupListeners();
  }

  get isFirstSetup() {
    return this._isFirstSetup;
  }

  async _hash(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  _grantAccess() {
    const app = document.getElementById('app');
    if (app) {
        // Forzamos el display flex para el nuevo layout de sidebar
        app.style.display = 'flex';
    }
    this.remove();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.97);
          backdrop-filter: blur(8px);
          font-family: 'Inter', sans-serif;
        }

        .modal {
          background: #fff;
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
          text-align: center;
        }

        .logo-wrap {
          margin-bottom: 28px;
        }

        .logo-wrap img {
          height: 44px;
          object-fit: contain;
        }

        h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 28px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
          text-align: left;
        }

        label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          box-sizing: border-box;
          transition: border-color 0.2s;
          outline: none;
          font-family: inherit;
        }

        input:focus {
          border-color: #000082;
        }

        .btn-submit {
          width: 100%;
          background: #000082;
          color: #fff;
          padding: 13px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s, opacity 0.2s;
          font-family: inherit;
        }

        .btn-submit:hover:not(:disabled) { background: #0000a8; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-msg {
          margin-top: 14px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          text-align: left;
        }

        .hint {
          margin-top: 20px;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .pwd-req {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: left;
          margin-top: -10px;
          margin-bottom: 12px;
        }

        .setup-note {
          font-size: 0.8rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          border-radius: 8px;
          padding: 10px 14px;
          text-align: left;
          margin-bottom: 20px;
        }
      </style>

      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div class="logo-wrap">
          <img src="./img/LOGO_BEST_HOUSE_RECTANGULAR.png" alt="Best House Logo">
        </div>

        ${this.isFirstSetup ? `
          <h2 id="auth-title">Configurar acceso admin</h2>
          <p class="subtitle">Primera vez. Define las credenciales de acceso al dashboard.</p>
          <div class="setup-note">
            ⚠️ Estas credenciales se almacenan como hash SHA-256.
            Guárdalas en un lugar seguro — no se pueden recuperar.
          </div>
          <form id="authForm" autocomplete="off">
            <div class="field">
              <label for="usernameInput">Nombre de usuario</label>
              <input type="text" id="usernameInput" name="username"
                     autocomplete="off" required minlength="4"
                     placeholder="Ej: admin_bestHouse">
            </div>
            <div class="field">
              <label for="pwd1">Contraseña</label>
              <input type="password" id="pwd1" name="pwd1"
                     autocomplete="new-password" required minlength="10">
            </div>
            <p class="pwd-req">Mínimo 10 caracteres.</p>
            <div class="field">
              <label for="pwd2">Confirmar contraseña</label>
              <input type="password" id="pwd2" name="pwd2"
                     autocomplete="new-password" required>
            </div>
            <button type="submit" class="btn-submit" id="submitBtn">
              Crear credenciales y entrar
            </button>
          </form>
        ` : `
          <h2 id="auth-title">Acceso Administrativo</h2>
          <p class="subtitle">Best House · Dashboard de Gestión</p>
          <form id="authForm" autocomplete="off">
            <div class="field">
              <label for="usernameInput">Usuario</label>
              <input type="text" id="usernameInput" name="username"
                     autocomplete="off" required autofocus>
            </div>
            <div class="field">
              <label for="pwd1">Contraseña</label>
              <input type="password" id="pwd1" name="pwd1"
                     autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn-submit" id="submitBtn">Entrar</button>
          </form>
        `}

        <div id="errorMsg" class="error-msg" style="display:none;" role="alert"></div>
        <p class="hint">Acceso restringido · Solo personal autorizado de Best House</p>
      </div>
    `;
  }

  setupListeners() {
    const form = this.shadowRoot.getElementById('authForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this._locked) return;
      await this._handleSubmit();
    });
  }

  async _handleSubmit() {
    const usernameInput = this.shadowRoot.getElementById('usernameInput');
    const pwd1 = this.shadowRoot.getElementById('pwd1');
    const btn = this.shadowRoot.getElementById('submitBtn');
    const errorDiv = this.shadowRoot.getElementById('errorMsg');

    const username = usernameInput.value.trim();
    const password = pwd1.value;

    errorDiv.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Verificando...';

    // --- Setup flow (first time) ---
    if (this.isFirstSetup) {
      const pwd2 = this.shadowRoot.getElementById('pwd2');

      if (username.length < 4) {
        this._showError('El nombre de usuario debe tener al menos 4 caracteres.');
        btn.disabled = false;
        btn.textContent = 'Crear credenciales y entrar';
        return;
      }
      if (password.length < 10) {
        this._showError('La contraseña debe tener al menos 10 caracteres.');
        btn.disabled = false;
        btn.textContent = 'Crear credenciales y entrar';
        return;
      }
      if (password !== pwd2.value) {
        this._showError('Las contraseñas no coinciden.');
        btn.disabled = false;
        btn.textContent = 'Crear credenciales y entrar';
        return;
      }

      const [userHash, passHash] = await Promise.all([
        this._hash(username),
        this._hash(password)
      ]);
      localStorage.setItem('bh_admin_user_hash', userHash);
      localStorage.setItem('bh_admin_pass_hash', passHash);
      sessionStorage.setItem('bh_admin_session', 'ok');
      this._grantAccess();
      return;
    }

    // --- Login flow ---
    this._attempts++;
    if (this._attempts > 5) {
      this._locked = true;
      this._showError('Demasiados intentos fallidos. Recarga la página para intentarlo de nuevo.');
      btn.textContent = 'Bloqueado';
      return;
    }

    const [enteredUserHash, enteredPassHash] = await Promise.all([
      this._hash(username),
      this._hash(password)
    ]);
    const storedUserHash = localStorage.getItem('bh_admin_user_hash');
    const storedPassHash = localStorage.getItem('bh_admin_pass_hash');

    if (enteredUserHash === storedUserHash && enteredPassHash === storedPassHash) {
      sessionStorage.setItem('bh_admin_session', 'ok');
      this._grantAccess();
    } else {
      const remaining = 5 - this._attempts;
      this._showError(
        remaining > 0
          ? `Credenciales incorrectas. Te quedan ${remaining} intento(s).`
          : 'Demasiados intentos. Recarga la página.'
      );
      pwd1.value = '';
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  }

  _showError(message) {
    const errorDiv = this.shadowRoot.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}

customElements.define('admin-auth', AdminAuth);
