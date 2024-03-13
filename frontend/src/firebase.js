import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCCgeignFQKMtYyPWr13dd4H1HOEocQQT8",
  authDomain: "video-54c2a.firebaseapp.com",
  projectId: "video-54c2a",
  storageBucket: "video-54c2a.appspot.com",
  messagingSenderId: "668024929055",
  appId: "1:668024929055:web:3f5b64d48732d187968e2a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const provider = new GoogleAuthProvider()
export default app;


