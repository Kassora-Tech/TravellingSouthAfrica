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
    // Log the detailed error for debugging purposes on the server/client console
    console.error("Firestore addListing error:", serverError);
    // Return a generic error to the UI to prevent crashing and show a friendly message
    return { success: false, error: "Submission failed - please try again." };
  }
}
