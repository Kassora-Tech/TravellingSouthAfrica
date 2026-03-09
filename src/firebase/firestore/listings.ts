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
    // Log the full error for debugging but don't throw a custom error.
    console.error("Firestore 'addListing' operation failed:", error);
    // Return a generic failure response for the UI to handle gracefully.
    return { success: false, error: (error as Error).message };
  }
}
