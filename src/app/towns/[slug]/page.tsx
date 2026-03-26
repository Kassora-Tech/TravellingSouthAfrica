'use client';

import { towns as staticTowns } from '@/lib/data/towns';
import { provinces } from '@/lib/data/provinces';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { MapPin, Users, Edit } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { useDoc, useFirestore, useUser, useMemoFirebase, isAdmin } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export default function TownDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const isAdminUser = isAdmin(user);

  // Get static data for fallback
  const staticTown = staticTowns.find((p) => p.slug === slug);

  const townDocRef = useMemoFirebase(() => doc(firestore, 'towns', slug), [firestore, slug]);
  const { data: townData, isLoading } = useDoc(townDocRef);

  useEffect(() => {
    if (staticTown) {
      document.title = `${staticTown.name} Travel Guide | Travelling South Africa`;
    }
  }, [staticTown]);

  if (!staticTown) {
    notFound();
  }
  
  const province = provinces.find(p => p.slug === staticTown.provinceSlug);
  const heroImage = PlaceHolderImages.find((p) => p.id === staticTown.imageId);

  // Helper to render highlights
  const renderHighlights = (highlights: string | undefined) => {
    if (!highlights) return null;
    return (
        <ul className="list-disc list-inside space-y-2">
            {highlights.split('\n').map((line, index) => {
                if (line.startsWith('-')) {
                    return <li key={index}>{line.substring(1).trim()}</li>
                }
                return null;
            }).filter(Boolean)}
        </ul>
    )
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Towns',
        item: `${siteUrl}/towns`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: staticTown.name,
        item: `${siteUrl}/towns/${staticTown.slug}`,
      },
    ],
  };

  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: staticTown.name,
    description: townData?.longDescription || staticTown.description,
    image: heroImage?.imageUrl,
    address: {
        '@type': 'PostalAddress',
        addressLocality: staticTown.name,
        addressRegion: province?.name,
        addressCountry: 'ZA',
    },
    url: `${siteUrl}/towns/${staticTown.slug}`,
  };

  return (
    <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }} />
      <section className="relative h-[50vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`A scenic view of ${staticTown.name}, ${province?.name || 'South Africa'}`}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold font-headline">
            <Translatable text={staticTown.name} />
          </h1>
          {province && (
            <p className="mt-2 text-2xl font-light">
              <Translatable text={province.name} />
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : townData ? (
             <div className="prose lg:prose-lg max-w-none space-y-8">
                {townData.longDescription ? <p className="lead text-lg text-muted-foreground">{townData.longDescription}</p> : <p className="lead text-lg text-muted-foreground">{staticTown.description}</p>}
                
                {townData.highlights && (
                    <div>
                        <h2 className="font-headline text-2xl font-bold">Key Highlights</h2>
                        {renderHighlights(townData.highlights)}
                    </div>
                )}

                 {(townData.bestTimeToVisit || townData.signatureAttractions) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                        {townData.bestTimeToVisit && <div><h3 className="font-headline text-xl font-bold">Best Time to Visit</h3><p>{townData.bestTimeToVisit}</p></div>}
                        {townData.signatureAttractions && <div><h3 className="font-headline text-xl font-bold">Signature Attractions</h3><p>{townData.signatureAttractions}</p></div>}
                    </div>
                 )}
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
                    {[townData.photo1, townData.photo2, townData.photo3, townData.photo4, townData.photo5, townData.photo6].map((photo, index) => photo && (
                        <div key={index} className="relative aspect-video">
                            <Image src={photo} alt={`${staticTown.name} photo ${index + 1}`} fill className="object-cover rounded-lg"/>
                        </div>
                    ))}
                 </div>
             </div>
          ) : (
             <Card className="text-center">
                <CardContent className="p-8">
                  <p className="text-muted-foreground"><Translatable text={`More information about ${staticTown.name} is coming soon.`} /></p>
                  {isAdminUser && (
                     <Badge variant="outline" className="mt-4">
                        <Edit className="w-3 h-3 mr-2" />
                        Admin Note: <Link href="/admin" className="ml-1 underline">Edit this town in Admin Dashboard</Link>
                     </Badge>
                  )}
                </CardContent>
             </Card>
          )}

           <div className="mt-12 border-t pt-8">
              <h2 className="font-headline text-2xl font-bold mb-4">Town Info</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                    <span><Translatable text="Province:" /> <strong className="font-semibold"><Translatable text={province?.name ?? 'N/A'} /></strong></span>
                </div>
                <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-primary" />
                    <span><Translatable text="Population:" /> <strong className="font-semibold"><Translatable text={staticTown.population} /></strong></span>
                </div>
              </div>
           </div>

            {staticTown.mapEmbed && (
                <div className="mt-12">
                <h2 className="text-center font-headline text-3xl font-bold mb-8"><Translatable text="Location on Map" /></h2>
                <div className="aspect-video overflow-hidden rounded-lg border">
                    <iframe
                    src={staticTown.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
