 // export auth instance
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNAQjKkLnbNZbIFb5DBwfqoVBVxE8CyEw",
  authDomain: "nexus-taskbar.firebaseapp.com",
  projectId: "nexus-taskbar",
  storageBucket: "nexus-taskbar.firebasestorage.app",
  messagingSenderId: "965411029001",
  appId: "1:965411029001:web:198c75d043d012a3a4f8d8",
  measurementId: "G-WFQSB19EBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);