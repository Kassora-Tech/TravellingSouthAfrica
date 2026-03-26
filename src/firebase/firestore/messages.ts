'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function addContactMessage(firestore: Firestore, data: ContactMessageData) {
  const messagesCollection = collection(firestore, 'contactMessages');
  
  const dataWithTimestamp = {
    ...data,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(messagesCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (serverError: any) {
    console.error("Firestore addContactMessage error:", serverError);
    return { success: false, error: "Submission failed - please try again." };
  }
}
