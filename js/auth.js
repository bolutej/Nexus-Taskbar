
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
  url: "http://localhost:5500/dashboard.html",
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
    if (!email) {
      email = window.prompt("Please enter your email:");
    }
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");
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
  return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}
//  import { sendEmailLink } from "./js/auth.js";

//       document.getElementById("sendBtn").addEventListener("click", async () => {
//         const email = document.getElementById("email").value;
//         await sendEmailLink(email);
//         alert("Check your email for the sign-in link!");
//       });

//       import { signInWithGoogle } from "./js/auth.js";

//       document
//         .getElementById("googleBtn")
//         .addEventListener("click", async () => {
//           const user = await signInWithGoogle();
//           window.location.href = "dashboard.html";
//         });