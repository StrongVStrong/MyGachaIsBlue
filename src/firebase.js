import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration (ensure your .env has REACT_APP_ prefix)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 🔹 Google Sign-In Function
const signIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 🔥 Check if user already exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // 📝 If new user, create their Firestore profile
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                gems: 5000, // Default starting gems
                inventory: [],
                createdAt: new Date()
            });
        }

    } catch (error) {
        console.error("Google Sign-In Failed:", error);
    }
};

// 🔹 Logout Function
const logout = async () => {
    await signOut(auth);
};

// 🔹 Listen for Auth State Changes (Useful for checking user login status)
const checkAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};

export { auth, db, signIn, logout, checkAuthState, provider };
