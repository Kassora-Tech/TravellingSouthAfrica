"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Translatable } from '../translatable';
import Logo from '@/components/logo';

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
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
      className="mt-4 text-xl font-light tracking-wider md:text-3xl text-white/90 max-w-3xl"
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
            const altText = slide.isOriginal
              ? "A stunning landscape of the Drakensberg mountains in South Africa"
              : `${slide.headline} - ${slide.subheadline}`;
            return (
              <div className="embla__slide relative flex h-full items-center justify-center" key={index}>
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={altText}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={image.imageHint}
                  />
                )}
                {/* Stronger gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

                <div className="relative z-10 flex flex-col items-center px-4 -translate-y-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Logo className="w-64 md:w-80 drop-shadow-2xl" priority />
                  </motion.div>

                  {slide.isOriginal ? (
                    <OriginalHeroText />
                  ) : (
                    <motion.div
                      className="mt-6"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg leading-tight">
                        <Translatable text={slide.headline!} />
                      </h1>
                      <p className="mt-4 text-lg md:text-2xl max-w-3xl text-white/85 font-light">
                        <Translatable text={slide.subheadline!} />
                      </p>
                    </motion.div>
                  )}

                  <motion.div
                    className="mt-10 flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
                    >
                      <Link href="/plan-your-trip">
                        <Translatable text="Plan Your Trip" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 border-white/70 text-white hover:bg-white/20 bg-transparent backdrop-blur-sm transition-all duration-300"
                    >
                      <Link href="/provinces">
                        <Translatable text="Explore Provinces" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/40 border-white/50 border backdrop-blur-sm transition-all duration-300"
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <Button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 hover:bg-white/40 border-white/50 border backdrop-blur-sm transition-all duration-300"
        variant="ghost"
        size="icon"
        onClick={scrollNext}
      >
        <ArrowRight className="h-5 w-5 text-white" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'rounded-full transition-all duration-300',
              selectedIndex === index
                ? 'bg-white w-8 h-2.5'
                : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/75'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
