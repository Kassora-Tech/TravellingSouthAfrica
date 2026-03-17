'use client';
import { useFirestore } from '@/firebase';
import { routes } from '@/lib/data/routes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Translatable } from '../translatable';
import { RouteHighlightEditor } from './route-highlight-editor';

export function AdminRouteHighlightsPanel() {
  const firestore = useFirestore();

  if (!firestore) {
    return <p>Loading...</p>;
  }
  
  const nationalRoutes = routes.filter(r => r.name.startsWith('N') || r.name.startsWith('R')).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Route Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {nationalRoutes.map(route => (
            <AccordionItem value={route.slug} key={route.slug}>
              <AccordionTrigger>
                <Translatable text={route.name} />
              </AccordionTrigger>
              <AccordionContent>
                <RouteHighlightEditor route={route} firestore={firestore} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

    