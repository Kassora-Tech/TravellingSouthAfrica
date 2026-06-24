'use client';

import { addDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function addContactMessage(firestore: Firestore, data: ContactMessageData) {
  const messagesCollection = collection(firestore, 'mail');

  const dataWithTimestamp = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    userMessage: data.message,
    createdAt: serverTimestamp(),
    to: ['maryke@travellingsouthafrica.co.za'],
    replyTo: data.email,
    message: {
      subject: `New Contact Message: ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
      html: `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `,
    },
  };

  try {
    const docRef = await addDoc(messagesCollection, dataWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (serverError: any) {
    console.error("Firestore addContactMessage error:", serverError);
    return { success: false, error: "Submission failed - please try again." };
  }
}