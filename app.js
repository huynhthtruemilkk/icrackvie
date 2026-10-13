"use strict";

const $ = (id) => document.getElementById(id);

const KEYS = {
  devices: "neon_devices_v1",
  server: "neon_server_v1",
  logs: "neon_logs_v1"
};

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast("Không thể lưu. Kiểm tra bộ nhớ trình duyệt.");
    return false;
  }
}

let devices = load(KEYS.devices, []);
let server = load(KEYS.server, { url: "", healthPath: "/health" });
let logs = load(KEYS.logs, []);
let toastTimer;

function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove("show"); }, 2400);
}

function log(message) {
  logs.unshift({
    time: new Date().toLocaleString("vi-VN"),
    message: String(message)
  });
  logs = logs.slice(0, 150);
  save(KEYS.logs, logs);
  renderLogs();
  updateStats();
}

function isIPv4(value) {
  const parts = value.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every(part => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function switchTab(name) {
  const page = $("page-" + name);
  if (!page) return;

  document.querySelectorAll(".page").forEach(el => {
    el.classList.toggle("active", el === page);
  });

  document.querySelectorAll("[data-tab]").forEach(el => {
    el.classList.toggle("active", el.dataset.tab === name);
  });

  const names = {
    dashboard: "Dashboard",
    devices: "Devices",
    network: "Network / IPv4",
    server: "Server",
    logs: "Event logs"
  };

  if ($("pageName")) $("pageName").textContent = names[name] || name;
  const sidebar = $("sidebar");
  if (sidebar) sidebar.classList.remove("mobile-open");
  document.body.classList.remove("menu-open");

  if (name === "devices") renderDevices();
  if (name === "network") renderShortcuts();
  if (name === "server") fillServerForm();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-tab]").forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.go);
  });
});

const menuBtn = $("menuBtn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const sidebar = $("sidebar");
    const opened = sidebar.classList.toggle("mobile-open");
    document.body.classList.toggle("menu-open", opened);
  });
}

function updateStats() {
  if ($("deviceCount")) $("deviceCount").textContent = devices.length;
  if ($("statDevices")) $("statDevices").textContent = devices.length;
  if ($("statLogs")) $("statLogs").textContent = logs.length;
  if ($("logSubtitle")) $("logSubtitle").textContent = logs.length + " sự kiện";
  if ($("serverSummary")) $("serverSummary").textContent = server.url ? server.url : "Chưa cấu hình endpoint";
  if ($("statServer")) $("statServer").textContent = server.url ? "ĐÃ CẤU HÌNH" : "CHƯA CẤU HÌNH";
  if ($("deviceSubtitle")) $("deviceSubtitle").textContent = devices.length + " thiết bị";
}

function deviceHTML(device) {
  return `
    <article class="device-row">
      <div class="device-symbol">▣</div>
      <div class="device-info">
        <b>${escapeHTML(device.name)}</b>
        <small>${escapeHTML(device.ip)}</small>
        ${device.note ? `<small>${escapeHTML(device.note)}</small>` : ""}
      </div>
      <div class="device-actions">
        <button class="small-btn" data-device-action="copy" data-id="${escapeHTML(device.id)}">Sao chép IP</button>
        <button class="small-btn" data-device-action="check" data-id="${escapeHTML(device.id)}">Kiểm tra</button>
        <button class="small-btn delete" data-device-action="delete" data-id="${escapeHTML(device.id)}">Xóa</button>
      </div>
    </article>`;
}

function renderDevices() {
  const empty = '<div class="empty">Chưa có thiết bị. Thêm IPv4 ở phía trên.</div>';
  if ($("allDevices")) $("allDevices").innerHTML = devices.length ? devices.map(deviceHTML).join("") : empty;
  if ($("recentDevices")) $("recentDevices").innerHTML = devices.length ? devices.slice(0, 3).map(deviceHTML).join("") : empty;
  renderShortcuts();
  updateStats();
}

const deviceForm = $("deviceForm");
if (deviceForm) {
  deviceForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("deviceName").value.trim();
    const ip = $("deviceIP").value.trim();
    const note = $("deviceNote").value.trim();

    if (!name) { toast("Nhập tên thiết bị."); return; }
    if (!isIPv4(ip)) { toast("Địa chỉ IPv4 không hợp lệ."); $("deviceIP").focus(); return; }
    if (devices.some(device => device.ip === ip)) { toast("IPv4 này đã có trong danh sách."); return; }

    const device = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name, ip, note };
    devices.unshift(device);
    if (!save(KEYS.devices, devices)) { devices.shift(); return; }

    event.target.reset();
    renderDevices();
    log("Đã thêm thiết bị " + name + " (" + ip + ")");
    toast("Đã lưu thiết bị.");
  });
}

document.addEventListener("click", async event => {
  const button = event.target.closest("[data-device-action]");
  if (!button) return;
  const device = devices.find(item => item.id === button.dataset.id);
  if (!device) return;

  const action = button.dataset.deviceAction;
  if (action === "copy") {
    try {
      await navigator.clipboard.writeText(device.ip);
      toast("Đã sao chép IPv4.");
    } catch {
      $("checkIP").value = device.ip;
      switchTab("network");
      toast("Đã điền IP vào công cụ kiểm tra.");
    }
    log("Sao chép IPv4: " + device.ip);
  }
  if (action === "check") {
    $("checkIP").value = device.ip;
    switchTab("network");
    if ($("ipForm")) $("ipForm").requestSubmit();
  }
  if (action === "delete") {
    if (!confirm("Xóa thiết bị " + device.name + "?")) return;
    devices = devices.filter(item => item.id !== device.id);
    save(KEYS.devices, devices);
    renderDevices();
    log("Đã xóa thiết bị " + device.name);
    toast("Đã xóa thiết bị.");
  }
});

const refreshBtn = $("refreshDevices");
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    renderDevices();
    toast("Danh sách đã cập nhật.");
  });
}

function renderShortcuts() {
  const ipShortcuts = $("ipShortcuts");
  if (!ipShortcuts) return;
  ipShortcuts.innerHTML = devices.length
    ? devices.map(d => `<button class="shortcut" data-fill-ip="${escapeHTML(d.id)}"><span class="cyan">▣</span><span>${escapeHTML(d.name)}</span><code>${escapeHTML(d.ip)}</code></button>`).join("")
    : '<div class="empty">Chưa có IPv4 đã lưu.</div>';
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-fill-ip]");
  if (!button) return;
  const device = devices.find(item => item.id === button.dataset.fillIp);
  if (!device) return;
  $("checkIP").value = device.ip;
  if ($("ipResult")) {
    $("ipResult").querySelector("b").textContent = "Đã chọn thiết bị";
    $("ipResult").querySelector("small").textContent = device.ip;
  }
  toast("Đã chọn " + device.name);
});

const ipForm = $("ipForm");
if (ipForm) {
  ipForm.addEventListener("submit", event => {
    event.preventDefault();
    const ip = $("checkIP").value.trim();
    const result = $("ipResult");
    if (!result) return;
    const dot = result.querySelector(".result-dot");
    const title = result.querySelector("b");
    const detail = result.querySelector("small");

    if (!isIPv4(ip)) {
      dot.style.background = "#f06292";
      title.textContent = "IPv4 không hợp lệ";
      detail.textContent = "Cần đúng 4 nhóm số từ 0 đến 255.";
      return;
    }
    dot.style.background = "#b06ef3";
    title.textContent = "Định dạng hợp lệ";
    detail.textContent = ip + " · Sẵn sàng.";
    toast("Kiểm tra cú pháp thành công.");
  });
}

function fillServerForm() {
  if ($("serverURL")) $("serverURL").value = server.url || "";
  if ($("healthPath")) $("healthPath").value = server.healthPath || "/health";
}

const serverForm = $("serverForm");
if (serverForm) {
  serverForm.addEventListener("submit", event => {
    event.preventDefault();
    const rawURL = $("serverURL").value.trim();
    const healthPath = $("healthPath").value.trim();

    let parsed;
    try { parsed = new URL(rawURL); } catch { toast("URL server không hợp lệ."); return; }

    server = { url: parsed.origin + parsed.pathname.replace(/\/+$/, ""), healthPath };
    save(KEYS.server, server);
    fillServerForm();
    updateStats();
    log("Đã lưu cấu hình server: " + server.url);
    toast("Đã lưu cấu hình.");
  });
}

const testServerBtn = $("testServer");
if (testServerBtn) {
  testServerBtn.addEventListener("click", async () => {
    if (!server.url) { toast("Hãy lưu URL server trước."); return; }
    const result = $("serverResult");
    if (!result) return;
    const dot = result.querySelector(".result-dot");
    const title = result.querySelector("b");
    const detail = result.querySelector("small");

    title.textContent = "Đang kiểm tra...";
    detail.textContent = "Đang gọi endpoint health-check.";
    dot.style.background = "#b06ef3";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const url = server.url.replace(/\/+$/, "") + (server.healthPath.startsWith("/") ? server.healthPath : "/" + server.healthPath);

    try {
      const response = await fetch(url, { method: "GET", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("HTTP " + response.status);

      dot.style.background = "#f06292";
      title.textContent = "Server phản hồi HTTP " + response.status;
      detail.textContent = url;
      log("Health-check thành công: " + url);
      toast("Server phản hồi tốt.");
    } catch (error) {
      dot.style.background = "#f06292";
      title.textContent = "Không kết nối được server";
      detail.textContent = error.name === "AbortError" ? "Hết thời gian chờ (Timeout)." : "Lỗi mạng hoặc CORS.";
      log("Health-check thất bại: " + url);
      toast("Kiểm tra thất bại.");
    } finally {
      clearTimeout(timeout);
    }
  });
}

function renderLogs() {
  const logList = $("logList");
  if (!logList) return;
  logList.innerHTML = logs.length
    ? logs.map(item => `<article class="log-row"><time>${escapeHTML(item.time)}</time><p>${escapeHTML(item.message)}</p></article>`).join("")
    : '<div class="empty">Chưa có sự kiện nào.</div>';
}

const clearLogsBtn = $("clearLogs");
if (clearLogsBtn) {
  clearLogsBtn.addEventListener("click", () => {
    if (!confirm("Xóa toàn bộ nhật ký?")) return;
    logs = [];
    save(KEYS.logs, logs);
    renderLogs();
    updateStats();
    toast("Đã xóa nhật ký.");
  });
}

fillServerForm();
renderDevices();
renderLogs();
updateStats();
log("Giao diện NEON CONTROL đã khởi tạo.");
