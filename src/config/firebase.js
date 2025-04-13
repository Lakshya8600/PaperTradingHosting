import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBz48X3u6pKPf1zaVNxg5-dATZ5z0Gngjc",
  authDomain: "papertrading-3cctf.firebaseapp.com",
  projectId: "papertrading-3cctf",
  storageBucket: "papertrading-3cctf.firebasestorage.app",
  messagingSenderId: "929849557582",
  appId: "1:929849557582:web:2829a70a5610b28271391f",
  measurementId: "G-LNEK118DCN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();