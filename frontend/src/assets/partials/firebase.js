import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // 👈 yeh line add karo

const firebaseConfig = {
  apiKey: "AIzaSyCsXKV12H4ssEa9MlvrHpRKsPaM4b8WzSo",
  authDomain: "attendance-management-ap-7f81c.firebaseapp.com",
  projectId: "attendance-management-ap-7f81c",
  storageBucket: "attendance-management-ap-7f81c.firebasestorage.app",
  messagingSenderId: "998787644397",
  appId: "1:998787644397:web:430099b825ee05797c85e4",
  measurementId: "G-62EP242SFD",
  databaseURL: "https://attendance-management-ap-7f81c-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 