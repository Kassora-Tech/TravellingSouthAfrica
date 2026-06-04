import { AccommodationSearch } from '@/components/home/accommodation-search';
import { Translatable } from '@/components/translatable';
import { ListYourAccommodationForm } from '@/components/accommodations/list-your-accommodation-form';
import { towns } from '@/lib/data/towns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { AccommodationGrid } from '@/components/accommodations/accommodation-grid';
 
// Initialize Firebase for server-side fetching
function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  try {
    return initializeApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}
 
async function getAccommodations(townSlug?: string) {
  try {
    const app = getFirebaseApp();
    const firestore = getFirestore(app);
    const accommodationsRef = collection(firestore, 'accommodations');
 
    let q;
    if (townSlug) {
      q = query(accommodationsRef, where('townSlug', '==', townSlug));
    } else {
      q = query(accommodationsRef);
    }
 
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore timestamps are not serializable. A simple way to serialize the whole object
        // is to stringify and then parse it.
        const plainObject = JSON.parse(JSON.stringify(data));
        return { id: doc.id, ...plainObject };
    }) as any[];
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
}
 
export default async function AccommodationsPage(props: { searchParams?: Promise<{ town?: string }> }) {
  const searchParams = await props.searchParams;
  const townSlug = searchParams?.town;
  const town = townSlug ? towns.find(t => t.slug === townSlug) : null;
  const listings = await getAccommodations(townSlug);
 
  return (
    <>
      <AccommodationSearch />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline text-primary">
            {town ? (
              <Translatable text={`Accommodation in ${town.name}`} />
            ) : (
              <Translatable text="Search for Accommodation" />
            )}
          </h2>
          {!town && (
            <p className="mt-2 text-muted-foreground">
              <Translatable text="Use the search bar above to find accommodation in a specific town." />
            </p>
          )}
        </div>
 
        {listings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              {town ? (
                <>{listings.length} {listings.length === 1 ? 'listing' : 'listings'} in {town.name}</>
              ) : (
                <>
                  <Translatable text="All Approved Accommodations" />
                  <span className="text-sm font-normal text-muted-foreground ml-2">({listings.length} listings)</span>
                </>
              )}
            </h3>
            <AccommodationGrid listings={listings} />
          </div>
        )}
 
        {town && listings.length === 0 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-6 text-lg text-muted-foreground">
                  <Translatable text={`There are currently no listings in ${town.name} yet.`} />
                </p>
                <Button asChild className="mt-6">
                  <Link href="/add-your-listing">
                    <Translatable text="Be the first to list your accommodation here" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <ListYourAccommodationForm />
    </>
  );
}
