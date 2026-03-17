'use client';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Mountain } from 'lucide-react';
import { Translatable } from '@/components/translatable';
import type { routes } from '@/lib/data/routes';

type Route = typeof routes[0];

interface RouteHighlightsProps {
    route: Route;
}

export function RouteHighlights({ route }: RouteHighlightsProps) {
  const firestore = useFirestore();
  const routeDocRef = useMemoFirebase(() => doc(firestore, 'routeHighlightLinks', route.slug), [firestore, route.slug]);
  const { data: highlightLinksDoc } = useDoc<Record<string, string>>(routeDocRef);

  const renderHighlightCard = (highlight: string, link?: string) => {
    const cardContent = (
      <Card className="bg-card p-6 h-full">
        <Mountain className="w-8 h-8 text-primary mb-4" />
        <h3 className="font-headline text-xl font-bold"><Translatable text={highlight} /></h3>
      </Card>
    );

    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full transition-transform hover:-translate-y-1">
          {cardContent}
        </a>
      );
    }
    return cardContent;
  };

  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold font-headline md:text-4xl">
          <Translatable text="Route Highlights" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {route.highlights.map((highlight) => (
            <div key={highlight}>
              {renderHighlightCard(highlight, highlightLinksDoc?.[highlight])}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

    