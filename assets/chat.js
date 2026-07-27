// =================== LIVE CHAT WIDGET ===================
(function() {
  const CHAT_FN_URL = SUPABASE_URL + '/functions/v1/chat-send';
  const SESSION_KEY = 'velvet_chat_session';
  const NAME_KEY = 'velvet_chat_name';

  let sessionId = localStorage.getItem(SESSION_KEY) || null;
  let visitorName = localStorage.getItem(NAME_KEY) || '';
  let messages = [];
  let isOpen = false;
  let sending = false;
  let sbClient = null;
  let realtimeChannel = null;
  let unreadCount = 0;

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function escapeHTML(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function injectWidget() {
    const bubble = el(`
      <button id="chatBubble" class="chat-bubble" aria-label="Live chat with us">
        <span class="dot"></span>
        <span class="chat-bubble-label">Live Chat</span>
        <span id="chatUnreadBadge" class="chat-unread-badge"></span>
      </button>
    `);
    const panel = el(`
      <div id="chatPanel" class="chat-panel">
        <div class="chat-panel-head">
          <div>
            <div class="chat-panel-title">Chat with us</div>
            <div class="chat-panel-sub">A real person replies here</div>
          </div>
          <button id="chatClose" class="chat-close-btn" aria-label="Minimize chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
        <input id="chatNameInput" class="chat-name-input" type="text" placeholder="Your name (optional)" maxlength="60">
        <div class="chat-input-row">
          <input id="chatInput" class="chat-input" type="text" placeholder="Type a message…" maxlength="2000">
          <button id="chatSendBtn" class="chat-send-btn" aria-label="Send">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    `);
    document.body.appendChild(bubble);
    document.body.appendChild(panel);

    bubble.addEventListener('click', toggleChat);
    document.getElementById('chatClose').addEventListener('click', toggleChat);
    document.getElementById('chatSendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage();
    });
    const nameInput = document.getElementById('chatNameInput');
    nameInput.value = visitorName;
    nameInput.style.display = sessionId ? 'none' : 'block';
    nameInput.addEventListener('input', () => { visitorName = nameInput.value; });
  }

  function isMobileChat() {
    return window.matchMedia('(max-width:768px)').matches;
  }

  // Modern browsers size .chat-panel with 100dvh in CSS, which already
  // tracks the keyboard/browser-chrome-shrunk viewport on its own. Only
  // browsers without dvh support need the JS fallback below — running
  // both at once fights the CSS and can leave a stale gap.
  const supportsDvh = window.CSS && CSS.supports && CSS.supports('height', '100dvh');

  function syncMobileViewport() {
    const panel = document.getElementById('chatPanel');
    if (!panel || !window.visualViewport) return;
    const vv = window.visualViewport;
    panel.style.height = vv.height + 'px';
    panel.style.top = vv.offsetTop + 'px';
  }

  function toggleChat() {
    isOpen = !isOpen;
    const panel = document.getElementById('chatPanel');
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      unreadCount = 0;
      renderUnreadBadge();
      if (isMobileChat()) {
        // Capture scroll position / lock the body BEFORE the overflow:hidden
        // class below, which itself resets window.scrollY to 0 on some
        // browsers as soon as it's applied.
        if (window.lockBodyScroll) window.lockBodyScroll();
        document.documentElement.classList.add('chat-open-mobile');
        if (!supportsDvh && window.visualViewport) {
          window.visualViewport.addEventListener('resize', syncMobileViewport);
          window.visualViewport.addEventListener('scroll', syncMobileViewport);
          syncMobileViewport();
        }
      }
      document.getElementById('chatInput').focus();
      scrollToBottom();
    } else {
      if (!supportsDvh && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', syncMobileViewport);
        window.visualViewport.removeEventListener('scroll', syncMobileViewport);
      }
      document.getElementById('chatInput').blur();
      document.documentElement.classList.remove('chat-open-mobile');
      if (window.unlockBodyScroll) window.unlockBodyScroll();
      panel.style.height = '';
      panel.style.top = '';
    }
  }

  function renderUnreadBadge() {
    const badge = document.getElementById('chatUnreadBadge');
    if (!badge) return;
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  }

  async function loadHistory() {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_messages?session_id=eq.${sessionId}&order=created_at.asc`, {
        headers: {apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`}
      });
      if (!r.ok) return;
      messages = await r.json();
      renderMessages();
      scrollToBottom();
    } catch (e) {}
  }

  function renderMessages() {
    const box = document.getElementById('chatMessages');
    if (!box) return;
    if (!messages.length) {
      box.innerHTML = `<div class="chat-empty">Ask us anything — availability, pricing, bookings. A real person will reply here.</div>`;
      return;
    }
    box.innerHTML = messages.map(m => `
      <div class="chat-msg ${m.sender === 'visitor' ? 'chat-msg-me' : 'chat-msg-them'}">${escapeHTML(m.text)}</div>
    `).join('');
  }

  function scrollToBottom() {
    const box = document.getElementById('chatMessages');
    if (box) box.scrollTop = box.scrollHeight;
  }

  function subscribeRealtime() {
    if (realtimeChannel || !window.supabase || !sessionId) return;
    if (!sbClient) sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    realtimeChannel = sbClient.channel('chat-' + sessionId)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}`
      }, payload => {
        const msg = payload.new;
        if (messages.find(m => m.id === msg.id)) return;
        messages.push(msg);
        renderMessages();
        scrollToBottom();
        if (msg.sender === 'agent' && !isOpen) {
          unreadCount++;
          renderUnreadBadge();
        }
      })
      .subscribe();
  }

  async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || sending) return;
    sending = true;
    input.value = '';
    const optimistic = {id: 'tmp-' + Date.now(), sender: 'visitor', text, created_at: new Date().toISOString()};
    messages.push(optimistic);
    renderMessages();
    scrollToBottom();
    try {
      const r = await fetch(CHAT_FN_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`},
        body: JSON.stringify({session_id: sessionId, name: visitorName, text})
      });
      const json = await r.json();
      if (!r.ok || json.error) throw new Error(json.error || 'send failed');
      if (json.message_id) optimistic.id = json.message_id;
      if (!sessionId) {
        sessionId = json.session_id;
        localStorage.setItem(SESSION_KEY, sessionId);
        if (visitorName) localStorage.setItem(NAME_KEY, visitorName);
        const nameInput = document.getElementById('chatNameInput');
        if (nameInput) nameInput.style.display = 'none';
        subscribeRealtime();
      }
    } catch (e) {
      optimistic.text += ' (failed to send — please try again)';
      renderMessages();
    } finally {
      sending = false;
    }
  }

  function init() {
    injectWidget();
    if (sessionId) {
      loadHistory().then(subscribeRealtime);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
