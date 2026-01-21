import { Translatable } from '@/components/translatable';
import { sights } from '@/lib/data/sights';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// TODO: Add filtering logic
export default function SightsPage() {
  return (
    <>
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-primary md:text-5xl">
            <Translatable text="Sights to See" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            <Translatable text="From majestic mountains and sprawling national parks to vibrant cultural hubs, explore the attractions that make South Africa unforgettable." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sights.map((sight) => {
                    const image = PlaceHolderImages.find(p => p.id === sight.imageId);
                    return (
                        <Link href={`/sights/${sight.slug}`} key={sight.slug}>
                            <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                                {image && (
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                )}
                                <CardContent className="p-4 absolute bottom-0 left-0 text-white w-full">
                                    <Badge variant="secondary"><Translatable text={sight.category} /></Badge>
                                    <h3 className="font-headline text-xl font-bold mt-2"><Translatable text={sight.name} /></h3>
                                    <p className="text-sm flex items-center mt-1">
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
    </>
  );
}
