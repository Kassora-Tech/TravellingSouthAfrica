import { Translatable } from '@/components/translatable';
import { sights } from '@/lib/data/sights';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export const metadata: Metadata = {
  title: 'Top Sights & Attractions in South Africa',
  description: 'Explore the must-see sights in South Africa, from Table Mountain to Kruger National Park. Your guide to the best attractions across the nation.',
  alternates: {
    canonical: '/sights',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Sights',
      item: `${siteUrl}/sights`,
    },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'South African Sights and Attractions',
  itemListElement: sights.map((sight, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'TouristAttraction',
      name: sight.name,
      url: `${siteUrl}/sights/${sight.slug}`,
      description: sight.description,
    },
  })),
};


// TODO: Add filtering logic
export default function SightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/bj4CV8rW/578251416429199326767899.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="Sights to See" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="From majestic mountains and sprawling national parks to vibrant cultural hubs, explore the attractions that make South Africa unforgettable." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sights.map((sight) => {
                    const image = PlaceHolderImages.find(p => p.id === sight.imageId);
                    const altText = `${sight.name}, a top tourist attraction in ${sight.location}, South Africa`;
                    return (
                        <Link href={`/sights/${sight.slug}`} key={sight.slug}>
                            <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                                <div className="relative h-64 w-full">
                                    {image && (
                                        <Image
                                            src={image.imageUrl}
                                            alt={altText}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                                        <Badge variant="secondary"><Translatable text={sight.category} /></Badge>
                                        <h2 className="font-headline text-xl font-bold mt-2"><Translatable text={sight.name} /></h2>
                                        <p className="flex items-center mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <Translatable text={sight.location} />
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
      </section>
    </>
  );
}
