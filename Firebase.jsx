import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import "firebase/compat/database";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

 const firebaseApp = firebase.initializeApp(firebaseConfig);
export const fireDb = firebaseApp.database().ref();
export const auth = getAuth(firebaseApp)
export default firebaseApp;