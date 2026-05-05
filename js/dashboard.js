import { auth } from "../firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { completeSignIn } from "./auth.js";

// Complete email link sign-in if redirected from email
completeSignIn().then((user) => {
  if (user) {
    console.log("Email link sign-in complete:", user.email);
  }
});

// Protect dashboard — redirect if not signed in
export function watchAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Signed in as:", user.email);

      const emailEl = document.getElementById("user-email");
      const nameEl = document.getElementById("user-name");

      if (emailEl) emailEl.textContent = user.email;
      if (nameEl) nameEl.textContent = user.displayName ?? "No name set";
    } else {
      window.location.href = "auth.html";
    }
  });
}

// Log out
export async function logOut() {
  try {
    await signOut(auth);
    window.location.href = "auth.html";
  } catch (error) {
    console.error("Sign-out error:", error.message);
    throw error;
  }
}