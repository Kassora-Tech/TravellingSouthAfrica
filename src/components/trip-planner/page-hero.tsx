
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';
import Logo from '@/components/logo';

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


export function PlanTripHero() {
    const heroImage = PlaceHolderImages.find((p) => p.id === 'plan-trip-hero');

    return (
        <section className="relative flex h-[50vh] min-h-[300px] items-center justify-center text-center text-white">
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
            <div className="relative z-10 flex flex-col items-center px-4 md:-translate-y-10">
                <Logo className="w-72 md:w-96" />
                <OriginalHeroText />
            </div>
        </section>
    );
}
