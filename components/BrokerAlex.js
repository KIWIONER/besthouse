class BrokerAlex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: #0f172a;
        }

        .fab:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.6);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          transform-origin: bottom right;
          transition: opacity 0.3s ease, transform 0.3s ease;
          
          /* Hidden state */
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          pointer-events: none;
        }

        .chat-window.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        .header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #334155;
          display:flex; align-items:center; justify-content:center;
          font-size: 1.2rem;
        }

        .header-info h4 {
          margin: 0; color: #f8fafc; font-size: 1rem;
        }
        .header-info p {
          margin: 0; color: #fbbf24; font-size: 0.8rem;
        }

        .messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .msg {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .msg.alex {
          background: rgba(255,255,255,0.1);
          color: #f8fafc;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .msg.user {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .input-area {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 8px;
        }

        input {
          flex: 1;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 20px;
          padding: 10px 16px;
          outline: none;
          font-family: inherit;
        }

        button.send {
          background: transparent;
          border: none;
          color: #fbbf24;
          cursor: pointer;
          display: flex; align-items:center; justify-content:center;
        }
      </style>

      <div class="fab" id="fab">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>

      <div class="chat-window" id="chat">
        <div class="header">
          <div class="avatar">👨‍💼</div>
          <div class="header-info">
            <h4>Alex (Asesor IA)</h4>
            <p>Conectado a Inmovilla & N8N</p>
          </div>
        </div>
        <div class="messages" id="msgs">
          <div class="msg alex">¡Hola! Soy Alex, tu Broker Inmobiliario Premium. ¿Buscas maximizar tu rentabilidad en Santiago o priorizas una excelente orientación solar y calidad constructiva?</div>
        </div>
        <div class="input-area">
          <input type="text" id="chatInput" placeholder="Pregunta sobre una zona...">
          <button class="send" id="sendBtn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const fab = this.shadowRoot.getElementById('fab');
    const chat = this.shadowRoot.getElementById('chat');
    const sendBtn = this.shadowRoot.getElementById('sendBtn');
    const input = this.shadowRoot.getElementById('chatInput');
    const msgs = this.shadowRoot.getElementById('msgs');

    // Context for future real implementation: "Eres un Broker Inmobiliario de lujo en Santiago de Compostela. No menciones vitaminas ni salud nutricional. Habla de rentabilidad, calidad constructiva, orientación solar y ubicación estratégica."
    
    fab.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        chat.classList.add('open');
      } else {
        chat.classList.remove('open');
      }
    });

    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;

      // Add user message
      const uMsg = document.createElement('div');
      uMsg.className = 'msg user';
      uMsg.textContent = text;
      msgs.appendChild(uMsg);
      input.value = '';

      // Mock AI response
      setTimeout(() => {
        const aMsg = document.createElement('div');
        aMsg.className = 'msg alex';
        aMsg.textContent = "Excelente criterio. Analizaré la incidencia solar, rentabilidad estimada por zona y te mostraré opciones de alta gama. Conectando con N8N...";
        msgs.appendChild(aMsg);
        msgs.scrollTop = msgs.scrollHeight;
      }, 1000);
      
      msgs.scrollTop = msgs.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') sendMessage();
    });
  }
}

customElements.define('broker-alex', BrokerAlex);
