'use client';

import { doc, updateDoc, deleteDoc, Firestore } from 'firebase/firestore';
import { FirestorePermissionError, errorEmitter } from '@/firebase';

export function updateListingStatus(firestore: Firestore, collectionName: string, docId: string, status: boolean) {
  const docRef = doc(firestore, collectionName, docId);
  const payload = { approved: status };
  updateDoc(docRef, payload)
    .catch(error => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: payload,
      }));
    });
}

export function deleteListing(firestore: Firestore, collectionName: string, docId: string) {
  const docRef = doc(firestore, collectionName, docId);
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
}
