import { Translatable } from '@/components/translatable';
import { routes } from '@/lib/data/routes';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map } from 'lucide-react';

export default function RoutesPage() {
  return (
    <>
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-primary md:text-5xl">
            <Translatable text="Iconic Routes" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            <Translatable text="Embark on an unforgettable journey. South Africa's scenic routes offer some of the most breathtaking drives in the world." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {routes.map((route) => {
                    const image = PlaceHolderImages.find(p => p.id === route.imageId);
                    return (
                        <Card key={route.slug} className="group overflow-hidden flex flex-col md:flex-row">
                            {image && (
                                <div className="relative h-64 md:h-auto md:w-1/3 flex-shrink-0">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <h2 className="font-headline text-2xl font-bold text-primary">
                                    <Translatable text={route.name} />
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {route.distance} | {route.days}
                                </p>
                                <p className="mt-4 text-muted-foreground flex-grow">
                                    <Translatable text={route.tagline} />
                                </p>
                                <div className="mt-6">
                                    <Button asChild>
                                        <Link href={`/routes/${route.slug}`}>
                                            <Translatable text="View Route Details" />
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
      </section>
    </>
  );
}
