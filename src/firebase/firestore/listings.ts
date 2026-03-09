'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';

interface ListingData {
  ownerUid: string;
  [key: string]: any;
}

export async function addListing(firestore: Firestore, collectionName: string, data: ListingData) {
  const listingCollection = collection(firestore, collectionName);
  
  const dataWithTimestamp = {
    ...data,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(listingCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (serverError: any) {
    // The client-side exception is removed to let Firestore rules handle permissions.
    // A console log and a gentle error for the UI are returned instead.
    console.error("Firestore 'addListing' operation failed:", serverError);
    return { success: false, error: "Submission failed - please try again" };
  }
}
