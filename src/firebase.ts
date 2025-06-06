import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDStcJhjVJsIQU70nK1dZDI5JgYMZnWa94",
    authDomain: "afterheart-76139.firebaseapp.com",
    projectId: "afterheart-76139",
    storageBucket: "afterheart-76139.firebasestorage.app",
    messagingSenderId: "915575080055",
    appId: "1:915575080055:web:f330e842ed3143580e7272",
    measurementId: "G-5PCFZ61H4N"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Helper function to create user with profile
export const createUserWithProfile = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: name
  });
  return userCredential.user;
};
