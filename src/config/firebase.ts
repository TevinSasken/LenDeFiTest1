// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSfkyW_KBho2YppXVA6ew86UBzwVwSf9o",
  authDomain: "lendefi-916f9.firebaseapp.com",
  projectId: "lendefi-916f9",
  storageBucket: "lendefi-916f9.firebasestorage.app",
  messagingSenderId: "288349291690",
  appId: "1:288349291690:web:d7b0256a833b88451dbcd3",
  measurementId: "G-5P694P7HHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;