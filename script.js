// iCrack Vie - Network Control Panel
// Version 3.1 - Green Edition

class iCrackVie {
    constructor() {
        this.devices = JSON.parse(localStorage.getItem('devices')) || [];
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.setupDarkMode();
        this.updateDashboard();
        this.simulateRealTimeData();
    }

    setupDOM() {
        this.elements = {
            pages: document.querySelectorAll('.page'),
            navItems: document.querySelectorAll('.nav-item'),
            themeToggle: document.getElementById('themToggle'),
            menuToggle: document.getElementById('menuToggle'),
            sidebar: document.querySelector('.sidebar'),
            addDeviceForm: document.getElementById('addDeviceForm'),
            analyzerForm: document.getElementById('analyzerForm'),
            recentDevices: document.getElementById('recentDevices'),
            allDevices: document.getElementById('allDevices'),
            darkModeToggle: document.getElementById('darkModeToggle'),
            checkPublicIP: document.getElementById('checkPublicIP'),
            startSpeedTest: document.getElementById('startSpeedTest'),
            resetBtn: document.getElementById('resetBtn'),
            activeDevices: document.getElementById('activeDevices'),
            netStatus: document.getElementById('netStatus'),
            speedValue: document.getElementById('speedValue'),
            pingValue: document.getElementById('pingValue'),
        };
    }

    setupEventListeners() {
        // Navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());

        // Menu toggle (mobile)
        this.elements.menuToggle.addEventListener('click', () => {
            this.elements.sidebar.classList.toggle('active');
        });

        // Forms
        this.elements.addDeviceForm.addEventListener('submit', (e) => this.handleAddDevice(e));
        this.elements.analyzerForm.addEventListener('submit', (e) => this.handleAnalyzer(e));

        // Buttons
        this.elements.checkPublicIP.addEventListener('click', () => this.getPublicIP());
        this.elements.startSpeedTest.addEventListener('click', () => this.startSpeedTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetAllData());

        // Copy IP
        const copyBtn = document.getElementById('copyIP');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    setupDarkMode() {
        this.elements.darkModeToggle.checked = this.darkMode;
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            this.elements.themeToggle.innerHTML = '<span class="icon">☀️</span>';
        } else {
            this.elements.themeToggle.innerHTML = '<span class="icon">🌙</span>';
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        document.body.classList.toggle('dark-mode');
        this.elements.themeToggle.innerHTML = `<span class="icon">${this.darkMode ? '☀️' : '🌙'}</span>`;
        this.elements.darkModeToggle.checked = this.darkMode;
    }

    toggleDarkMode() {
        this.toggleTheme();
    }

    navigateTo(pageId) {
        // Update nav items
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        // Update pages
        this.elements.pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');

        // Close mobile menu
        this.elements.sidebar.classList.remove('active');
    }

    handleAddDevice(e) {
        e.preventDefault();
        const name = document.getElementById('deviceName').value;
        const ip = document.getElementById('deviceIP').value;
        const port = document.getElementById('devicePort').value || 80;
        const note = document.getElementById('deviceNote').value;

        if (!name || !ip) {
            alert('Vui lòng nhập tên và IP!');
            return;
        }

        const device = {
            id: Date.now(),
            name,
            ip,
            port,
            note,
            status: 'online',
            added: new Date().toLocaleDateString('vi-VN')
        };

        this.devices.push(device);
        localStorage.setItem('devices', JSON.stringify(this.devices));

        // Reset form
        this.elements.addDeviceForm.reset();
        this.renderDevices();
        alert('✓ Thiết bị đã được thêm thành công!');
    }

    handleAnalyzer(e) {
        e.preventDefault();
        const ip = document.getElementById('analyzeIP').value;
        const port = document.getElementById('analyzePort').value || 80;

        if (!ip) {
            alert('Vui lòng nhập IP!');
            return;
        }

        // Simulate analysis
        const resultEl = document.getElementById('analyzeResult');
        const isOnline = Math.random() > 0.3;
        const time = Math.floor(Math.random() * 100) + 20;

        document.getElementById('resultStatus').textContent = isOnline ? 'Kết nối ✓' : 'Không kết nối ✗';
        document.getElementById('resultTime').textContent = time + 'ms';
        document.getElementById('resultDesc').textContent = isOnline ? 'Thiết bị đang hoạt động bình thường' : 'Không thể kết nối đến thiết bị';

        resultEl.style.display = 'block';
    }

    getPublicIP() {
        const resultEl = document.getElementById('publicIPResult');
        // Simulate IP fetch
        const mockIP = `203.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        document.getElementById('ipDisplay').textContent = mockIP;
        resultEl.style.display = 'block';
    }

    copyToClipboard() {
        const ip = document.getElementById('ipDisplay').textContent;
        navigator.clipboard.writeText(ip).then(() => {
            const btn = document.getElementById('copyIP');
            const original = btn.textContent;
            btn.textContent = '✓ Đã sao chép!';
            setTimeout(() => btn.textContent = original, 2000);
        });
    }

    startSpeedTest() {
        const btn = this.elements.startSpeedTest;
        btn.disabled = true;
        btn.textContent = '⏳ Đang kiểm tra...';

        // Simulate speed test
        setTimeout(() => {
            const download = (Math.random() * 100 + 20).toFixed(2);
            const upload = (Math.random() * 50 + 5).toFixed(2);
            const ping = Math.floor(Math.random() * 50 + 10);

            document.getElementById('downloadSpeed').textContent = download;
            document.getElementById('uploadSpeed').textContent = upload;
            document.getElementById('pingTest').textContent = ping;

            document.getElementById('speedTestResult').style.display = 'grid';

            btn.disabled = false;
            btn.textContent = '🚀 Bắt đầu kiểm tra tốc độ';
        }, 3000);
    }

    renderDevices() {
        // Recent devices
        this.elements.recentDevices.innerHTML = this.devices.length === 0 
            ? '<div class="empty-state">Chưa có thiết bị nào</div>'
            : this.devices.slice(-3).reverse().map(d => this.createDeviceElement(d)).join('');

        // All devices
        this.elements.allDevices.innerHTML = this.devices.length === 0 
            ? '<div class="empty-state">Chưa có thiết bị nào. Hãy thêm thiết bị đầu tiên!</div>'
            : this.devices.map(d => this.createDeviceElement(d)).join('');
    }

    createDeviceElement(device) {
        return `
            <div class="device-item">
                <div class="device-info">
                    <h3>${device.name}</h3>
                    <div class="device-ip">${device.ip}:${device.port}</div>
                    ${device.note ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">${device.note}</p>` : ''}
                </div>
                <div class="device-status">
                    <span class="status-badge ${device.status === 'online' ? 'status-online' : 'status-offline'}">
                        ● ${device.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                    <button class="btn" onclick="icrashVie.deleteDevice(${device.id})" style="background: #fee2e2; color: #991b1b;">🗑️</button>
                </div>
            </div>
        `;
    }

    deleteDevice(id) {
        if (confirm('Xóa thiết bị này?')) {
            this.devices = this.devices.filter(d => d.id !== id);
            localStorage.setItem('devices', JSON.stringify(this.devices));
            this.renderDevices();
            this.updateDashboard();
        }
    }

    resetAllData() {
        if (confirm('⚠️ Bạn chắc chắn muốn xóa TẤT CẢ dữ liệu? (Không thể hoàn tác)')) {
            this.devices = [];
            localStorage.clear();
            this.renderDevices();
            this.updateDashboard();
            alert('✓ Tất cả dữ liệu đã được xóa!');
        }
    }

    updateDashboard() {
        this.elements.activeDevices.textContent = this.devices.filter(d => d.status === 'online').length;
        this.elements.netStatus.textContent = this.devices.length > 0 ? '✓ Bình thường' : '-';
        this.renderDevices();
    }

    simulateRealTimeData() {
        setInterval(() => {
            // Simulate speed
            const speed = (Math.random() * 80 + 20).toFixed(1);
            const ping = Math.floor(Math.random() * 60 + 10);

            this.elements.speedValue.textContent = speed;
            this.elements.pingValue.textContent = ping;

            // Simulate monitor data
            const cpu = Math.floor(Math.random() * 80 + 10);
            const mem = Math.floor(Math.random() * 70 + 20);
            const disk = Math.floor(Math.random() * 50 + 20);

            document.getElementById('cpuBar').style.width = cpu + '%';
            document.getElementById('cpuValue').textContent = cpu + '%';

            document.getElementById('memBar').style.width = mem + '%';
            document.getElementById('memValue').textContent = mem + '%';

            document.getElementById('diskBar').style.width = disk + '%';
            document.getElementById('diskValue').textContent = disk + '%';

            // Update device statuses randomly
            this.devices.forEach(device => {
                device.status = Math.random() > 0.1 ? 'online' : 'offline';
            });
        }, 5000);
    }
}

// Initialize app
const icrashVie = new iCrackVie();

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.btn-icon')) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});
