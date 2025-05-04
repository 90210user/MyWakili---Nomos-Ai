import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const emailSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const emailSignUp = async (email: string, password: string, username: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      name: name || username,
      language: "en",
      createdAt: new Date(),
      lastLogin: new Date()
    });

    return user;
  } catch (error: any) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create a new user record if they don't exist
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || user.email?.split('@')[0] || "",
        email: user.email,
        name: user.displayName || "",
        language: "en",
        createdAt: new Date(),
        lastLogin: new Date()
      });
    } else {
      // Update last login time
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: new Date()
      }, { merge: true });
    }
    
    return user;
  } catch (error: any) {
    throw new Error(`Google sign-in failed: ${error.message}`);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
};

// Custom hook to get current user
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
