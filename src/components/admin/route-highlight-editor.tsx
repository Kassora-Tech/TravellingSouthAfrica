'use client';
import { useEffect, useState } from 'react';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { useDoc, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import type { routes } from '@/lib/data/routes';

type Route = typeof routes[0];

interface RouteHighlightEditorProps {
  route: Route; 
  firestore: Firestore;
}

export function RouteHighlightEditor({ route, firestore }: RouteHighlightEditorProps) {
  const { toast } = useToast();
  const routeDocRef = useMemoFirebase(() => doc(firestore, 'routeHighlightLinks', route.slug), [firestore, route.slug]);
  const { data: highlightLinksDoc, isLoading } = useDoc(routeDocRef);
  
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (highlightLinksDoc) {
      const initialLinks: Record<string, string> = {};
      route.highlights.forEach(h => {
        initialLinks[h] = (highlightLinksDoc as any)[h] || '';
      });
      setLinks(initialLinks);
    } else if (!isLoading) {
      const initialLinks: Record<string, string> = {};
      route.highlights.forEach(h => {
        initialLinks[h] = '';
      });
      setLinks(initialLinks);
    }
  }, [highlightLinksDoc, route.highlights, isLoading]);

  const handleLinkChange = (highlight: string, value: string) => {
    setLinks(prev => ({ ...prev, [highlight]: value }));
  };

  const handleSave = () => {
    const payload = { ...links };
    setDoc(routeDocRef, payload, { merge: true })
      .then(() => {
        toast({ title: `Highlights for ${route.name} saved!` });
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: routeDocRef.path,
          operation: 'update',
          requestResourceData: payload,
        }));
        toast({ variant: 'destructive', title: 'Error saving highlights' });
      });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      {isLoading ? <p>Loading highlights...</p> : (
        <div className="space-y-4">
          {route.highlights.map(highlight => (
            <div key={highlight} className="space-y-2">
              <Label htmlFor={`${route.slug}-${highlight}`}>{highlight}</Label>
              <Input
                id={`${route.slug}-${highlight}`}
                value={links[highlight] || ''}
                onChange={(e) => handleLinkChange(highlight, e.target.value)}
                placeholder="https://..."
              />
            </div>
          ))}
          <Button onClick={handleSave}>Save Changes for {route.name}</Button>
        </div>
      )}
    </div>
  );
}
