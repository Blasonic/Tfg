import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAYnoNychKJB63JEK-uTqWM_iyeKbV2mY",
  authDomain: "usuariosplanzo.firebaseapp.com",
  projectId: "usuariosplanzo",
  storageBucket: "usuariosplanzo.firebasestorage.app",
  messagingSenderId: "549429780112",
  appId: "1:549429780112:web:457cf88760cbbbee218215"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
