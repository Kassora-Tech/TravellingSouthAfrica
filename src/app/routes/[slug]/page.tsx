import { routes } from '@/lib/data/routes';
import { towns as allTowns } from '@/lib/data/towns';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { MapPin, Milestone, Mountain } from 'lucide-react';

export async function generateStaticParams() {
  return routes.map((route) => ({
    slug: route.slug,
  }));
}

export default function RouteDetailPage({ params }: { params: { slug: string } }) {
  const route = routes.find((p) => p.slug === params.slug);

  if (!route) {
    notFound();
  }

  const routeTowns = allTowns.filter(t => route.townSlugs.includes(t.slug));
  const heroImage = PlaceHolderImages.find((p) => p.id === route.imageId);

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
            <Translatable text={route.name} />
          </h1>
          <p className="mt-4 text-xl">
            <Translatable text={route.tagline} />
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-center text-muted-foreground">
            <Translatable text={route.description} />
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{route.distance}</p>
              <p className="text-muted-foreground"><Translatable text="Approx. Distance" /></p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{route.days}</p>
              <p className="text-muted-foreground"><Translatable text="Suggested Days" /></p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{route.highlights.length}</p>
              <p className="text-muted-foreground"><Translatable text="Key Highlights" /></p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
              <Translatable text="Route Highlights" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {route.highlights.map((highlight, index) => (
                    <Card key={index} className="bg-card p-6">
                        <Mountain className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-headline text-xl font-bold"><Translatable text={highlight} /></h3>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
      {routeTowns.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
              <Translatable text="Towns Along the Route" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {routeTowns.map((town) => {
                    const image = PlaceHolderImages.find((p) => p.id === town.imageId);
                    return (
                        <Link href={`/towns/${town.slug}`} key={town.slug}>
                            <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 text-center">
                                {image && (
                                    <div className="relative h-32 w-full">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                )}
                                <CardContent className="p-3">
                                    <h3 className="font-headline text-lg font-bold"><Translatable text={town.name} /></h3>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
