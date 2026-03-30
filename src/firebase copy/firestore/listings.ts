'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';

interface ListingData {
  ownerUid: string;
  [key: string]: any;
}

export async function addListing(
  firestore: Firestore,
  collectionName: string,
  data: ListingData,
  imageFiles?: File[]
) {
  try {
    // Step 1: Upload images to Firebase Storage
    let imageUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      const storage = getStorage(getApp());

      const uploadPromises = imageFiles.map(async (file) => {
        const storageRef = ref(
          storage,
          `listings/${data.ownerUid}/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    // Step 2: Save listing data + image URLs to Firestore
    const listingCollection = collection(firestore, collectionName);
    const dataWithTimestamp = {
      ...data,
      imageUrls,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(listingCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };

  } catch (serverError: any) {
    console.error("Firestore addListing error:", serverError);
    return { success: false, error: "Submission failed - please try again." };
  }
}
