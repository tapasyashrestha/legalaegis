import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "aegis-e8873",
  appId: "1:807086731982:web:682e940e9b2f6d4cff169f",
  apiKey: "AIzaSyChlMswfFV9NTMU9ovLCgBfCBSSMph4EEo",
  authDomain: "aegis-e8873.firebaseapp.com",
  storageBucket: "aegis-e8873.firebasestorage.app",
  messagingSenderId: "807086731982",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
