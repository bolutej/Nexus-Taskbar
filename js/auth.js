// ✅ One combined import from a single, real version URL
import { auth } from "../firebase.js";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const actionCodeSettings = {
  url: "http://localhost:5502/projects.html",
  handleCodeInApp: true,
};

export async function sendEmailLink(email) {
  try {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
  } catch (error) {
    console.error("Error sending link:", error.message);
    throw error;
  }
}

export async function completeSignIn() {
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      // ✅ If no email in storage, redirect back to auth with a message
      if (!email) {
        window.location.href = "auth.html?reenter=true";
        return;
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      window.history.replaceState(null, "", window.location.pathname);
      return result.user;
    }
  } catch (error) {
    console.error("Sign-in error:", error.message);
    throw error;
  }
}

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try{
  const result = await signInWithPopup(auth, provider);
  window.location.href = "projects.html";
  return result.user;
  } catch (error) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        console.error("Popup closed before completing sign-in");
        break;
      case "auth/popup-blocked":
        console.error("Popup was blocked by the browser");
        break;
      case "auth/cancelled-popup-request":
        console.error("Another popup is already open");
        break;
      case "auth/network-request-failed":
        console.error("Network error, check your connection");
        break;
      default:
        console.error("Google sign-in error:", error.message);
    }
    throw error;
  }
}
 