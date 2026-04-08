import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Phone, Mail, Globe, MapPin, ExternalLink, Building2 } from 'lucide-react';
import Image from 'next/image';

function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  try {
    return initializeApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}

async function getApprovedServiceProviders(category?: string) {
  try {
    const app = getFirebaseApp();
    const firestore = getFirestore(app);
    const ref = collection(firestore, 'service_providers');
    const q = category
      ? query(ref, where('approved', '==', true), where('category', '==', category))
      : query(ref, where('approved', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return [];
  }
}

function ServiceProviderCard({ listing }: { listing: any }) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {listing.imageUrls && listing.imageUrls.length > 0 ? (
        <div className="relative w-full h-48">
          <Image
            src={listing.imageUrls[0]}
            alt={listing.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <Building2 className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-4 flex flex-col flex-1 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-primary">{listing.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">
              {listing.category}
            </span>
            {listing.townSlug && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {listing.townSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            )}
          </div>
        </div>

        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{listing.description}</p>
        )}

        {listing.physicalAddress && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
            <span>{listing.physicalAddress}</span>
          </div>
        )}

        <div className="space-y-1 pt-2 border-t">
          {listing.contactPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3 text-primary shrink-0" />
              <a href={`tel:${listing.contactPhone}`} className="hover:underline">
                {listing.contactPhone}
              </a>
            </div>
          )}
          {listing.contactEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-primary shrink-0" />
              <a href={`mailto:${listing.contactEmail}`} className="hover:underline truncate">
                {listing.contactEmail}
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {listing.websiteUrl && (
            <a href={listing.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline border rounded-full px-3 py-1">
              <Globe className="h-3 w-3" />
              Website
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export async function ServiceProviderListings({
  category,
  title,
  description,
  addListingHref = '/add-your-listing',
}: {
  category?: string;
  title: string;
  description: string;
  addListingHref?: string;
}) {
  const listings = await getApprovedServiceProviders(category);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      {listings.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map(listing => (
              <ServiceProviderCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-6">
            No approved {title.toLowerCase()} listed yet.
          </p>
          <Button asChild>
            <Link href={addListingHref}>
              Be the first to list your service here
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}