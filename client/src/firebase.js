// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cloth-renting.firebaseapp.com",
  projectId: "cloth-renting",
  storageBucket: "cloth-renting.firebasestorage.app",
  messagingSenderId: "52778840764",
  appId: "1:52778840764:web:b9d806193846e4542056b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);