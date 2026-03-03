"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { provinces } from '@/lib/data/provinces';

export function FeaturedProvinces() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
          <Translatable text="Explore the Provinces" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {provinces.map((province) => {
                const image = PlaceHolderImages.find(p => p.id === province.imageId);
                const altText = `A scenic view of the ${province.name} province, known for being ${province.shortDescription}`;
                return (
                    <Link href={`/provinces/${province.slug}`} key={province.slug}>
                        <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                            <CardContent className="p-0">
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
                                    <div className="p-4 absolute bottom-0 left-0 text-white w-full">
                                        <h3 className="font-headline text-2xl font-bold"><Translatable text={province.name} /></h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/provinces">
              <Translatable text="View All Provinces" />{' '}
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
