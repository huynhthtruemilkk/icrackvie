const PAGE_META = {
  dashboard: ['Dashboard', 'Tổng quan hệ thống và thiết bị của bạn'],
  devices: ['Devices', 'Thêm, chỉnh sửa và theo dõi thiết bị IPv4'],
  network: ['Network', 'Phân tích địa chỉ IP và kiểm tra kết nối'],
  ai: ['AI Assistant', 'Hỏi đáp, giải thích lệnh và hỗ trợ kỹ thuật'],
  settings: ['Settings', 'Giao diện, tài khoản và cấu hình nâng cao'],
};

class ICrackVie {
  constructor() {
    this.devices = JSON.parse(localStorage.getItem('icv_devices') || '[]');
    this.dark = localStorage.getItem('icv_theme') !== 'light';
    this.activeModel = 'Claude Sonnet 4.5';
    this.authMode = 'login';
    this.user = JSON.parse(localStorage.getItem('icv_user') || 'null');
    this.plan = localStorage.getItem('icv_plan') || 'guest';
    if (!this.user && this.plan !== 'guest') this.plan = 'guest';
    this.cacheDOM();
    this.bindEvents();
    this.applyTheme();
    this.renderDevices();
    this.updateDashboardStats();
    this.startAmbientUpdates();
    this.heroSelfIP();
    this.bindAccountEvents();
    this.refreshAccountUI();
    this.applyFeatureLocks();
  }

  cacheDOM() {
    this.$ = (id) => document.getElementById(id);
    this.rail = document.querySelector('.rail');
    this.scrim = this.$('scrim');
    this.navItems = document.querySelectorAll('.rail-item');
  }

  bindEvents() {
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.goTo(item.dataset.page);
      });
    });
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (!el.classList.contains('rail-item')) {
          e.preventDefault();
          this.goTo(el.dataset.page);
        }
      });
    });

    this.$('railCollapse').addEventListener('click', () => {
      this.rail.classList.toggle('collapsed');
    });

    this.$('menuBtn').addEventListener('click', () => {
      this.rail.classList.add('mobile-open');
      this.scrim.classList.add('show');
    });
    this.scrim.addEventListener('click', () => {
      this.rail.classList.remove('mobile-open');
      this.scrim.classList.remove('show');
    });

    this.$('themeToggle').addEventListener('click', () => this.toggleTheme());
    this.$('darkModeToggle').addEventListener('change', (e) => this.setTheme(e.target.checked));

    this.$('addDeviceForm').addEventListener('submit', (e) => this.addDevice(e));
    this.$('analyzerForm').addEventListener('submit', (e) => this.analyzeIP(e));
    this.$('heroIPBtn').addEventListener('click', () => this.heroSelfIP(true));
    this.$('selfCheckBtn').addEventListener('click', () => this.selfCheckFull());
    this.$('copySelfIP').addEventListener('click', () => this.copySelfIP());

    this.$('resetBtn').addEventListener('click', () => this.resetAll());
    this.$('saveKeys').addEventListener('click', () => this.saveKeys());

    document.querySelectorAll('input[name="model"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.activeModel = e.target.value;
        this.$('activeModelLabel').textContent = this.activeModel;
      });
    });
    this.$('aiForm').addEventListener('submit', (e) => this.sendAIMessage(e));
    this.$('clearChat').addEventListener('click', () => this.clearChat());

    this.loadKeys();
  }


  bindAccountEvents() {
    this.$('offerButton').addEventListener('click', () => this.openModal('offerModal'));
    this.$('accountButton').addEventListener('click', () => this.user ? this.logout() : this.openModal('authModal'));
    document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => this.closeModals()));
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', e => { if (e.target === backdrop) this.closeModals(); }));
    document.querySelectorAll('[data-auth-mode]').forEach(btn => btn.addEventListener('click', () => this.setAuthMode(btn.dataset.authMode)));
    this.$('authForm').addEventListener('submit', e => this.handleEmailAuth(e));
    this.$('googleAuth').addEventListener('click', () => this.toast('Google OAuth chưa được kết nối. Cần Client ID và backend xác thực.'));
    this.$('facebookAuth').addEventListener('click', () => this.toast('Facebook Login chưa được kết nối. Cần App ID và backend xác thực.'));
    this.$('plusPlanBtn').addEventListener('click', () => this.activatePlusTrial());
    this.$('proPlanBtn').addEventListener('click', () => { if (!this.user) { this.closeModals(); this.openModal('authModal'); this.toast('Đăng nhập trước khi tiếp tục chọn Pro.'); } else { this.toast('Thanh toán và kích hoạt Pro chưa được tích hợp trong bản mô phỏng.'); } });
    document.querySelectorAll('[data-locked-feature]').forEach(el => el.addEventListener('click', () => this.openOfferForLock()));
  }

  openModal(id) { this.closeModals(); const el = this.$(id); el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); }
  closeModals() { document.querySelectorAll('.modal-backdrop').forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); }); }
  setAuthMode(mode) {
    this.authMode = mode;
    document.querySelectorAll('[data-auth-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.authMode === mode));
    this.$('authTitle').textContent = mode === 'login' ? 'Đăng nhập để mở rộng quyền truy cập' : 'Tạo tài khoản iCrack Vie';
    this.$('authSubmit').textContent = mode === 'login' ? 'Đăng nhập bằng email' : 'Tạo tài khoản bằng email';
    this.$('authPassword').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  }
  handleEmailAuth(e) {
    e.preventDefault();
    const email = this.$('authEmail').value.trim().toLowerCase();
    const password = this.$('authPassword').value;
    if (!email || password.length < 6) { this.toast('Nhập email hợp lệ và mật khẩu ít nhất 6 ký tự.'); return; }
    const accounts = JSON.parse(localStorage.getItem('icv_accounts') || '{}');
    if (this.authMode === 'register') {
      if (accounts[email]) { this.toast('Email này đã có tài khoản trên trình duyệt.'); return; }
      accounts[email] = { password }; localStorage.setItem('icv_accounts', JSON.stringify(accounts));
    } else if (!accounts[email] || accounts[email].password !== password) {
      this.toast('Email hoặc mật khẩu không đúng, hoặc tài khoản chưa được tạo.'); return;
    }
    this.user = { email };
    this.plan = 'account';
    localStorage.setItem('icv_user', JSON.stringify(this.user));
    localStorage.setItem('icv_plan', this.plan);
    this.refreshAccountUI(); this.applyFeatureLocks(); this.closeModals();
    this.toast(this.authMode === 'register' ? 'Tạo tài khoản demo thành công.' : 'Đăng nhập thành công.');
  }
  logout() {
    this.user = null; this.plan = 'guest';
    localStorage.removeItem('icv_user'); localStorage.setItem('icv_plan', 'guest');
    this.refreshAccountUI(); this.applyFeatureLocks(); this.goTo('dashboard');
    this.toast('Đã đăng xuất. Bạn đang ở chế độ chưa đăng nhập.');
  }
  activatePlusTrial() {
    this.plan = 'plus-trial'; localStorage.setItem('icv_plan', this.plan);
    this.applyFeatureLocks(); this.refreshAccountUI(); this.closeModals();
    this.toast('Plus dùng thử đã mở khóa 100% tính năng trên trình duyệt này.');
  }
  refreshAccountUI() {
    const guest = !this.user && this.plan === 'guest';
    const activePlan = ['plus-trial', 'pro', 'max'].includes(this.plan);
    const label = guest ? 'Chưa đăng nhập' : this.user ? this.user.email.split('@')[0] : 'Chưa đăng nhập';
    this.$('accountButton').textContent = this.user ? 'Đăng xuất' : 'Đăng nhập';
    this.$('railUserName').textContent = label;
    this.$('railAvatar').textContent = guest ? 'K' : label.charAt(0).toUpperCase();
    const status = activePlan ? (this.plan === 'plus-trial' ? 'Plus dùng thử' : this.plan === 'pro' ? 'Pro' : 'Max') : guest ? 'Khách' : 'Đã đăng nhập';
    this.$('railUserStatus').textContent = status;
    this.$('settingsAccountName').textContent = this.user ? this.user.email : 'Chưa đăng nhập';
    this.$('settingsAccountStatus').textContent = status;
    this.$('offerButton').innerHTML = activePlan ? '<span>✦</span> ' + (this.plan === 'plus-trial' ? 'Plus đang bật' : this.plan === 'pro' ? 'Pro đang bật' : 'Max đang bật') : '<span>✦</span> Offer';
  }
  applyFeatureLocks() {
    const full = ['plus-trial', 'pro', 'max'].includes(this.plan);
    const logged = !!this.user;
    const aiPage = this.$('ai');
    aiPage.classList.toggle('page-locked', !full);
    let lock = aiPage.querySelector('.feature-lock-overlay');
    if (!full && !lock) {
      lock = document.createElement('div'); lock.className = 'feature-lock-overlay';
      lock.innerHTML = '<div class="feature-lock-card"><span class="feature-lock-icon">⌑</span><h3>Tính năng nâng cao đang khóa</h3><p>' + (logged ? 'Tài khoản thường mở khóa các tính năng cơ bản. Dùng thử Plus để trải nghiệm toàn bộ công cụ.' : 'Bạn chưa đăng nhập nên một số tính năng đang bị khóa. Đăng nhập để mở thêm quyền truy cập hoặc dùng thử Plus miễn phí.') + '</p><button class="btn btn-primary" type="button" data-unlock-action>' + (logged ? 'Xem gói Plus' : 'Đăng nhập / xem gói') + '</button></div>';
      aiPage.appendChild(lock);
      lock.querySelector('[data-unlock-action]').addEventListener('click', () => { if (!this.user) this.openModal('authModal'); else this.openModal('offerModal'); });
    } else if (full && lock) lock.remove();
    this.$('keyAnthropic').disabled = !full; this.$('keyOpenAI').disabled = !full; this.$('keyDeepSeek').disabled = !full; this.$('keyGoogle').disabled = !full; this.$('saveKeys').disabled = !full;
    document.querySelectorAll('.ai-sidebar input, #aiForm input, #aiForm button, #clearChat').forEach(el => el.disabled = !full);
    this.$('deviceCount').closest('.panel')?.classList.toggle('account-feature-muted', !logged && this.devices.length > 1);
  }
  openOfferForLock() { this.openModal('offerModal'); }
  toast(message) {
    const el = this.$('toastMessage'); el.textContent = message; el.classList.add('show');
    clearTimeout(this.toastTimer); this.toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  goTo(pageId) {
    this.navItems.forEach(i => i.classList.remove('active'));
    document.querySelector(`.rail-item[data-page="${pageId}"]`)?.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    this.$(pageId)?.classList.add('active');
    const meta = PAGE_META[pageId];
    if (meta) {
      this.$('pageTitle').textContent = meta[0];
      this.$('pageSub').textContent = meta[1];
    }
    this.rail.classList.remove('mobile-open');
    this.scrim.classList.remove('show');
  }

  applyTheme() {
    document.body.classList.toggle('theme-dark', this.dark);
    document.body.classList.toggle('theme-light', !this.dark);
    this.$('darkModeToggle').checked = this.dark;
  }

  toggleTheme() { this.setTheme(!this.dark); }

  setTheme(isDark) {
    this.dark = isDark;
    localStorage.setItem('icv_theme', isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  // ===== DEVICES =====
  addDevice(e) {
    e.preventDefault();
    const name = this.$('deviceName').value.trim();
    const ip = this.$('deviceIP').value.trim();
    const port = this.$('devicePort').value || 80;
    const note = this.$('deviceNote').value.trim();
    const deviceLimit = ['plus-trial', 'pro', 'max'].includes(this.plan) ? Infinity : this.user ? 3 : 1;
    if (this.devices.length >= deviceLimit) { this.toast(this.user ? 'Tài khoản thường giới hạn 3 thiết bị. Dùng thử Plus để mở khóa không giới hạn.' : 'Chế độ chưa đăng nhập chỉ thêm được 1 thiết bị. Đăng nhập để mở khóa thêm.'); if (!this.user) this.openModal('authModal'); else this.openModal('offerModal'); return; }
    if (!name || !ip) { alert('Vui lòng nhập tên và IPv4.'); return; }

    this.devices.push({ id: Date.now(), name, ip, port, note, status: 'online' });
    this.persistDevices();
    this.$('addDeviceForm').reset();
    this.$('devicePort').value = 80;
    this.renderDevices();
    this.updateDashboardStats();
  }

  deleteDevice(id) {
    this.devices = this.devices.filter(d => d.id !== id);
    this.persistDevices();
    this.renderDevices();
    this.updateDashboardStats();
  }

  persistDevices() { localStorage.setItem('icv_devices', JSON.stringify(this.devices)); }

  renderDevices() {
    const empty = '<div class="empty-state">Chưa có thiết bị nào.</div>';
    this.$('recentDevices').innerHTML = this.devices.length ? this.devices.slice(-3).reverse().map(d => this.deviceCard(d)).join('') : empty;
    this.$('allDevices').innerHTML = this.devices.length ? this.devices.map(d => this.deviceCard(d)).join('') : empty;
    this.$('deviceCount').textContent = this.devices.length;
  }

  deviceCard(d) {
    const badge = d.status === 'online' ? 'badge-on' : 'badge-off';
    const label = d.status === 'online' ? 'Online' : 'Offline';
    return `<div class="device-item">
      <div>
        <h4>${this.esc(d.name)}</h4>
        <div class="device-ip">${this.esc(d.ip)}:${d.port}</div>
        ${d.note ? `<div class="device-note">${this.esc(d.note)}</div>` : ''}
      </div>
      <div class="device-actions">
        <span class="badge ${badge}">● ${label}</span>
        <button class="icon-btn" onclick="app.deleteDevice(${d.id})" aria-label="Xóa">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6.5v4M8.5 6.5v4M3 3.5l.6 8a1 1 0 001 .9h4.8a1 1 0 001-.9l.6-8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;
  }

  esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  updateDashboardStats() {
    this.$('activeDevices').textContent = this.devices.filter(d => d.status === 'online').length;
    this.$('netStatus').textContent = navigator.onLine ? 'Ổn định' : 'Mất kết nối';
  }

  // ===== NETWORK: self IP =====
  async heroSelfIP(forced) {
    const el = this.$('heroIP');
    const pillText = this.$('netPillText');
    if (!forced) el.textContent = '—';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      el.textContent = data.ip;
      pillText.textContent = 'Mạng ổn định';
    } catch {
      el.textContent = 'Không khả dụng';
      pillText.textContent = 'Lỗi kết nối';
    }
  }

  async selfCheckFull() {
    const btn = this.$('selfCheckBtn');
    const card = this.$('selfIPCard');
    btn.disabled = true;
    btn.textContent = 'Đang kiểm tra...';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      this.$('selfIPValue').textContent = ipData.ip;

      try {
        const infoRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const info = await infoRes.json();
        this.$('selfIPOrg').textContent = info.org || 'Không rõ';
        this.$('selfIPLoc').textContent = [info.city, info.country_name].filter(Boolean).join(', ') || 'Không rõ';
        this.$('selfIPTZ').textContent = info.timezone || 'Không rõ';
      } catch {
        this.$('selfIPOrg').textContent = 'Không khả dụng';
        this.$('selfIPLoc').textContent = 'Không khả dụng';
        this.$('selfIPTZ').textContent = 'Không khả dụng';
      }

      card.style.display = 'block';
    } catch {
      alert('Không thể lấy địa chỉ IP lúc này. Kiểm tra kết nối mạng và thử lại.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Kiểm tra IP của tôi';
    }
  }

  copySelfIP() {
    const ip = this.$('selfIPValue').textContent;
    navigator.clipboard.writeText(ip).then(() => {
      const btn = this.$('copySelfIP');
      const prev = btn.textContent;
      btn.textContent = 'Đã sao chép';
      setTimeout(() => btn.textContent = prev, 1800);
    });
  }

  analyzeIP(e) {
    e.preventDefault();
    const ip = this.$('analyzeIP').value.trim();
    if (!ip) { alert('Vui lòng nhập IP cần phân tích.'); return; }
    const online = Math.random() > 0.3;
    const time = Math.floor(Math.random() * 90) + 15;
    this.$('resultStatus').textContent = online ? 'Có phản hồi' : 'Không phản hồi';
    this.$('resultTime').textContent = time + ' ms';
    this.$('resultDesc').textContent = online ? 'Thiết bị đang hoạt động bình thường.' : 'Không thể kết nối tới địa chỉ này.';
    this.$('analyzeResult').style.display = 'block';
  }

  startAmbientUpdates() {
    setInterval(() => {
      const speed = (Math.random() * 70 + 20).toFixed(1);
      const ping = Math.floor(Math.random() * 50 + 10);
      this.$('speedValue').textContent = speed;
      this.$('pingValue').textContent = ping;

    }, 4000);
  }

  // ===== AI CHAT (demo, local only) =====
  sendAIMessage(e) {
    e.preventDefault();
    const input = this.$('aiInput');
    const text = input.value.trim();
    if (!text) return;
    this.appendMsg(text, 'user');
    input.value = '';
    this.showTyping();
    setTimeout(() => {
      this.removeTyping();
      this.appendMsg(this.fakeReply(text), 'ai');
    }, 850 + Math.random() * 700);
  }

  appendMsg(text, who) {
    const wrap = document.createElement('div');
    wrap.className = `msg msg-${who}`;
    wrap.innerHTML = `<div class="msg-bubble">${this.esc(text)}</div>`;
    this.$('aiMessages').appendChild(wrap);
    this.$('aiMessages').scrollTop = this.$('aiMessages').scrollHeight;
  }

  showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg msg-ai msg-typing';
    wrap.id = 'typingIndicator';
    wrap.innerHTML = `<div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    this.$('aiMessages').appendChild(wrap);
    this.$('aiMessages').scrollTop = this.$('aiMessages').scrollHeight;
  }

  removeTyping() { this.$('typingIndicator')?.remove(); }

  fakeReply(question) {
    const lower = question.toLowerCase();
    if (lower.includes('ip') || lower.includes('ipv4')) {
      return `[${this.activeModel}] Để kiểm tra IPv4 của bạn, vào tab Network và bấm "Kiểm tra IP của tôi" — mình sẽ lấy địa chỉ công khai qua một dịch vụ tra cứu công khai, không cần cài thêm gì.`;
    }
    if (lower.includes('ping')) {
      return `[${this.activeModel}] Lệnh ping cơ bản trên Windows: ping 8.8.8.8 — còn trên Linux/macOS thêm -c 4 để giới hạn 4 lần gửi: ping -c 4 8.8.8.8.`;
    }
    if (lower.includes('wifi') || lower.includes('mạng')) {
      return `[${this.activeModel}] Nếu mạng chập chờn, thử: kiểm tra driver WiFi còn mới không, đổi DNS sang 1.1.1.1/8.8.8.8, hoặc khởi động lại router. Nói rõ triệu chứng để mình gợi ý sâu hơn nhé.`;
    }
    return `[${this.activeModel}] Mình ghi nhận câu hỏi: "${question}". Đây là bản mô phỏng cục bộ, phản hồi mang tính minh họa — khi bạn nối backend AI thật (qua API key trong Settings) mình sẽ trả lời chính xác hơn theo mô hình đã chọn.`;
  }

  clearChat() {
    this.$('aiMessages').innerHTML = `<div class="msg msg-ai"><div class="msg-bubble">Hội thoại đã được xóa. Hỏi mình bất cứ điều gì về mạng hoặc thiết bị nhé.</div></div>`;
  }

  // ===== SETTINGS =====
  saveKeys() {
    if (!['plus-trial', 'pro', 'max'].includes(this.plan)) { this.toast('Cần quyền Plus hoặc Pro để chỉnh sửa cấu hình AI.'); return; }
    const keys = {
      anthropic: this.$('keyAnthropic').value,
      openai: this.$('keyOpenAI').value,
      deepseek: this.$('keyDeepSeek').value,
      google: this.$('keyGoogle').value,
    };
    localStorage.setItem('icv_keys', JSON.stringify(keys));
    alert('Đã lưu khóa API trên trình duyệt này.');
  }

  loadKeys() {
    const keys = JSON.parse(localStorage.getItem('icv_keys') || '{}');
    if (keys.anthropic) this.$('keyAnthropic').value = keys.anthropic;
    if (keys.openai) this.$('keyOpenAI').value = keys.openai;
    if (keys.deepseek) this.$('keyDeepSeek').value = keys.deepseek;
    if (keys.google) this.$('keyGoogle').value = keys.google;
  }

  resetAll() {
    if (!confirm('Xóa toàn bộ dữ liệu cục bộ (thiết bị, khóa API, cài đặt)? Không thể hoàn tác.')) return;
    localStorage.clear();
    this.devices = [];
    this.renderDevices();
    this.updateDashboardStats();
    alert('Đã xóa toàn bộ dữ liệu.');
    location.reload();
  }
}

const app = new ICrackVie();
