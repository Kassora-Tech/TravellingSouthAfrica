"use client";

import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function DirectionsPage() {
  const [origin, setOrigin] = useState('Cape Town, South Africa');
  const [destination, setDestination] = useState('Johannesburg, South Africa');
  
  // Default to a view of South Africa. The embed API for 'view' is less strict about keys.
  const [mapUrl, setMapUrl] = useState(`https://www.google.com/maps/embed/v1/view?center=-30.5595,22.9375&zoom=5&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      // The 'directions' part of the embed API is stricter and will show an error inside the iframe without a valid key.
      const url = `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
      setMapUrl(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center text-primary">
          <Translatable text="Get Directions" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          <Translatable text="Find the best route for your journey across South Africa." />
        </p>

        <form className="mt-8 space-y-4 md:space-y-0 md:flex md:space-x-4 items-end" onSubmit={handleSubmit}>
          <div className="space-y-2 flex-grow">
            <Label htmlFor="origin"><Translatable text="Origin" /></Label>
            <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g., Cape Town" />
          </div>
          <div className="space-y-2 flex-grow">
            <Label htmlFor="destination"><Translatable text="Destination" /></Label>
            <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Johannesburg" />
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Translatable text="Find Route" />
          </Button>
        </form>

         <div className="mt-8">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapUrl}>
                </iframe>
            </div>
             <p className="text-center text-xs text-muted-foreground mt-2">
                Note: Full directions functionality requires a valid Google Maps API key to be configured.
            </p>
        </div>
      </div>
    </div>
  );
}
