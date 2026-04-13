
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Briefcase } from 'lucide-react';
import { Translatable } from '../translatable';
import { useToast } from '@/hooks/use-toast';
import { serviceCategoriesMap } from '@/lib/service-categories';
import Image from 'next/image';

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  townSlug: string;
  description: string;
  imageUrls?: string[];
}

interface AvailableServiceProvidersProps {
  selectedTrip: any;
  firestore: Firestore;
  onSave: (ids: string[]) => void;
}

const getCategoryIcon = (category: string) => {
  return serviceCategoriesMap[category]?.icon || Briefcase;
};

export function AvailableServiceProviders({
  selectedTrip,
  firestore,
  onSave,
}: AvailableServiceProvidersProps) {
  const { toast } = useToast();
  const [availableProviders, setAvailableProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedTrip?.serviceProviderIds || []);

  const townSlugs = useMemo(() => selectedTrip?.towns?.map((t: any) => t.slug) || [], [selectedTrip]);

  useEffect(() => {
    setSelectedIds(selectedTrip?.serviceProviderIds || []);
  }, [selectedTrip?.id, selectedTrip?.serviceProviderIds]);

  useEffect(() => {
    if (!townSlugs || townSlugs.length === 0) {
      setAvailableProviders([]);
      return;
    }

    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const providersRef = collection(firestore, 'service_providers');
        const q = query(
          providersRef,
          where('approved', '==', true),
          where('townSlug', 'in', townSlugs.slice(0, 10))
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ServiceProvider[];
        setAvailableProviders(results);
      } catch (error) {
        console.error('Error fetching service providers:', error);
        toast({ variant: "destructive", title: "Error fetching service providers" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [firestore, townSlugs.join(','), toast]);

  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newIds);
    onSave(newIds);
    toast({
      title: selectedIds.includes(id) ? 'Service Provider Removed' : 'Service Provider Added',
      description: availableProviders.find(p => p.id === id)?.name,
    });
  };

  const groupedProviders = useMemo(() => {
    return availableProviders.reduce((acc, provider) => {
      const category = provider.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(provider);
      return acc;
    }, {} as Record<string, ServiceProvider[]>);
  }, [availableProviders]);

  const defaultOpenCategories = useMemo(() => {
    return Object.keys(groupedProviders).filter(category =>
      groupedProviders[category].some(provider => selectedIds.includes(provider.id))
    );
  }, [groupedProviders, selectedIds]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-headline">
            <Translatable text="Service Providers" />
          </CardTitle>
        </div>
        {availableProviders.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedIds.length} selected
          </span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading service providers...</p>}
        {!isLoading && townSlugs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add towns to your trip to see available service providers.
          </p>
        )}
        {!isLoading && townSlugs.length > 0 && availableProviders.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No service providers found for your selected towns yet.
          </p>
        )}
        {!isLoading && Object.keys(groupedProviders).length > 0 && (
          <Accordion type="multiple" defaultValue={defaultOpenCategories} className="w-full">
            {Object.entries(groupedProviders).map(([category, providers]) => {
              const CategoryIcon = getCategoryIcon(category);
              return (
                <AccordionItem value={category} key={category}>
                  <AccordionTrigger className="hover:no-underline bg-muted/50 px-4 rounded-md">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-5 w-5" />
                      <span className="font-semibold"><Translatable text={category} /></span>
                      <span className="text-muted-foreground">({providers.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-2">
                      {providers.map(provider => {
                        const isSelected = selectedIds.includes(provider.id);
                        return (
                          <div
                            key={provider.id}
                            className={`flex items-center gap-4 p-2 rounded-md border ${isSelected ? 'border-primary bg-primary/5' : 'bg-background'}`}
                          >
                            <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                              {provider.imageUrls && provider.imageUrls[0] ? (
                                <Image src={provider.imageUrls[0]} alt={provider.name} fill sizes="48px" className="object-cover" />
                              ) : (
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-bold truncate">{provider.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{provider.description}</p>
                            </div>
                            <Button
                              size="sm"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() => handleToggle(provider.id)}
                              className={`w-24 ${isSelected ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                            >
                              {isSelected ? '✓ Selected' : 'Select'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
