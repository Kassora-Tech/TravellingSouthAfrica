'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Translatable } from '../translatable';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Item {
  slug: string;
  name: string;
  provinceSlug?: string;
  location?: string;
}

interface Province {
    slug: string;
    name: string;
}

interface AddToTripDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  items: Item[];
  selectedItems: string[];
  onSave: (selectedSlugs: string[]) => void;
  provinces?: Province[];
}

export function AddToTripDialog({
  isOpen,
  onOpenChange,
  title,
  items,
  selectedItems,
  onSave,
  provinces,
}: AddToTripDialogProps) {
  const [currentSelection, setCurrentSelection] = useState<string[]>(selectedItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');

  useEffect(() => {
    if(isOpen) {
        setCurrentSelection(selectedItems);
    }
  }, [isOpen, selectedItems])

  const handleSelect = (slug: string) => {
    setCurrentSelection((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSave = () => {
    onSave(currentSelection);
    onOpenChange(false);
  };
  
  const showProvinceFilter = provinces && provinces.length > 0;
  const isSightsDialog = title.includes('Sights');

  const provinceMap = useMemo(() => {
    if (!provinces) return new Map();
    return new Map(provinces.map(p => [p.slug, p.name]));
  }, [provinces]);

  const filteredItems = useMemo(() => {
    let results = [...items];

    if (showProvinceFilter && selectedProvince !== 'all') {
      results = results.filter(item => item.provinceSlug === selectedProvince);
    }

    if (searchTerm) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    results.sort((a, b) => a.name.localeCompare(b.name));

    return results;
  }, [items, searchTerm, selectedProvince, showProvinceFilter]);

  const totalTownsInProvince = useMemo(() => {
      if (!showProvinceFilter || selectedProvince === 'all') return items.length;
      return items.filter(i => i.provinceSlug === selectedProvince).length;
  }, [items, selectedProvince, showProvinceFilter]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle><Translatable text={title} /></DialogTitle>
          <DialogDescription className="sr-only">
            Select items to add to your trip. Use the search and filter options to narrow down the list.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
           <Input 
            placeholder={`Search ${title.replace('Add ', '').toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {showProvinceFilter && (
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
          )}
          
          <p className="text-sm text-muted-foreground px-1">
            {isSightsDialog ? (
              <Translatable text={`Showing ${filteredItems.length} of ${items.length} sights`} />
            ) : (
              <>
                <Translatable text={`Showing ${filteredItems.length} of ${totalTownsInProvince} towns`} />
                {selectedProvince !== 'all' && <Translatable text={` in ${provinceMap.get(selectedProvince)}`} />}
              </>
            )}
          </p>

          <ScrollArea className="h-72">
            <div className="space-y-2 pr-4">
              {filteredItems.map((item) => (
                <div key={item.slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.slug}
                    checked={currentSelection.includes(item.slug)}
                    onCheckedChange={() => handleSelect(item.slug)}
                  />
                  <Label htmlFor={item.slug} className="font-normal cursor-pointer flex-grow">
                    {isSightsDialog ? (
                      <Translatable text={`${item.name} (${item.location}, ${provinceMap.get(item.provinceSlug ?? '') || 'N/A'})`} />
                    ) : (
                      <Translatable text={showProvinceFilter && item.provinceSlug ? `${item.name} (${provinceMap.get(item.provinceSlug) || 'N/A'})` : item.name} />
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              <Translatable text="Cancel" />
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            <Translatable text="Save" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
