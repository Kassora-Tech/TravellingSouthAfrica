import { initializeApp, getApps, getApp } from 'firebase/app';
import { collection, getDocs, getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface TownDocData {
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  photo5?: string;
  photo6?: string;
}

/** First non-empty photo submitted with a town's description, used as its main image. */
export function pickSubmittedTownPhoto(townData: TownDocData | null | undefined): string | undefined {
  if (!townData) return undefined;
  return [townData.photo1, townData.photo2, townData.photo3, townData.photo4, townData.photo5, townData.photo6].find(
    Boolean
  );
}

/**
 * Resolves the image to show for a town: the photo submitted with its description
 * takes priority, falling back to the static placeholder image when none exists.
 */
export function resolveTownImage(
  town: { imageId?: string },
  submittedPhoto?: string
): { url: string | undefined; hint: string | undefined; isSubmitted: boolean } {
  if (submittedPhoto) {
    return { url: submittedPhoto, hint: undefined, isSubmitted: true };
  }
  const placeholder = PlaceHolderImages.find((p) => p.id === town.imageId);
  return { url: placeholder?.imageUrl, hint: placeholder?.imageHint, isSubmitted: false };
}

/** Fetches every town doc once and maps slug -> submitted photo, for rendering many town cards at once. */
export async function fetchTownPhotoMap(firestore: Firestore): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const snapshot = await getDocs(collection(firestore, 'towns'));
    snapshot.forEach((doc) => {
      const photo = pickSubmittedTownPhoto(doc.data() as TownDocData);
      if (photo) map.set(doc.id, photo);
    });
  } catch (error) {
    console.error('Error fetching town photos:', error);
  }
  return map;
}

function getServerFirebaseApp() {
  if (getApps().length > 0) return getApp();
  try {
    return initializeApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}

/** Firestore instance for use in server components (mirrors the client SDK init used for public reads elsewhere). */
export function getServerFirestore(): Firestore {
  return getFirestore(getServerFirebaseApp());
}
