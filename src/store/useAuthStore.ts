import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, Unsubscribe } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => Unsubscribe;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: (user, token) => set({ user, token }),
  logout: async () => {
    await signOut(auth);
    set({ user: null, token: null });
  },
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role and name from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        let userData: User;
        if (docSnap.exists()) {
          const data = docSnap.data();
          userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            role: data.role || 'customer',
            name: data.name || 'User',
          };
        } else {
          // Fallback if document doesn't exist
          userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'customer',
            name: firebaseUser.displayName || 'User',
          };
        }
        
        const token = await firebaseUser.getIdToken();
        set({ user: userData, token, isLoading: false });
      } else {
        set({ user: null, token: null, isLoading: false });
      }
    });

    return unsubscribe;
  }
}));
