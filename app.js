"use strict";

const $ = (id) => document.getElementById(id);

const KEYS = {
  devices: "neon_devices_v4",
  server: "neon_server_v4"
};

function load(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val === null ? fallback : JSON.parse(val);
  } catch {
    return fallback;
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch {
    showToast("Lỗi bộ nhớ trình duyệt!");
    return false;
  }
}

let devices = load(KEYS.devices, []);
let serverConfig = load(KEYS.server, { url: "", healthPath: "/health" });
let toastTimer;

function showToast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove("visible");
  }, 2400);
}

function switchScreen(targetID) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.toggle("active", s.id === "screen-" + targetID);
  });
  document.querySelectorAll(".bottom-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === targetID);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (targetID === "tools") renderDevices();
  if (targetID === "settings") fillServerForm();
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => {
    switchScreen(el.dataset.target);
  });
});

if ($("currentDate")) {
  $("currentDate").textContent = new Date().toLocaleDateString("vi-VN");
}

function updateStats() {
  if ($("statDevices")) $("statDevices").textContent = devices.length;
  if ($("deviceSubtitle")) $("deviceSubtitle").textContent = devices.length + " thiết bị";
  if ($("statServer")) {
    $("statServer").textContent = serverConfig.url ? "ĐÃ CẤU HÌNH" : "CHƯA KẾT NỐI";
  }
  if ($("serverSummary")) {
    $("serverSummary").textContent = serverConfig.url ? serverConfig.url : "Chưa có endpoint";
  }
}

function renderDevices() {
  const container = $("allDevices");
  if (!container) return;

  if (devices.length === 0) {
    container.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:15px; font-size:12px;">Chưa có thiết bị nào được lưu.</div>';
    updateStats();
    return;
  }

  container.innerHTML = devices.map(d => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:10px 14px; border-radius:8px; border:1px solid var(--border-light); margin-bottom:8px;">
      <div>
        <b style="font-size:13px; color:var(--text-main);">${escapeHTML(d.name)}</b>
        <small style="display:block; color:var(--neon-cyan); font-family:var(--font-mono);">${escapeHTML(d.ip)}</small>
        ${d.note ? `<small style="color:var(--text-muted);">${escapeHTML(d.note)}</small>` : ""}
      </div>
      <div style="display:flex; gap:6px;">
        <button class="secondary-btn" style="padding:6px 10px; font-size:11px;" onclick="copyIP('${d.ip}')">Copy</button>
        <button class="secondary-btn" style="padding:6px 10px; font-size:11px; color:var(--neon-magenta); border-color:rgba(255,0,85,0.3);" onclick="deleteDevice('${d.id}')">Xóa</button>
      </div>
    </div>
  `).join("");
  updateStats();
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

window.copyIP = async function(ip) {
  try {
    await navigator.clipboard.writeText(ip);
    showToast("Đã sao chép IP: " + ip);
  } catch {
    showToast("Không thể sao chép tự động.");
  }
};

window.deleteDevice = function(id) {
  devices = devices.filter(d => d.id !== id);
  save(KEYS.devices, devices);
  renderDevices();
  showToast("Đã xóa thiết bị.");
};

if ($("deviceForm")) {
  $("deviceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("deviceName").value.trim();
    const ip = $("deviceIP").value.trim();
    const note = $("deviceNote").value.trim();

    const parts = ip.split(".");
    const isValidIP = parts.length === 4 && parts.every(p => /^\d{1,3}$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
    if (!isValidIP) {
      showToast("Địa chỉ IPv4 không hợp lệ!");
      return;
    }

    const newDev = { id: Date.now().toString(36), name, ip, note };
    devices.unshift(newDev);
    if (save(KEYS.devices, devices)) {
      e.target.reset();
      renderDevices();
      showToast("Đã thêm thiết bị thành công!");
    }
  });
}

function fillServerForm() {
  if ($("serverURL")) $("serverURL").value = serverConfig.url || "";
  if ($("healthPath")) $("healthPath").value = serverConfig.healthPath || "/health";
}

if ($("serverForm")) {
  $("serverForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const rawURL = $("serverURL").value.trim();
    const healthPath = $("healthPath").value.trim();

    try {
      const parsed = new URL(rawURL);
      serverConfig = {
        url: parsed.origin + parsed.pathname.replace(/\/+$/, ""),
        healthPath: healthPath.startsWith("/") ? healthPath : "/" + healthPath
      };
      save(KEYS.server, serverConfig);
      fillServerForm();
      updateStats();
      showToast("Đã lưu cấu hình server!");
    } catch {
      showToast("URL Server không hợp lệ!");
    }
  });
}

if ($("testServerBtn")) {
  $("testServerBtn").addEventListener("click", async () => {
    const resBox = $("serverResult");
    if (!serverConfig.url) {
      resBox.textContent = "Lỗi: Chưa cấu hình Server URL!";
      showToast("Chưa nhập URL server.");
      return;
    }

    resBox.textContent = "Đang kết nối đến server...";
    const targetURL = serverConfig.url + serverConfig.healthPath;

    try {
      const controller = new AbortController();
      const timeoutID = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(targetURL, { method: "GET", signal: controller.signal });
      clearTimeout(timeoutID);

      if (!res.ok) throw new Error("HTTP Status: " + res.status);
      const data = await res.json();

      resBox.className = "inline-result text-success";
      resBox.textContent = `[OK] Kết nối thành công tới ${targetURL}\nPhản hồi: ` + JSON.stringify(data, null, 2);
      showToast("Server phản hồi tốt!");
      
      const dot = $("connectionDot");
      if (dot) {
        dot.className = "online";
        $("connectionText").textContent = "ONLINE";
      }
    } catch (err) {
      resBox.className = "inline-result text-error";
      resBox.textContent = `[FAIL] Không thể kết nối tới ${targetURL}\nLỗi: ${err.message}`;
      showToast("Kết nối thất bại!");
      
      const dot = $("connectionDot");
      if (dot) {
        dot.className = "offline";
        $("connectionText").textContent = "OFFLINE";
      }
    }
  });
}

const terminalOutput = $("terminalOutput");
function appendTerminal(text, isError
          
