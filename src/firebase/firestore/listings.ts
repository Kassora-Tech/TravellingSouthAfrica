'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

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
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: listingCollection.path,
        operation: 'create',
        requestResourceData: dataWithTimestamp,
      })
    );
    return { success: false, error: (error as Error).message };
  }
}
