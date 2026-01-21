import { towns } from '@/lib/data/towns';
import { provinces } from '@/lib/data/provinces';
import { sights } from '@/lib/data/sights';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  return towns.map((town) => ({
    slug: town.slug,
  }));
}

export default function TownDetailPage({ params }: { params: { slug:string } }) {
  const town = towns.find((p) => p.slug === params.slug);

  if (!town) {
    notFound();
  }

  const province = provinces.find(p => p.slug === town.provinceSlug);
  const heroImage = PlaceHolderImages.find((p) => p.id === town.imageId);
  const nearbySights = sights.filter(s => town.nearbySightSlugs?.includes(s.slug));

  return (
    <div>
      <section className="relative h-[50vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold font-headline">
            <Translatable text={town.name} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <Translatable text={town.description} />
              </p>
            </div>
            <div className="bg-secondary p-6 rounded-lg space-y-4">
              <h3 className="font-headline text-2xl font-bold border-b pb-2"><Translatable text="Town Info" /></h3>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <span><Translatable text="Province:" /> <strong className="font-semibold"><Translatable text={province?.name ?? 'N/A'} /></strong></span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-primary" />
                <span><Translatable text="Population:" /> <strong className="font-semibold"><Translatable text={town.population} /></strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {nearbySights && nearbySights.length > 0 && (
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
              <Translatable text="Nearby Sights & Attractions" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nearbySights.map((sight) => {
                const image = PlaceHolderImages.find((p) => p.id === sight.imageId);
                return (
                  <Link href={`/sights/${sight.slug}`} key={sight.slug}>
                    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                      {image && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <Badge><Translatable text={sight.category} /></Badge>
                        <h3 className="font-headline text-xl font-bold mt-2"><Translatable text={sight.name} /></h3>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <Translatable text={sight.location} />
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center font-headline text-3xl font-bold mb-8"><Translatable text="Location on Map" /></h2>
          <div className="aspect-video overflow-hidden rounded-lg border">
            <iframe
              src={town.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
