"use client";
import Logo from '@/components/logo';
import { Translatable } from '@/components/translatable';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedTagline } from '../animated-tagline';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-1');

  return (
    <section className="relative flex h-screen items-center justify-center text-center text-white">
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
        <h1 className="mt-4 text-xl font-light tracking-wide md:text-2xl">
          <Translatable text="Discover the Rainbow Nation – Your Free Comprehensive Guide" />
        </h1>
        <div className="mt-8 w-full max-w-2xl">
          <AnimatedTagline />
        </div>
      </div>
    </section>
  );
}
