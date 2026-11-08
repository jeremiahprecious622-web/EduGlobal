// ==========================================================
// EduGlobal - register-core.js
// Shared by the student AND teacher registration pages:
// password checks, show/hide password, the "are you sure" pop-up,
// and a few small helpers. Change it here, and both pages update.
// ==========================================================

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

const RULES = {
  length: (p) => p.length >= 8,
  lower: (p) => /[a-z]/.test(p),
  upper: (p) => /[A-Z]/.test(p),
  number: (p) => /[0-9]/.test(p),
  symbol: (p) => /[^A-Za-z0-9]/.test(p)
};
const LABELS = ["Password strength", "Very weak", "Weak", "Fair", "Good", "Strong"];

// Eye buttons: <button class="pw-toggle" data-target="password">
export function wirePasswordToggles() {
  document.querySelectorAll(".pw-toggle").forEach((btn) => btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.querySelector("use").setAttribute("href", show ? "#i-eye-off" : "#i-eye");
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }));
}

// Updates the ticks, the strength bar and the "passwords match" line.
// Returns { allRules, matches }.
export function checkPassword({ password, confirm, strengthEl, labelEl, rulesEl, matchEl }) {
  let passed = 0;
  rulesEl.querySelectorAll("li").forEach((li) => {
    const ok = RULES[li.dataset.rule](password);
    li.classList.toggle("ok", ok);
    if (ok) passed++;
  });
  strengthEl.className = "strength" + (password ? " s" + passed : "");
  labelEl.textContent = password ? LABELS[passed] : LABELS[0];
  const matches = confirm.length > 0 && confirm === password;
  if (!confirm) { matchEl.textContent = ""; matchEl.className = "match"; }
  else if (matches) { matchEl.textContent = "Passwords match"; matchEl.className = "match ok"; }
  else { matchEl.textContent = "Passwords do not match yet"; matchEl.className = "match bad"; }
  return { allRules: passed === 5, matches };
}

// A pop-up with two buttons. Returns true if the person taps "yes".
export function openConfirm({ small = "Final check", title, text, yesText, noText }) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    const box = document.createElement("div"); box.className = "confirm-box";
    const s = document.createElement("p"); s.className = "small"; s.textContent = small;
    const h = document.createElement("h2"); h.textContent = title;
    const p = document.createElement("p"); p.textContent = text;
    const actions = document.createElement("div"); actions.className = "confirm-actions";
    const yes = document.createElement("button"); yes.type = "button"; yes.className = "btn btn-primary btn-block"; yes.textContent = yesText;
    const no = document.createElement("button"); no.type = "button"; no.className = "btn btn-ghost btn-block"; no.textContent = noText;
    const done = (value) => { overlay.remove(); resolve(value); };
    yes.addEventListener("click", () => done(true));
    no.addEventListener("click", () => done(false));
    actions.append(yes); if (noText) actions.append(no); box.append(s, h, p, actions); overlay.append(box);
    document.body.append(overlay); yes.focus();
  });
}

// "Ada Okafor" becomes "Ada O." (shown in class chat to protect privacy)
export function displayNameFrom(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0].slice(0, 40);
  return (parts[0] + " " + parts[parts.length - 1].charAt(0).toUpperCase() + ".").slice(0, 40);
}

export function userTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) { return "UTC"; }
}

// Approximate age from the birth year only (we do not collect the full date of birth)
export function ageFrom(birthYear) { return new Date().getFullYear() - birthYear; }
      
