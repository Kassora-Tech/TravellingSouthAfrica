'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '..';

interface ListingData {
  ownerUid: string;
  [key: string]: any;
}

export async function addListing(collectionName: string, data: ListingData) {
  const { firestore } = initializeFirebase();
  const listingCollection = collection(firestore, collectionName);
  
  const dataWithTimestamp = {
    ...data,
    approved: false,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(listingCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: (error as Error).message };
  }
}
