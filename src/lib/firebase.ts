import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "crucial-order-2zrkg",
  appId: "1:352980471650:web:1cdff757a49e64d8d5663b",
  apiKey: "AIzaSyCvk8R7Ir6Gwny9XODdE8UV_pA_Jx_bRtI",
  authDomain: "crucial-order-2zrkg.firebaseapp.com",
  storageBucket: "crucial-order-2zrkg.firebasestorage.app",
  messagingSenderId: "352980471650",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-d7b87b9b-f8ed-4e70-bc07-65d88129d5e7");
