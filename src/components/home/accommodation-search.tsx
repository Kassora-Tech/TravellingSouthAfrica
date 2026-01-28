"use client";

import { Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Translatable } from '@/components/translatable';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { routes } from '@/lib/data/routes';

export function AccommodationSearch() {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would trigger a search with state values.
    // For now it just redirects.
    window.location.href = '/accommodations';
  };

  return (
    <section className="relative py-8 md:py-12 text-white bg-cover bg-center" style={{ backgroundImage: "url('https://i.ibb.co/0yspg012/south-africa-travel-facts-banner.jpg')" }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="container relative mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">
          <Translatable text="Find your next stay in South Africa" />
        </h2>
        <p className="mt-2 text-base text-neutral-200 max-w-3xl mx-auto">
          <Translatable text="Search deals on guesthouses, hotels, lodges, self-catering, B&Bs, and more from local owners..." />
        </p>

        <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-4xl mx-auto bg-transparent p-1 rounded-lg"
            style={{ borderColor: 'hsl(var(--accent))', borderWidth: '3px' }}
        >
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-md overflow-hidden">
            {/* Location */}
            <div className="relative flex items-center flex-grow w-full">
              <Bed className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full h-14 pl-12 text-base border-0 lg:border-r rounded-none focus:ring-0 focus:ring-offset-0 text-left justify-start gap-2">
                  <SelectValue placeholder="Pick your route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.slug} value={route.slug}>
                      <Translatable text={route.name} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="p-2 w-full lg:w-auto bg-white border-t lg:border-t-0 lg:border-l">
                <Button type="submit" className="w-full h-10 text-base font-bold px-8 bg-blue-900 hover:bg-blue-800">
                    <Translatable text="Search" />
                </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
