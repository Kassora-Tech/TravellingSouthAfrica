'use client';

import React from 'react';
import Image from 'next/image';

import { PlaceHolderImages } from '@/lib/placeholder-images';

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
        </section>
    );
}
