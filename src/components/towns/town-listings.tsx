'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Building2, Wrench } from 'lucide-react';
import { AccommodationGrid } from '@/components/accommodations/accommodation-grid';
import { ServiceProviderCard } from '@/components/service-providers/service-provider-listings';
import { Translatable } from '@/components/translatable';
import { ListingPromoCard } from '@/components/towns/listing-promo-card';

export function TownListings({ townSlug, townName }: { townSlug: string; townName: string }) {
  const firestore = useFirestore();
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [serviceProviders, setServiceProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;
    let cancelled = false;

    async function load() {
      try {
        const [accSnap, spSnap] = await Promise.all([
          getDocs(query(collection(firestore, 'accommodations'), where('townSlug', '==', townSlug))),
          getDocs(query(collection(firestore, 'service_providers'), where('townSlug', '==', townSlug))),
        ]);
        if (cancelled) return;
        setAccommodations(accSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setServiceProviders(spSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching town listings:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [firestore, townSlug]);

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="font-headline text-2xl font-bold mb-4">
        <Translatable text="Accommodation & Service Listings" />
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="accommodation">
          <TabsList>
            <TabsTrigger value="accommodation">
              <Translatable text="Accommodation" /> ({accommodations.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              <Translatable text="Service Providers" /> ({serviceProviders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accommodation" className="mt-6">
            {accommodations.length > 0 ? (
              <>
                <AccommodationGrid listings={accommodations} />
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={`/accommodations?town=${encodeURIComponent(townSlug)}`}>
                      <Translatable text={`View all accommodation in ${townName}`} />
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ListingPromoCard icon={Building2} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            {serviceProviders.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {serviceProviders.map((listing) => (
                  <ServiceProviderCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <ListingPromoCard icon={Wrench} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
