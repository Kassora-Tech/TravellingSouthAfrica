"use client";
import Logo from '@/components/logo';
import { Translatable } from '@/components/translatable';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

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
        <motion.p
          className="mt-4 text-xl font-light tracking-wide md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Translatable text="Your Free Comprehensive Guide to Travelling South Africa" />
        </motion.p>
      </div>
    </section>
  );
}
