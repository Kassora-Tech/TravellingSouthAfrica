"use client";

import React from 'react';
import Image from 'next/image';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';

export function AddListingHero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'add-your-listing-hero-background');

  return (
    <section className="relative flex h-[50vh] min-h-[400px] items-center justify-center text-center text-white">
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
      <div className="relative z-10 flex flex-col items-center px-4">
        <Logo className="w-72 md:w-96" />
      </div>
    </section>
  );
}
