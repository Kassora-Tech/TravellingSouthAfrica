"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';

const featured = [
  {
    id: 'featured-1',
    title: 'Cape Town',
    province: 'Western Cape',
    imageId: 'featured-1',
    href: '/towns/cape-town',
  },
  {
    id: 'featured-2',
    title: 'Kruger National Park',
    province: 'Mpumalanga',
    imageId: 'featured-2',
    href: '/sights/kruger-national-park',
  },
  {
    id: 'featured-3',
    title: 'Drakensberg',
    province: 'KwaZulu-Natal',
    imageId: 'featured-3',
    href: '/sights/drakensberg-mountains',
  },
  {
    id: 'featured-4',
    title: 'Johannesburg',
    province: 'Gauteng',
    imageId: 'featured-4',
    href: '/towns/johannesburg',
  },
  {
    id: 'featured-5',
    title: 'Garden Route',
    province: 'Western Cape',
    imageId: 'featured-5',
    href: '/routes/garden-route',
  },
];

export function FeaturedDestinations() {
  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
          <Translatable text="Featured Destinations" />
        </h2>
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {featured.map((item) => {
              const image = PlaceHolderImages.find((p) => p.id === item.imageId);
              return (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Link href={item.href}>
                      <Card className="group overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative h-64">
                            {image && (
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                              <h3 className="text-2xl font-bold font-headline">
                                <Translatable text={item.title} />
                              </h3>
                              <p className="text-sm">
                                <Translatable text={item.province} />
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/sights">
              <Translatable text="Explore All Sights" />{' '}
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
