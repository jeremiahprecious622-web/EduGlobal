// ==========================================================
// EduGlobal - ui.js  (homepage helpers)
// 1. Mobile menu  2. Header shadow  3. Footer year
// 4. Live class card and the "Join online lesson" button
// The timetable lives in live-schedule.js
// ==========================================================

import { LIVE, liveStatus, formatTime, daysText, localRangeText } from "./live-schedule.js";
// Loaded safely: if session-ui.js is missing or old, the rest of the homepage still works
let applySessionUi = () => {};
let sessionDestination = () => null;
try {
  const session = await import("./session-ui.js");
  if (session.applySessionUi) applySessionUi = session.applySessionUi;
  if (session.sessionDestination) sessionDestination = session.sessionDestination;
} catch (e) { /* ignore */ }

const DASHBOARD = "student/dashboard.html#live"; // logged-out visitors are sent to the login page automatically

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

applySessionUi();

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

function updateLive() {
  const status = liveStatus();
  const fab = $("#live-fab"), badge = $("#live-badge"), when = $("#live-when"), join = $("#live-join");

  // A new visitor goes to registration. Someone already logged in goes to their dashboard.
  const dest = sessionDestination();
  const target = dest ? (dest === "student/dashboard.html" ? DASHBOARD : dest) : "auth/student-register.html";
  if (fab) { fab.href = target; fab.hidden = !status.live; }
  if (join) {
    join.href = target;
    join.textContent = dest ? (status.live ? "Join online lesson" : "Open my dashboard") : "Join as a student to attend";
  }
  if (badge) {
    badge.className = status.live ? "badge live" : "badge";
    badge.textContent = status.live ? "Live now" : "Live classes";
    if (status.live) badge.prepend(Object.assign(document.createElement("span"), { className: "dot" }));
  }
  if (when) when.textContent = status.live
    ? `Class is on until ${formatTime(LIVE.end)}`
    : `Next class: ${status.nextLabel}, ${formatTime(LIVE.start)}`;
}

const title = $("#live-title"); if (title) title.textContent = LIVE.title;
const days = $("#live-days"); if (days) days.textContent = daysText();
const localLine = $("#live-local"); if (localLine) localLine.textContent = localRangeText();
updateLive();
setInterval(updateLive, 30000);
  
