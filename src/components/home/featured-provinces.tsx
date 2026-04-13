"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { provinces } from '@/lib/data/provinces';

export function FeaturedProvinces() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Discover South Africa
          </p>
          <h2 className="text-4xl font-bold font-headline md:text-5xl text-gray-900">
            <Translatable text="Explore the Provinces" />
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            <Translatable text="From the beaches of the Western Cape to the bushveld of Limpopo — each province tells its own story." />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {provinces.map((province) => {
            const image = PlaceHolderImages.find(p => p.id === province.imageId);
            const altText = `${province.name} province, South Africa`;
            return (
              <Link href={`/provinces/${province.slug}`} key={province.slug} className="group block">
                <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={altText}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  {/* Gradient overlay - stronger on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="font-headline text-2xl font-bold drop-shadow-lg">
                      <Translatable text={province.name} />
                    </h3>
                    <p className="mt-1 text-sm text-white/80 line-clamp-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Translatable text={province.shortDescription} />
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/provinces">
              <Translatable text="View All Provinces" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
