import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7zFjSnU0W7NBHUup-MxppW1phQthvjuM",
  authDomain: "company-3cdfd.firebaseapp.com",
  projectId: "company-3cdfd",
  storageBucket: "company-3cdfd.firebasestorage.app",
  messagingSenderId: "95330663345",
  appId: "1:95330663345:web:83ebeb3c80945e1bfedb90",
  measurementId: "G-WJFLC6D62Y"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
