"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Translatable } from '@/components/translatable';
import { Map, Calculator, ListChecks } from 'lucide-react';
import Link from 'next/link';

const ctaItems = [
  {
    icon: ListChecks,
    title: 'Plan Your Trip',
    description: 'Login to create and save your personalized travel itineraries.',
    href: '/plan-your-trip',
    buttonText: 'Start Planning',
  },
  {
    icon: Calculator,
    title: 'Convert Currency',
    description: 'Use our handy tool for up-to-date exchange rates.',
    href: '/tools/currency-converter',
    buttonText: 'Convert Now',
  },
];

export function CallToActions() {
  return (
    <section id="cta" className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {ctaItems.map((item) => (
            <Card key={item.title} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <item.icon className="h-10 w-10" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col text-center">
                <CardTitle className="font-headline text-2xl">
                  <Translatable text={item.title} />
                </CardTitle>
                <p className="mt-2 flex-grow text-muted-foreground">
                  <Translatable text={item.description} />
                </p>
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link href={item.href}>
                      <Translatable text={item.buttonText} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
