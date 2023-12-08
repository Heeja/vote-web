import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiy-QBD4wIROTr6B9ftphVmcuMtKeRdnQ",
  authDomain: "edanpersonal.firebaseapp.com",
  projectId: "edanpersonal",
  storageBucket: "edanpersonal.appspot.com",
  messagingSenderId: "341440816168",
  appId: "1:341440816168:web:8f26d73687a5bf01bb011d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
