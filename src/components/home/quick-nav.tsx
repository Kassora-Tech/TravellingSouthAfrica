"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Building, Mountain, Map, Wrench } from 'lucide-react';
import { Translatable } from '@/components/translatable';

const navItems = [
  {
    icon: Globe,
    title: '9 Provinces',
    description: 'Discover the diverse regions',
    href: '/provinces',
  },
  {
    icon: Building,
    title: '862 Towns',
    description: 'Explore cities and villages',
    href: '/towns',
  },
  {
    icon: Mountain,
    title: 'Sights to See',
    description: 'Find breathtaking attractions',
    href: '/sights',
  },
  {
    icon: Map,
    title: 'Major Routes',
    description: 'Journey along scenic roads',
    href: '/routes',
  },
  {
    icon: Wrench,
    title: 'Travel Tools',
    description: 'Plan your perfect trip',
    href: '#cta',
  },
];

export function QuickNav() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {navItems.map((item) => (
            <Link key={item.title} href={item.href} className="block h-full">
              <Card className="h-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-fit rounded-full bg-primary/10 p-4 text-primary">
                    <item.icon className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-headline text-xl">
                    <Translatable text={item.title} />
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground">
                    <Translatable text={item.description} />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
