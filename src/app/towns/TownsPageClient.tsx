"use client";

import { Translatable } from '@/components/translatable';
import { towns } from '@/lib/data/towns';
import { provinces } from '@/lib/data/provinces';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export default function TownsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [sortOrder, setSortOrder] = useState('alphabetical');

  const filteredTowns = useMemo(() => {
    let filtered = towns.filter(town => 
      town.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedProvince !== 'all') {
      filtered = filtered.filter(town => town.provinceSlug === selectedProvince);
    }
    
    if (sortOrder === 'population') {
      filtered.sort((a, b) => {
        const popA = parseInt(a.population.replace(/,/g, ''));
        const popB = parseInt(b.population.replace(/,/g, ''));
        return popB - popA;
      });
    } else { // alphabetical
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchTerm, selectedProvince, sortOrder]);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Towns of South Africa',
    numberOfItems: filteredTowns.length,
    itemListElement: filteredTowns.map((town, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'City',
        name: town.name,
        url: `${siteUrl}/towns/${town.slug}`,
      },
    })),
  };

  return (
    <>
      <Script
        id="towns-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/7tDhbF45/20484249406-c92d5b103a-k.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="Towns of South Africa" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="Explore the hundreds of towns and cities, from bustling metropolises to charming small villages, that form the heart of the nation." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="mb-12 p-4 border rounded-lg bg-card grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                    placeholder="Search for a town..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by province" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Provinces</SelectItem>
                        {provinces.map(p => (
                            <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                        <SelectItem value="population">Population</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTowns.map((town) => {
                    const province = provinces.find(p => p.slug === town.provinceSlug);
                    const image = PlaceHolderImages.find(p => p.id === town.imageId);
                    const altText = `View of ${town.name}, a town in ${province?.name || 'South Africa'}`;
                    return (
                        <Link href={`/towns/${town.slug}`} key={town.slug}>
                            <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                                {image && (
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={image.imageUrl}
                                            alt={altText}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    {province && (
                                        <Badge variant="secondary" className="font-normal"><Translatable text={province.name} /></Badge>
                                    )}
                                    <h2 className="font-headline text-xl font-bold mt-1"><Translatable text={town.name} /></h2>
                                    <p className="text-muted-foreground mt-2">
                                       <Translatable text={`Population: ${town.population}`}/>
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {filteredTowns.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">
                        <Translatable text="No towns match your search criteria." />
                    </p>
                </div>
            )}
        </div>
      </section>
    </>
  );
}
