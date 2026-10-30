// ==========================================================
// EduGlobal - ui.js
// Small helpers shared by every page:
//   1. Opens and closes the mobile menu
//   2. Adds a border to the header after you scroll
//   3. Writes the current year in the footer
// ==========================================================

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#nav-menu");
const header = document.querySelector(".site-header");

// 1. Mobile menu
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// 2. Header border on scroll
function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 8);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// 3. Footer year
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
                          
