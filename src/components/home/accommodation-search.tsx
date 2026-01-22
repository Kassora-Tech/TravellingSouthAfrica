"use client";

import { Bed, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Translatable } from '@/components/translatable';

export function AccommodationSearch() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would trigger a search, for now it redirects.
    window.location.href = '/accommodations';
  };

  return (
    <section style={{ backgroundColor: '#003366' }} className="py-8 md:py-12 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">
          <Translatable text="Find your next stay in South Africa" />
        </h2>
        <p className="mt-2 text-base text-neutral-200 max-w-3xl mx-auto">
          <Translatable text="Search deals on guesthouses, hotels, lodges, self-catering, B&Bs, and more from local owners..." />
        </p>

        <form 
            onSubmit={handleSubmit}
            className="mt-8 max-w-6xl mx-auto bg-transparent p-1 rounded-lg" 
            style={{ borderColor: '#F5A623', borderWidth: '3px' }}
        >
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-md overflow-hidden">
            {/* Location */}
            <div className="relative flex items-center flex-grow w-full">
              <Bed className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
              <Input
                type="text"
                placeholder="Where are you going?"
                className="pl-12 text-gray-900 w-full h-14 border-0 lg:border-r focus-visible:ring-0 rounded-none text-base"
              />
            </div>

            {/* Date Range */}
            <div className="relative flex items-center flex-grow w-full border-t lg:border-t-0">
               <Calendar className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
               <button type="button" className="w-full text-left h-14 px-3 py-2 pl-12 text-gray-500 bg-white text-base rounded-none border-0 lg:border-r focus:outline-none focus:ring-2 focus:ring-ring">
                Check-in date — Check-out date
               </button>
            </div>
            
            {/* Guests */}
            <div className="relative flex items-center flex-grow w-full border-t lg:border-t-0">
              <Users className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
              <button type="button" className="flex items-center justify-between w-full h-14 px-4 py-2 text-base text-gray-900 text-left pl-12 rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-ring">
                <span>2 adults · 0 children · 1 room</span>
                <ChevronDown className="h-5 w-5 opacity-70" />
              </button>
            </div>
            
            {/* Search Button */}
            <div className="p-2 w-full lg:w-auto bg-white border-t lg:border-t-0">
                <Button type="submit" className="w-full h-10 text-base font-bold px-8" style={{ backgroundColor: '#003366' }}>
                    <Translatable text="Search" />
                </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
