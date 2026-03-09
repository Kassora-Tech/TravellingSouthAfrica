'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

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
      // Also, return a failure object for the UI to handle gracefully
      console.error("Firestore 'addListing' operation failed:", serverError);
      return { success: false, error: "Submission failed - please try again" };
  }
}
