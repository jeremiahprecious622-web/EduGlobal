// ==========================================================
// EduGlobal - auth.js
// All login, registration and page-protection logic.
// ==========================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile, deleteUser, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Turns technical errors into messages a student can understand
export function friendlyError(error) {
  const code = error.code || error.message || "";
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Please choose a stronger password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "No internet connection. Please check your network.",
    "permission-denied": "Something went wrong saving your profile. Please try again.",
    "NO_PROFILE": "We could not find your student profile. Please register first.",
    "SUSPENDED": "This account has been suspended. Please contact EduGlobal support.",
    "NOT_STUDENT": "This is not a student account. Please use the teacher login page."
  };
  return messages[code] || "Something went wrong. Please try again.";
}

// Create a new student account and save the profile
export async function registerStudent(data) {
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  try {
    await updateProfile(cred.user, { displayName: data.fullName });
    await setDoc(doc(db, "users", cred.user.uid), {
      fullName: data.fullName,
      email: cred.user.email,
      country: data.country,
      curriculum: data.curriculum,
      level: data.level,
      subjects: data.subjects,
      role: "student",       // students can only ever create "student" accounts (enforced by rules)
      status: "active",
      consentAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    await deleteUser(cred.user); // do not leave a half-created account
    throw error;
  }
  return cred.user;
}

// Log in and make sure this is an active student
export async function loginStudent(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) { await signOut(auth); throw new Error("NO_PROFILE"); }
  const profile = snap.data();
  if (profile.status !== "active") { await signOut(auth); throw new Error("SUSPENDED"); }
  if (profile.role !== "student") { await signOut(auth); throw new Error("NOT_STUDENT"); }
  return profile;
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function logout() {
  return signOut(auth);
}

// Protects a student page. Sends visitors who are not logged in to the login page.
// Usage: requireStudent((user, profile) => { ...show the page... });
export function requireStudent(onReady) {
  onAuthStateChanged(auth, async (user) => {
    const loginPage = "../auth/student-login.html";
    if (!user) { window.location.replace(loginPage); return; }
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const profile = snap.exists() ? snap.data() : null;
      if (!profile || profile.role !== "student" || profile.status !== "active") {
        await signOut(auth);
        window.location.replace(loginPage);
        return;
      }
      onReady(user, profile);
    } catch (error) {
      window.location.replace(loginPage);
    }
  });
    }
    
