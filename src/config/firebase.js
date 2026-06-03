// Firebase configuration
// Replace these values with your actual Firebase project config
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAG9J9bpr2J2xVkigVZdqNpTFTI0U906Rc",
  authDomain: "thisdat-6cca5.firebaseapp.com",
  projectId: "thisdat-6cca5",
  storageBucket: "thisdat-6cca5.firebasestorage.app",
  messagingSenderId: "332042706962",
  appId: "1:332042706962:web:446410835f8566c64af8cb",
  measurementId: "G-34P39TGMVN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result;
};

export const signInWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  return await signOut(auth);
};

export default app;
