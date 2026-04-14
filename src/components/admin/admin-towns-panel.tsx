'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { towns as allTownsData } from '@/lib/data/towns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { provinces } from '@/lib/data/provinces';
import { ImageUpload } from '@/components/admin/image-upload';

// Zod schema for the form
const townFormSchema = z.object({
  longDescription: z.string().optional(),
  highlights: z.string().optional(), // Will be a string of bullet points
  bestTimeToVisit: z.string().optional(),
  signatureAttractions: z.string().optional(),
  photo1: z.string().url().optional().or(z.literal('')),
  photo2: z.string().url().optional().or(z.literal('')),
  photo3: z.string().url().optional().or(z.literal('')),
  photo4: z.string().url().optional().or(z.literal('')),
  photo5: z.string().url().optional().or(z.literal('')),
  photo6: z.string().url().optional().or(z.literal('')),
});

type TownFormData = z.infer<typeof townFormSchema>;

export function AdminTownsPanel() {
  const [selectedTownSlug, setSelectedTownSlug] = useState<string | null>(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  const provinceMap = useMemo(() => new Map(provinces.map(p => [p.slug, p.name])), []);
  const townsWithProvince = useMemo(() => allTownsData.map(town => ({
      ...town,
      provinceName: provinceMap.get(town.provinceSlug) || ''
  })).sort((a,b) => a.name.localeCompare(b.name)), [provinceMap]);

  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Town Information</CardTitle>
          <CardDescription>Select a town to add or edit its details. Changes will be live immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full max-w-sm justify-between",
                  !selectedTownSlug && "text-muted-foreground"
                )}
              >
                {selectedTownSlug
                  ? townsWithProvince.find(t => t.slug === selectedTownSlug)?.name
                  : "Select a town..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search town..." />
                <CommandList>
                  <ScrollArea className="h-72">
                    <CommandEmpty>No town found.</CommandEmpty>
                    <CommandGroup>
                      {townsWithProvince.map((town) => (
                        <CommandItem
                          value={town.name}
                          key={town.slug}
                          onSelect={() => {
                            setSelectedTownSlug(town.slug);
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              town.slug === selectedTownSlug ? "opacity-100" : "opacity-0"
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
        </CardContent>
      </Card>
      
      {selectedTownSlug && <TownEditorForm key={selectedTownSlug} townSlug={selectedTownSlug} />}
    </div>
  );
}

function TownEditorForm({ townSlug }: { townSlug: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const townDocRef = useMemoFirebase(() => doc(firestore, 'towns', townSlug), [firestore, townSlug]);
  const { data: townData, isLoading } = useDoc<TownFormData>(townDocRef);

  const form = useForm<TownFormData>({
    resolver: zodResolver(townFormSchema),
    defaultValues: {
        longDescription: '',
        highlights: '',
        bestTimeToVisit: '',
        signatureAttractions: '',
        photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', photo6: ''
    }
  });

  useEffect(() => {
    if (townData) {
      form.reset(townData);
    }
  }, [townData, form]);

  const onSubmit = async (data: TownFormData) => {
    const payload = { ...data };
    await setDoc(townDocRef, payload, { merge: true })
      .then(() => {
        toast({ title: `Town details for ${townSlug} saved!` });
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: townDocRef.path,
          operation: 'update',
          requestResourceData: payload,
        }));
        toast({ variant: 'destructive', title: 'Error saving details', description: 'You may not have the required permissions.' });
      });
  };

  const townDetails = allTownsData.find(t => t.slug === townSlug);

  if (isLoading) {
    return <p>Loading town details...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editing: {townDetails?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea id="longDescription" {...form.register('longDescription')} rows={5} placeholder="A detailed description of the town..."/>
            </div>
             <div>
              <Label htmlFor="highlights">Key Highlights</Label>
              <Textarea id="highlights" {...form.register('highlights')} rows={5} placeholder="- One highlight per line"/>
               <p className="text-sm text-muted-foreground">Start each highlight with a hyphen `-` to create a bulleted list.</p>
            </div>
            <div>
              <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
              <Input id="bestTimeToVisit" {...form.register('bestTimeToVisit')} placeholder="e.g., Spring (August to October)"/>
            </div>
            <div>
              <Label htmlFor="signatureAttractions">Signature Attractions</Label>
              <Input id="signatureAttractions" {...form.register('signatureAttractions')} placeholder="e.g., Cango Caves, Ostrich Farms"/>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Photos</h3>
                <p className="text-sm text-muted-foreground">Upload up to 6 photos for this town.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {([1, 2, 3, 4, 5, 6] as const).map(i => (
                    <ImageUpload
                      key={i}
                      label={`Photo ${i}`}
                      value={form.watch(`photo${i}` as `photo${1 | 2 | 3 | 4 | 5 | 6}`) ?? ''}
                      onChange={(url) => form.setValue(
                        `photo${i}` as `photo${1 | 2 | 3 | 4 | 5 | 6}`,
                        url,
                        { shouldDirty: true }
                      )}
                    />
                  ))}
                </div>
            </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
