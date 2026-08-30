import { initializeFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const { firestore } = initializeFirebase();
const eventsCollection = collection(firestore, 'events');

export interface EventDoc {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  townSlug?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EventInput {
  title: string;
  description: string;
  eventDate: Date;
  townSlug?: string;
  imageUrl?: string;
}

/**
 * Creates a new event.
 */
export async function createEvent(eventData: EventInput) {
  const docData = {
    ...eventData,
    eventDate: Timestamp.fromDate(eventData.eventDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(eventsCollection, docData);
  return docRef.id;
}

/**
 * Fetches all events ordered by event date (ascending), for the admin dashboard.
 */
export async function getAllEvents(): Promise<EventDoc[]> {
  const q = query(eventsCollection, orderBy('eventDate', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as EventDoc[];
}

/**
 * Fetches events whose eventDate is today or later, ordered ascending, for the public page.
 */
export async function getUpcomingEvents(): Promise<EventDoc[]> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const q = query(
    eventsCollection,
    where('eventDate', '>=', Timestamp.fromDate(startOfToday)),
    orderBy('eventDate', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as EventDoc[];
}

/**
 * Updates an event by ID.
 */
export async function updateEvent(id: string, updatedData: Partial<EventInput>) {
  const docRef = doc(firestore, 'events', id);
  const { eventDate, ...rest } = updatedData;
  await updateDoc(docRef, {
    ...rest,
    ...(eventDate ? { eventDate: Timestamp.fromDate(eventDate) } : {}),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes an event by ID.
 */
export async function deleteEvent(id: string) {
  const docRef = doc(firestore, 'events', id);
  await deleteDoc(docRef);
}
