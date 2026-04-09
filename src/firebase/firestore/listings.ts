'use client';
import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ListingData {
  ownerUid: string;
  [key: string]: any;
}

export async function addListing(
  firestore: Firestore,
  collectionName: string,
  data: ListingData,
  imageFiles?: File[],
  storage?: FirebaseStorage
) {
  try {
    // Step 1: Upload images to Firebase Storage
    let imageUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0 && storage) {
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

    // Step 2: Save listing data + image URLs to submission collection
    const submissionCollection = collection(firestore, `${collectionName}_submissions`);
    const dataWithTimestamp = {
      ...data,
      imageUrls,
      createdAt: serverTimestamp(),
      status: 'pending',
    };

    const docRef = await addDoc(submissionCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };

  } catch (serverError: any) {
    console.error("Firestore addListing error:", serverError);
    return { success: false, error: "Submission failed - please try again." };
  }
}
