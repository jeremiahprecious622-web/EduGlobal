// ==========================================================
// EduGlobal - ui.js
// 1. Mobile menu   2. Header shadow on scroll   3. Footer year
// 4. LIVE CLASS: shows the "Join online lesson" button at class time
// ==========================================================

// ---------- EDIT THIS: your live class timetable ----------
const LIVE = {
  timezone: "Africa/Lagos",        // Nigeria time
  days: [1, 4, 5],                 // 0=Sunday 1=Monday 2=Tuesday 3=Wednesday 4=Thursday 5=Friday 6=Saturday
  start: "17:00",                  // class starts (24-hour clock)
  end: "20:00",                    // class ends
  title: "EduGlobal Live Class",
  joinUrl: "auth/student-login.html" // students log in first. Stage 9 will open the Google Meet link here.
};
// -----------------------------------------------------------

const $ = (selector) => document.querySelector(selector);
const toggle = $(".nav-toggle");
const menu = $("#nav-menu");
const header = $(".site-header");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
}

function updateHeader() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Live class logic ----------
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function nowInSchoolTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LIVE.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute"))
  };
}

function liveStatus() {
  const now = nowInSchoolTime();
  const start = toMinutes(LIVE.start), end = toMinutes(LIVE.end);
  if (LIVE.days.includes(now.day) && now.minutes >= start && now.minutes < end) return { live: true };
  for (let ahead = 0; ahead <= 7; ahead++) {
    const day = (now.day + ahead) % 7;
    if (!LIVE.days.includes(day)) continue;
    if (ahead === 0 && now.minutes >= start) continue;
    return { live: false, label: ahead === 0 ? "Today" : ahead === 1 ? "Tomorrow" : DAY_NAMES[day] };
  }
  return { live: false, label: "Soon" };
}

function updateLive() {
  const status = liveStatus();
  const fab = $("#live-fab"), badge = $("#live-badge"), when = $("#live-when"), join = $("#live-join");
  if (fab) { fab.href = LIVE.joinUrl; fab.hidden = !status.live; }
  if (join) { join.href = LIVE.joinUrl; join.textContent = status.live ? "Join online lesson" : "Log in to join"; }
  if (badge) {
    badge.className = status.live ? "badge live" : "badge";
    badge.textContent = status.live ? "Live now" : "Live classes";
    if (status.live) badge.prepend(Object.assign(document.createElement("span"), { className: "dot" }));
  }
  if (when) when.textContent = status.live
    ? `Class is on until ${formatTime(LIVE.end)}`
    : `Next class: ${status.label}, ${formatTime(LIVE.start)}`;
}

const title = $("#live-title"); if (title) title.textContent = LIVE.title;
const days = $("#live-days");
if (days) {
  const names = LIVE.days.map((d) => DAY_NAMES[d]);
  const list = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names.slice(-1) : names[0];
  days.textContent = `Every ${list}, ${formatTime(LIVE.start)} to ${formatTime(LIVE.end)}`;
}
updateLive();
setInterval(updateLive, 30000);
                        
