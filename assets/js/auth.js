// ==========================================================
// EduGlobal - auth.js
// Registration, login, email verification and page protection.
// ==========================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
  sendEmailVerification, reload, updateProfile, deleteUser, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Where the student lands after clicking the link in the verification email
function dashboardUrl() { return window.location.origin + "/student/dashboard.html"; }

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
    "auth/unauthorized-continue-uri": "This website address is not approved in Firebase yet. Add it under Authentication, Settings, Authorized domains.",
    "permission-denied": "Something went wrong saving your profile. Please try again.",
    "NO_PROFILE": "We could not find your student profile. Please register first.",
    "SUSPENDED": "This account has been suspended. Please contact EduGlobal support.",
    "NOT_STUDENT": "This is not a student account. Please use the teacher login page."
  };
  return messages[code] || "Something went wrong. Please try again.";
}

// Create a new student account, save the profile, and send the verification email
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
  try {
    await sendEmailVerification(cred.user, { url: dashboardUrl() });
  } catch (error) {
    // The account exists. The student can tap "Resend email" on the next page.
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
  return { profile, emailVerified: cred.user.emailVerified };
}

export function resetPassword(email) { return sendPasswordResetEmail(auth, email); }
export function logout() { return signOut(auth); }

// ----- Email verification helpers (used by verify-email.html) -----
export function requireSignedIn(onReady) {
  onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.replace("student-login.html"); return; }
    onReady(user);
  });
}
export function resendVerification() { return sendEmailVerification(auth.currentUser, { url: dashboardUrl() }); }
export async function refreshVerified() {
  await reload(auth.currentUser);
  return auth.currentUser.emailVerified;
}

// Protects a student page. Visitors who are not logged in, not verified,
// or not active students are sent away.
// Usage: requireStudent((user, profile) => { ...show the page... });
export function requireStudent(onReady) {
  onAuthStateChanged(auth, async (user) => {
    const loginPage = "../auth/student-login.html";
    if (!user) { window.location.replace(loginPage); return; }
    try {
      if (!user.emailVerified) await reload(user); // pick up a verification done in another tab
      if (!user.emailVerified) { window.location.replace("../auth/verify-email.html"); return; }
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
  
