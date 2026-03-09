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
  } catch (error) {
    // The permission error is now handled gracefully by returning a failure state
    // to the UI, which will display a toast notification without crashing.
    console.error("Firestore 'addListing' operation failed:", error);
    return { success: false, error: (error as Error).message };
  }
}
