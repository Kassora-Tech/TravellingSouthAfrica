'use client';
import { getFunctions, httpsCallable, Functions } from 'firebase/functions';

export async function approveListing(functions: Functions, collectionName: string, submissionId: string) {
  const approveFunction = httpsCallable(functions, 'approveListing');
  return await approveFunction({ collectionName, submissionId });
}

export async function unapproveListing(functions: Functions, collectionName: string, docId: string) {
    const unapproveFunction = httpsCallable(functions, 'unapproveListing');
    return await unapproveFunction({ collectionName, docId });
}

export async function deleteListingSubmission(functions: Functions, collectionName: string, docId: string) {
    const deleteFunction = httpsCallable(functions, 'deleteListingSubmission');
    return await deleteFunction({ collectionName, docId });
}
