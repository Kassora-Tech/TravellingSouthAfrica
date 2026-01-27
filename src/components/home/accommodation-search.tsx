"use client";

import { Bed, Calendar as CalendarIcon, Users, ChevronDown, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Translatable } from '@/components/translatable';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { routes } from '@/lib/data/routes';
import { Calendar } from '@/components/ui/calendar';

export function AccommodationSearch() {
  const [destination, setDestination] = useState('');
  const [routeOutDate, setRouteOutDate] = useState<Date | undefined>();
  const [routeHomeDate, setRouteHomeDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [isOutCalendarOpen, setIsOutCalendarOpen] = useState(false);
  const [isHomeCalendarOpen, setIsHomeCalendarOpen] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would trigger a search with state values.
    // For now it just redirects.
    window.location.href = '/accommodations';
  };

  const handleGuestChange = (type: 'adults' | 'children' | 'rooms', operation: 'increment' | 'decrement') => {
    setGuests(prev => {
      const newCount = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
      const value = Math.max(type === 'adults' || type === 'rooms' ? 1 : 0, newCount); // Adults/rooms >= 1, children >= 0
      return { ...prev, [type]: value };
    });
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
            className="mt-8 max-w-6xl mx-auto bg-transparent p-1 rounded-lg"
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

            {/* Date Out */}
            <div className="relative flex items-center flex-grow w-full border-t lg:border-t-0">
               <CalendarIcon className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
               <Popover open={isOutCalendarOpen} onOpenChange={setIsOutCalendarOpen}>
                 <PopoverTrigger asChild>
                    <button type="button" className="w-full text-left h-14 px-3 py-2 pl-12 text-gray-900 bg-white text-base rounded-none border-0 lg:border-r focus:outline-none focus:ring-2 focus:ring-ring">
                      {routeOutDate ? (
                        format(routeOutDate, "PPP")
                      ) : (
                        <span className="text-gray-500"><Translatable text="Route Out" /></span>
                      )}
                    </button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={routeOutDate}
                      onSelect={(date) => {
                        setRouteOutDate(date);
                        setIsOutCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                 </PopoverContent>
               </Popover>
            </div>

            {/* Date Home */}
            <div className="relative flex items-center flex-grow w-full border-t lg:border-t-0">
               <CalendarIcon className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
               <Popover open={isHomeCalendarOpen} onOpenChange={setIsHomeCalendarOpen}>
                 <PopoverTrigger asChild>
                    <button type="button" className="w-full text-left h-14 px-3 py-2 pl-12 text-gray-900 bg-white text-base rounded-none border-0 lg:border-r focus:outline-none focus:ring-2 focus:ring-ring">
                      {routeHomeDate ? (
                        format(routeHomeDate, "PPP")
                      ) : (
                        <span className="text-gray-500"><Translatable text="Route Home" /></span>
                      )}
                    </button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={routeHomeDate}
                        onSelect={(date) => {
                          setRouteHomeDate(date);
                          setIsHomeCalendarOpen(false);
                        }}
                        disabled={(date) => (routeOutDate && date <= routeOutDate) || date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                    />
                 </PopoverContent>
               </Popover>
            </div>

            {/* Guests */}
            <div className="relative flex items-center flex-grow w-full border-t lg:border-t-0">
              <Users className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="flex items-center justify-between w-full h-14 px-4 py-2 text-base text-gray-900 text-left pl-12 rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-ring">
                    <span>
                      {guests.adults} <Translatable text="adult" />{guests.adults !== 1 ? 's' : ''} · {guests.children} <Translatable text="children" /> · {guests.rooms} <Translatable text="room" />{guests.rooms !== 1 ? 's' : ''}
                    </span>
                    <ChevronDown className="h-5 w-5 opacity-70" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-black">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none"><Translatable text="Guests" /></h4>
                            <p className="text-sm text-muted-foreground">
                                <Translatable text="Adjust the number of guests and rooms." />
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="adults"><Translatable text="Adults" /></Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('adults', 'decrement')} disabled={guests.adults <= 1}><Minus className="h-4 w-4" /></Button>
                                    <span className="w-10 text-center">{guests.adults}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('adults', 'increment')}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="children"><Translatable text="Children" /></Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('children', 'decrement')} disabled={guests.children <= 0}><Minus className="h-4 w-4" /></Button>
                                    <span className="w-10 text-center">{guests.children}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('children', 'increment')}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="rooms"><Translatable text="Rooms" /></Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('rooms', 'decrement')} disabled={guests.rooms <= 1}><Minus className="h-4 w-4" /></Button>
                                    <span className="w-10 text-center">{guests.rooms}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleGuestChange('rooms', 'increment')}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="p-2 w-full lg:w-auto bg-white border-t lg:border-t-0">
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
