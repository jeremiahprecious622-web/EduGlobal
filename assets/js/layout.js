// ==========================================================
// EduGlobal - layout.js
// Puts the same header, footer and icons on every public page,
// so you only edit the menu in ONE place.
// ==========================================================

const LINKS = [["index.html", "Home"], ["courses.html", "Courses"], ["teachers.html", "Teachers"], ["about.html", "About"], ["contact.html", "Contact"]];
const clean = (s) => s.replace(/\.html$/, "").replace(/\/$/, "");
const current = clean(location.pathname.split("/").pop() || "index");

const navLinks = LINKS.map(([href, label]) =>
  `<a href="${href}"${clean(href) === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-book" viewBox="0 0 24 24"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/></symbol>
<symbol id="i-cap" viewBox="0 0 24 24"><path d="M12 4l10 4.5-10 4.5L2 8.5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5"/><path d="M16 5a3.5 3.5 0 0 1 0 6.5M18 14.8c2 .6 3.3 2.3 3.5 5.2"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></symbol>
<symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></symbol>
<symbol id="i-video" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></symbol>
<symbol id="i-exam" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6z"/><path d="M9 8.5c0 3.2 3.3 6.5 6.5 6.5l1.2-1.4-2.3-1.1-.9.7a5 5 0 0 1-2.1-2.1l.7-.9-1.1-2.3z"/></symbol>
<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="M8 15l4-4 3 3 5-6"/></symbol>
<symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></symbol>
</svg>`;

const HEADER = `<header class="site-header"><div class="container nav">
<a class="brand" href="index.html" aria-label="EduGlobal home"><img src="assets/img/logo.svg" alt="EduGlobal" width="161" height="44"></a>
<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu"><svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<div class="nav-menu" id="nav-menu"><nav class="nav-links" aria-label="Main">${navLinks}</nav>
<div class="nav-actions"><a class="btn btn-ghost btn-sm" href="auth/student-login.html">Log in</a><a class="btn btn-primary btn-sm" href="auth/student-register.html">Create account</a></div></div>
</div></header>`;

const FOOTER = `<footer class="site-footer"><div class="container"><div class="footer-grid">
<div class="footer-brand"><img src="assets/img/logo.svg" alt="EduGlobal" width="153" height="42"><p>Your Future Has No Borders.</p></div>
<div><h4>Learn</h4><ul><li><a href="courses.html">Courses</a></li><li><a href="auth/student-register.html">Create account</a></li><li><a href="auth/student-login.html">Student login</a></li></ul></div>
<div><h4>Teach</h4><ul><li><a href="teacher-apply.html">Apply to teach</a></li><li><a href="auth/teacher-login.html">Teacher login</a></li><li><a href="teachers.html">Our teachers</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li></ul></div>
</div><div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} EduGlobal. All rights reserved.</p><p>Learn. Grow. Achieve.</p></div></div></footer>`;

document.body.insertAdjacentHTML("afterbegin", SPRITE);
const h = document.getElementById("site-header"); if (h) h.outerHTML = HEADER;
const f = document.getElementById("site-footer"); if (f) f.outerHTML = FOOTER;

const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");
const header = document.querySelector(".site-header");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) menu.classList.remove("open"); });
}
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
  
