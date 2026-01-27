'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
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

interface Item {
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
}

export function AddToTripDialog({
  isOpen,
  onOpenChange,
  title,
  items,
  selectedItems,
  onSave,
}: AddToTripDialogProps) {
  const [currentSelection, setCurrentSelection] = useState<string[]>(selectedItems);
  const [searchTerm, setSearchTerm] = useState('');

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
  
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><Translatable text={title} /></DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                    <Translatable text={item.name} />
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
