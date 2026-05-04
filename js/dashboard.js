  import { completeSignIn } from "./js/auth.js";

  const user = await completeSignIn();
  if (user) {
    document.getElementById("status").textContent = `Welcome, ${user.email}!`;
  }
// js/dashboard.js
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Signed in as:", user.email);
    // show dashboard content
  } else {
    // not signed in, redirect back to login
    window.location.href = "auth.html";
  }
});

// js/dashboard.js — add this
import { signOut } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

export async function logOut() {
  await signOut(auth);
  window.location.href = "auth.html";
}