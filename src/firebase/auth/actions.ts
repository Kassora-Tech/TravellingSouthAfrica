"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeFirebase } from "..";

const { auth, firestore } = initializeFirebase();

export async function signup(name: string, email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      name: name,
      email: user.email,
      role: "free",
      profileImageUrl: null,
    });

    return { user };
  } catch (error) {
    return { error };
  }
}

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // New user, create profile in Firestore
      await setDoc(userDocRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'free',
        profileImageUrl: user.photoURL
      });
    }
    
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function logout() {
  return await signOut(auth);
}

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { error };
  }
}
