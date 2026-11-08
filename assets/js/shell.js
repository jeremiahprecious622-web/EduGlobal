// ==========================================================
// EduGlobal - shell.js
// Builds the top bar (phone), sidebar (laptop) and bottom icons (phone)
// for the admin and teacher pages, so every page looks the same.
// Usage: mountShell({ items, onLogout })
// ==========================================================

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="s-home" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5z"/></symbol>
<symbol id="s-video" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></symbol>
<symbol id="s-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5"/><path d="M16 5a3.5 3.5 0 0 1 0 6.5M18 14.8c2 .6 3.3 2.3 3.5 5.2"/></symbol>
<symbol id="s-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></symbol>
<symbol id="s-book" viewBox="0 0 24 24"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/></symbol>
<symbol id="s-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></symbol>
<symbol id="s-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c.6-4 3.7-6.5 8-6.5s7.4 2.5 8 6.5"/></symbol>
</svg>`;

export function mountShell({ items, onLogout }) {
  const main = document.querySelector("main.app-main");
  if (!main) return;
  document.body.insertAdjacentHTML("afterbegin", SPRITE);

  const link = (it) => {
    const href = "../" + it.path + ".html" + (it.hash ? "#" + it.hash : "");
    return `<a href="${href}" data-path="${it.path}" data-hash="${it.hash || ""}" data-default="${it.default ? "1" : ""}"><svg class="icon"><use href="#s-${it.icon}"/></svg><span>${it.label}</span></a>`;
  };
  // The administrator menu always includes the question bank
  const menu = items.slice();
  const at = menu.findIndex((i) => i.path === "admin/manage-teachers");
  if (at >= 0 && !menu.some((i) => i.path === "admin/question-bank")) {
    menu.splice(at + 1, 0, { path: "admin/question-bank", label: "Questions", icon: "book" });
  }
  const links = menu.map(link).join("");

  main.insertAdjacentHTML("beforebegin", `
    <header class="app-top"><a href="../index.html"><img src="../assets/img/logo.svg" alt="EduGlobal" width="146" height="40"></a>
      <button class="btn btn-ghost btn-sm js-logout" type="button">Log out</button></header>
    <aside class="app-side"><a class="logo" href="../index.html"><img src="../assets/img/logo.svg" alt="EduGlobal" width="146" height="40"></a>
      <nav class="side-nav" aria-label="Menu">${links}</nav>
      <div class="side-bottom"><button class="btn btn-ghost btn-sm btn-block js-logout" type="button">Log out</button></div></aside>`);
  main.insertAdjacentHTML("afterend", `<nav class="bottom-nav auto" aria-label="Menu">${links}</nav>`);

  function markActive() {
    const here = location.pathname.replace(/\.html$/, "");
    document.querySelectorAll(".side-nav a, .bottom-nav a").forEach((a) => {
      const pathMatch = here.endsWith("/" + a.dataset.path);
      const hash = a.dataset.hash;
      const hashMatch = !hash || location.hash === "#" + hash || (!location.hash && a.dataset.default === "1");
      if (pathMatch && hashMatch) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  markActive();
  window.addEventListener("hashchange", markActive);
  document.querySelectorAll(".js-logout").forEach((b) => b.addEventListener("click", onLogout));
    }
                                                 
