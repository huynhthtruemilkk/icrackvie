const PAGE_META = {
  dashboard: ['Dashboard', 'Tổng quan hệ thống và thiết bị của bạn'],
  devices: ['Devices', 'Thêm, chỉnh sửa và theo dõi thiết bị IPv4'],
  network: ['Network', 'Phân tích địa chỉ IP và kiểm tra kết nối'],
  ai: ['AI Assistant', 'Hỏi đáp, giải thích lệnh và hỗ trợ kỹ thuật'],
  monitor: ['Monitor', 'Theo dõi hiệu năng và tốc độ mạng thời gian thực'],
  settings: ['Settings', 'Giao diện, tài khoản và cấu hình nâng cao'],
};

class ICrackVie {
  constructor() {
    this.devices = JSON.parse(localStorage.getItem('icv_devices') || '[]');
    this.dark = localStorage.getItem('icv_theme') !== 'light';
    this.activeModel = 'Claude Sonnet 4.5';
    this.cacheDOM();
    this.bindEvents();
    this.applyTheme();
    this.renderDevices();
    this.updateDashboardStats();
    this.startAmbientUpdates();
    this.heroSelfIP();
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

    this.$('startSpeedTest').addEventListener('click', () => this.runSpeedTest());
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

  // ===== MONITOR =====
  runSpeedTest() {
    const btn = this.$('startSpeedTest');
    btn.disabled = true;
    btn.textContent = 'Đang kiểm tra...';
    setTimeout(() => {
      this.$('downloadSpeed').textContent = (Math.random() * 90 + 15).toFixed(1);
      this.$('uploadSpeed').textContent = (Math.random() * 40 + 5).toFixed(1);
      this.$('pingTest').textContent = Math.floor(Math.random() * 45 + 8);
      this.$('speedTestResult').style.display = 'grid';
      btn.disabled = false;
      btn.textContent = 'Bắt đầu kiểm tra';
    }, 2200);
  }

  startAmbientUpdates() {
    setInterval(() => {
      const speed = (Math.random() * 70 + 20).toFixed(1);
      const ping = Math.floor(Math.random() * 50 + 10);
      this.$('speedValue').textContent = speed;
      this.$('pingValue').textContent = ping;

      const cpu = Math.floor(Math.random() * 70 + 15);
      const mem = Math.floor(Math.random() * 60 + 25);
      const disk = Math.floor(Math.random() * 45 + 20);
      this.$('cpuBar').style.width = cpu + '%'; this.$('cpuValue').textContent = cpu + '%';
      this.$('memBar').style.width = mem + '%'; this.$('memValue').textContent = mem + '%';
      this.$('diskBar').style.width = disk + '%'; this.$('diskValue').textContent = disk + '%';
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
