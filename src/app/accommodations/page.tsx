import { AccommodationSearch } from '@/components/home/accommodation-search';
import { Translatable } from '@/components/translatable';
import { ListYourAccommodationForm } from '@/components/accommodations/list-your-accommodation-form';
import { towns } from '@/lib/data/towns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function AccommodationsPage({ searchParams }: { searchParams?: { town?: string } }) {
  const townSlug = searchParams?.town;
  const town = townSlug ? towns.find(t => t.slug === townSlug) : null;

  // Since there is no database of accommodations yet, we simulate the "no listings" case.
  const listingsForTown: any[] = []; // Empty array to simulate no results.

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
        </div>

        {town && listingsForTown.length === 0 ? (
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
        ) : town && listingsForTown.length > 0 ? (
            // This is where listings would render if they existed.
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* {listingsForTown.map(listing => <ListingCard key={listing.id} listing={listing} />)} */}
            </div>
        ) : (
            <div className="mt-8 text-center">
                <p className="text-lg text-muted-foreground">
                    <Translatable text="Use the search bar above to find accommodation in a specific town." />
                </p>
            </div>
        )}
      </div>
      <ListYourAccommodationForm />
    </>
  );
}
