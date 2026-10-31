// ==========================================================
// EduGlobal - session-ui.js
// If this device is already logged in, the public pages show
// "My dashboard" instead of the login and sign-up buttons.
// (It only reads a small note saved on this device. It does not load Firebase.)
// ==========================================================

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
const DASHBOARDS = {
  student: "student/dashboard.html",
  teacher: "teacher/dashboard.html",
  superadmin: "admin/dashboard.html"
};

export function applySessionUi() {
  let role = null, last = 0;
  try {
    role = localStorage.getItem("eg_role");
    last = Number(localStorage.getItem("eg_last_active") || 0);
  } catch (e) { return; }
  if (!role || !DASHBOARDS[role]) return;
  if (!last || Date.now() - last > ONE_YEAR) return;
  try { localStorage.setItem("eg_last_active", String(Date.now())); } catch (e) {}

  const dest = DASHBOARDS[role];
  const actions = document.querySelector(".nav-actions");
  if (actions) {
    actions.innerHTML = "";
    const link = document.createElement("a");
    link.className = "btn btn-primary btn-sm";
    link.href = dest;
    link.textContent = "My dashboard";
    actions.append(link);
  }
  document.querySelectorAll("[data-session-cta]").forEach((a) => { a.href = dest; a.textContent = "Go to my dashboard"; });
      }
      
