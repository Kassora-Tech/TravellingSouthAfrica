'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Firestore } from 'firebase/firestore';

export interface AccommodationListing {
  id: string;
  name: string;
  townSlug: string;
  category?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  bookingSiteUrl?: string;
  imageUrls?: string[];
  physicalAddress?: string;
}

export function useAccommodationsForTowns(
  firestore: Firestore,
  townSlugs: string[]
) {
  const [accommodations, setAccommodations] = useState<AccommodationListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!townSlugs || townSlugs.length === 0) {
      setAccommodations([]);
      return;
    }

    const fetchAccommodations = async () => {
      setIsLoading(true);
      try {
        const accommodationsRef = collection(firestore, 'accommodations');
        const q = query(
          accommodationsRef,
          where('approved', '==', true),
          where('townSlug', 'in', townSlugs.slice(0, 10))
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AccommodationListing[];
        setAccommodations(results);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, [firestore, townSlugs.join(',')]);

  return { accommodations, isLoading };
}