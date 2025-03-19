// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0Vg6Wfmy9jgbVpeqtoKbT4xOf8Agz3vI",
  authDomain: "safitripplanner.firebaseapp.com",
  projectId: "safitripplanner",
  storageBucket: "safitripplanner.firebasestorage.app",
  messagingSenderId: "777773498888",
  appId: "1:777773498888:web:f076aa4fc995ecc43e07bd",
  measurementId: "G-QKBDFNHDG0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
//const analytics = getAnalytics(app);