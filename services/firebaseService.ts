
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from 'firebase/firestore';
import { UserData } from '../types';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// --- AUTHENTICATION FUNCTIONS ---

const formatAuthError = (message: string): string => {
    if (message.includes('auth/invalid-email')) {
        return 'Please enter a valid email address.';
    }
    if (message.includes('auth/weak-password')) {
        return 'Password should be at least 6 characters long.';
    }
    if (message.includes('auth/email-already-in-use')) {
        return 'An account with this email already exists. Please log in.';
    }
    if (message.includes('auth/invalid-credential')) {
        return 'Invalid email or password. Please try again.';
    }
    console.error("Firebase Auth Error:", message);
    return 'An unexpected error occurred. Please try again later.';
}

export const handleSignup = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user) {
            throw new Error("User could not be created.");
        }
        // Create a new user document in Firestore
        const newUser: UserData = {
            uid: user.uid,
            email: user.email!,
            playbook: null,
            businessData: null
        };
        await saveUserData(newUser);
        return user;
    } catch (error) {
        throw new Error(formatAuthError((error as Error).message));
    }
};

export const handleLogin = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(formatAuthError((error as Error).message));
    }
};

export const handleSignOut = () => {
    return firebaseSignOut(auth);
};

// --- FIRESTORE FUNCTIONS ---

export const saveUserData = async (userData: UserData) => {
    try {
        const userRef = doc(db, 'users', userData.uid);
        await setDoc(userRef, userData, { merge: true });
    } catch (error) {
        console.error("Error saving user data to Firestore:", error);
        throw new Error("Could not save your data. Please check your connection and try again.");
    }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserData;
        } else {
            console.log("No such user document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        throw new Error("Could not load your data. Please check your connection and try again.");
    }
};
