
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDban0wodngF4qphBgcySvjJlUI_0LcSDc",
  authDomain: "fitness-app-f2a07.firebaseapp.com",
  projectId: "fitness-app-f2a07",
  storageBucket: "fitness-app-f2a07.firebasestorage.app",
  messagingSenderId: "740705828464",
  appId: "1:740705828464:web:92ad24a7fa0d4c7c143eb5",
  measurementId: "G-N7L61LQ1BN"
};


// Firebase initialisieren
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
