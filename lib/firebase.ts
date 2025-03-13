import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Load environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

declare global {
    var firebaseApp: FirebaseApp | undefined;
}

let app: FirebaseApp;
if (!globalThis.firebaseApp) {
    app = initializeApp(firebaseConfig);
    globalThis.firebaseApp = app;
} else {
    app = globalThis.firebaseApp;
}


// Firebase services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber };
