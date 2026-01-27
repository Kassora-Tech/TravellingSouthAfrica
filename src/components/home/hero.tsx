"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Translatable } from '../translatable';

const slidesData = [
  {
    id: 'hero-1',
    isOriginal: true,
  },
  {
    id: 'hero-slide-town',
    headline: 'Discover Charming Towns',
    subheadline: 'Explore vibrant local culture and history',
  },
  {
    id: 'hero-slide-paragliding',
    headline: 'Feel the Freedom of Flight',
    subheadline: 'Paragliding over breathtaking South African scenery',
  },
  {
    id: 'hero-slide-wildlife',
    headline: 'Wildlife Wonders Await',
    subheadline: 'Unforgettable moments at a classic waterhole',
  },
];


const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.04,
    },
  },
};
const letter = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function OriginalHeroText() {
  const { language, translate } = useLanguage();
  const originalText = "Your Free Comprehensive Guide to Travelling South Africa";
  const [displayText, setDisplayText] = useState(originalText);

  useEffect(() => {
    let isMounted = true;
    const doTranslate = async () => {
      const newText = language === 'en' ? originalText : await translate(originalText);
      if (isMounted) setDisplayText(newText);
    };
    doTranslate();
    return () => { isMounted = false; };
  }, [language, translate]);

  return (
    <motion.p
      className="mt-4 text-2xl font-light tracking-wide md:text-4xl"
      variants={sentence}
      initial="hidden"
      animate="visible"
      key={language}
    >
      {displayText.split("").map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={letter}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  return (
    <section className="relative flex h-screen items-center justify-center text-center text-white">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {slidesData.map((slide, index) => {
            const image = PlaceHolderImages.find((p) => p.id === slide.id);
            return (
              <div className="embla__slide relative flex h-full items-center justify-center" key={index}>
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center px-4 -translate-y-10">
                   <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-72 md:w-96 mix-blend-screen transform-gpu overflow-hidden fix-safari-blend-glitch-mobile"
                      src="https://files.catbox.moe/1s9wuw.webm"
                    ></video>
                  {slide.isOriginal ? (
                    <OriginalHeroText />
                  ) : (
                    <div className="mt-4">
                      <h1 className="text-4xl md:text-6xl font-bold font-headline">
                         <Translatable text={slide.headline!} />
                      </h1>
                      <p className="mt-4 text-lg md:text-2xl max-w-3xl">
                         <Translatable text={slide.subheadline!} />
                      </p>
                    </div>
                  )}
                  <div className="mt-8">
                    <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300 bg-transparent backdrop-blur-sm">
                        <Link href="/plan-your-trip">
                            <Translatable text="Plan Your Trip" />
                        </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/30 border-white/50 border"
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-6 w-6 text-white" />
      </Button>
      <Button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/30 border-white/50 border"
        variant="ghost"
        size="icon"
        onClick={scrollNext}
      >
        <ArrowRight className="h-6 w-6 text-white" />
      </Button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-3 w-3 rounded-full transition-all',
              selectedIndex === index ? 'bg-white scale-110' : 'bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
