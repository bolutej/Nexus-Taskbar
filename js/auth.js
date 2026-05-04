function switchTab(tab) {
  document.querySelectorAll(".form-panel").forEach((p) => {
    p.classList.add("hidden");
    p.classList.remove("block");
  });

  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.add("opacity-50", "border-transparent");
    t.classList.remove("opacity-100", "border-[#0F0C29]");
  });

  document.getElementById(tab).classList.remove("hidden");
  document.getElementById(tab).classList.add("block");

  const activeTab = document.getElementById(`tab-${tab}`);
  activeTab.classList.remove("opacity-50", "border-transparent");
  activeTab.classList.add("opacity-100", "border-[#0F0C29]");
}


// js/auth.js
import { auth } from "../firebase.js";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

const actionCodeSettings = {
  url: "http://localhost:5500/dashboard.html", // ← your redirect page
  handleCodeInApp: true,
};

export async function sendEmailLink(email) {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
}

export async function completeSignIn() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please enter your email:");
    }
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");
    return result.user;
  }
}
// js/auth.js — add this
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}