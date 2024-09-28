import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APIKEY,
	authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTHDOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECTID,
	storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_FIREBASE_CONFIG_APPID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getFirestore(app);
