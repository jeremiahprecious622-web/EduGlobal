// ==========================================================
// EduGlobal - firebase-config.js
// Connects the website to your Firebase project.
// (These values are not secrets. Your Firestore rules protect the data.)
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCc8y3T6hfP5TOYiSOFJAjs-5Jornlhx0k",
  authDomain: "eduglobal-15a91.firebaseapp.com",
  projectId: "eduglobal-15a91",
  storageBucket: "eduglobal-15a91.firebasestorage.app",
  messagingSenderId: "635218216094",
  appId: "1:635218216094:web:cf6fb8afd5862c51ff278f"
};

// Lets pages show a clear message if the values are missing
export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ----- Stay logged in -----
// People stay logged in on this device until they tap Log out,
// or until they have not visited EduGlobal for one year.
setPersistence(auth, browserLocalPersistence).catch(() => {});
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
try {
  const last = Number(localStorage.getItem("eg_last_active") || 0);
  if (last && Date.now() - last > ONE_YEAR) {
    signOut(auth);
    localStorage.removeItem("eg_role");
  }
  localStorage.setItem("eg_last_active", String(Date.now()));
} catch (e) { /* private browsing: nothing to remember */ }
    
