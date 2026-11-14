// Shared Firebase setup for client-login.html and client-dashboard.html.
// Paste your web app config here once: Firebase console > Project settings > Your apps.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoV0SB2koA1QlSUsF9YPG-FxnSpqPxnN4",
  authDomain: "client-portal-8e1ae.firebaseapp.com",
  projectId: "client-portal-8e1ae",
  storageBucket: "client-portal-8e1ae.firebasestorage.app",
  messagingSenderId: "1027058861531",
  appId: "1:1027058861531:web:b5844bbb3349f8489553fe"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
