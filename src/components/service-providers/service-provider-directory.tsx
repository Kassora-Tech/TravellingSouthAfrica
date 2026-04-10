'use client';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { towns as allTowns } from '@/lib/data/towns';
import { ServiceProviderCard } from './service-provider-card';
import { Translatable } from '../translatable';
import Link from 'next/link';

export function ServiceProviderDirectory({ providers }: { providers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTown, setSelectedTown] = useState('all');

  const townsWithProviders = useMemo(() => {
    const townSlugs = new Set(providers.map(p => p.townSlug));
    return allTowns
      .filter(t => townSlugs.has(t.slug))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [providers]);

  const categories = useMemo(() => {
    const categorySet = new Set(providers.map(p => p.category));
    return Array.from(categorySet).sort();
  }, [providers]);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch = searchTerm ? provider.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
      const matchesTown = selectedTown === 'all' || provider.townSlug === selectedTown;
      return matchesSearch && matchesCategory && matchesTown;
    });
  }, [providers, searchTerm, selectedCategory, selectedTown]);

  return (
    <div>
      <div className="mb-8 p-4 border rounded-lg bg-card grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <Input
          placeholder="Search by provider name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedTown} onValueChange={setSelectedTown}>
          <SelectTrigger><SelectValue placeholder="Filter by town" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Towns</SelectItem>
            {townsWithProviders.map(town => <SelectItem key={town.slug} value={town.slug}>{town.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filteredProviders.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map(provider => (
            <ServiceProviderCard key={provider.id} listing={provider} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground"><Translatable text="No service providers match your search criteria." /></p>
        </div>
      )}

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold font-headline"><Translatable text="Are you a service provider?"/></h3>
        <p className="text-muted-foreground mt-2"><Translatable text="Get your business in front of thousands of travellers."/></p>
        <Button asChild className="mt-4">
          <Link href="/add-your-listing"><Translatable text="Add Your Listing"/></Link>
        </Button>
      </div>
    </div>
  );
}

    