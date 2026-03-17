"use client";

import { Bed, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Translatable } from '@/components/translatable';
import { useState } from 'react';
import { towns as allTowns } from '@/lib/data/towns';
import { provinces } from '@/lib/data/provinces';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function AccommodationSearch() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const provinceMap = new Map(provinces.map(p => [p.slug, p.name]));
  const townsWithProvince = allTowns.map(town => ({
      ...town,
      provinceName: provinceMap.get(town.provinceSlug) || ''
  })).sort((a,b) => a.name.localeCompare(b.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedValue) {
        const town = townsWithProvince.find(t => t.name.toLowerCase() === selectedValue.toLowerCase());
        const slug = town ? town.slug : selectedValue.replace(/\s+/g, '-');
        window.location.href = `/accommodations?town=${slug}`;
    } else {
        window.location.href = '/accommodations';
    }
  };

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? "" : currentValue;
    setSelectedValue(newValue);
    setOpen(false);
    if (newValue) {
        const town = townsWithProvince.find(t => t.name.toLowerCase() === newValue.toLowerCase());
        const slug = town ? town.slug : newValue.replace(/\s+/g, '-');
        window.location.href = `/accommodations?town=${slug}`;
    }
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
            className="mt-8 max-w-4xl mx-auto bg-transparent rounded-lg"
        >
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-md overflow-hidden">
            {/* Location */}
            <div className="relative flex items-center flex-grow w-full">
              <Bed className="absolute left-4 h-5 w-5 text-gray-500 z-10" />
              <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                      <Button
                          variant="ghost"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full h-14 pl-12 justify-between text-base border-0 lg:border-r rounded-none focus:ring-0 focus:ring-offset-0 text-foreground hover:bg-white"
                      >
                          <span className="truncate">
                            {selectedValue
                                ? townsWithProvince.find(t => t.name.toLowerCase() === selectedValue.toLowerCase())?.name
                                : <span className="text-muted-foreground">Enter a town or city...</span>}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                          <CommandInput placeholder="Search for a town..." />
                           <CommandList>
                            <ScrollArea className="h-72">
                                <CommandEmpty>No town found.</CommandEmpty>
                                <CommandGroup>
                                    {townsWithProvince.map((town) => (
                                    <CommandItem
                                        key={town.slug}
                                        value={town.name}
                                        onSelect={handleSelect}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue === town.name.toLowerCase() ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                        {town.name} ({town.provinceName})
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </ScrollArea>
                          </CommandList>
                      </Command>
                  </PopoverContent>
              </Popover>
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
