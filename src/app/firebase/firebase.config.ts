import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbeNHVL8eGpXlStuFq4ez7sMbIP8NiEIs",
  authDomain: "picnic-project-a917b.firebaseapp.com",
  projectId: "picnic-project-a917b",
  storageBucket: "picnic-project-a917b.firebasestorage.app",
  messagingSenderId: "800768368941",
  appId: "1:800768368941:web:ed951c3a09cb990a55b3a4",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
