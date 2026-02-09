'use client';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export interface TripTown {
  slug: string;
  notes?: string;
}

export interface TripRoute {
  routeSlug: string;
  includedRoads: string[];
}

export interface TripData {
  name: string;
  userId: string;
  towns?: TripTown[];
  sightIds?: string[];
  routeIds?: string[];
  tripRoutes?: TripRoute[];
  accommodationIds?: string[];
  createdAt?: any;
}

export function createTrip(firestore: Firestore, tripData: Omit<TripData, 'createdAt'>) {
  const tripsCollection = collection(firestore, `users/${tripData.userId}/trips`);
  const dataWithTimestamp = {
    towns: [],
    sightIds: [],
    routeIds: [],
    tripRoutes: [],
    accommodationIds: [],
    ...tripData,
    createdAt: serverTimestamp(),
  };

  addDoc(tripsCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: tripsCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateTripTowns(
  firestore: Firestore,
  userId: string,
  tripId: string,
  towns: TripTown[]
) {
  const tripDocRef = doc(firestore, `users/${userId}/trips`, tripId);
  const payload = { towns };

  updateDoc(tripDocRef, payload).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: tripDocRef.path,
      operation: 'update',
      requestResourceData: payload,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}


export function updateTripItems(
  firestore: Firestore,
  userId: string,
  tripId: string,
  itemType: 'sightIds' | 'routeIds' | 'accommodationIds',
  itemIds: string[]
) {
  const tripDocRef = doc(firestore, `users/${userId}/trips`, tripId);
  const payload = { [itemType]: itemIds };

  updateDoc(tripDocRef, payload).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: tripDocRef.path,
      operation: 'update',
      requestResourceData: payload,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateTripRoutes(
  firestore: Firestore,
  userId: string,
  tripId: string,
  tripRoutes: TripRoute[]
) {
  const tripDocRef = doc(firestore, `users/${userId}/trips`, tripId);
  const routeIds = tripRoutes.map(tr => tr.routeSlug);
  const payload = { tripRoutes, routeIds };

  updateDoc(tripDocRef, payload).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: tripDocRef.path,
      operation: 'update',
      requestResourceData: payload,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
