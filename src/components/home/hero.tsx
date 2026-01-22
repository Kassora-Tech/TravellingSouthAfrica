"use client";
import Logo from '@/components/logo';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-1');
  const { language, translate } = useLanguage();
  
  const originalText = "Your Free Comprehensive Guide to Travelling South Africa";
  const [displayText, setDisplayText] = useState(originalText);

  useEffect(() => {
    let isMounted = true;
    const doTranslate = async () => {
      const newText = language === 'en' ? originalText : await translate(originalText);
      if (isMounted) {
        setDisplayText(newText);
      }
    };
    doTranslate();
    return () => { isMounted = false; };
  }, [language, translate, originalText]);

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.04, // Controls the speed of typing
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
          className="mt-4 text-2xl font-light tracking-wide md:text-4xl"
          variants={sentence}
          initial="hidden"
          animate="visible"
          key={language} // Re-trigger animation on language change
        >
          {displayText.split("").map((char, index) => (
            <motion.span key={`${char}-${index}`} variants={letter}>
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
