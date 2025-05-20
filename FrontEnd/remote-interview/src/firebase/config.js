import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASP3ELT1ZE1SAqDNh94iRVXW5Y3FKGUX0",
  authDomain: "interviewly-b6221.firebaseapp.com",
  projectId: "interviewly-b6221",
  storageBucket: "interviewly-b6221.firebasestorage.app",
  messagingSenderId: "459332674631",
  appId: "1:459332674631:web:129c7e6361240bd2503d62",
  measurementId: "G-CHH9GDKFSL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 