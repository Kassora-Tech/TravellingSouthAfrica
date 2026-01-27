'use client';

import { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Map, MapPin, Mountain, Bed, Route as RouteIcon, Trash2, CalendarDays } from 'lucide-react';
import { Translatable } from '../translatable';
import { format } from 'date-fns';
import { AddToTripDialog } from './add-to-trip-dialog';

import { provinces } from '@/lib/data/provinces';
import { towns } from '@/lib/data/towns';
import { sights } from '@/lib/data/sights';
import { routes } from '@/lib/data/routes';
// No accommodation data file, so I'll disable that for now.

import { createTrip, updateTripItems } from '@/firebase/firestore/trips';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError, errorEmitter } from '@/firebase';


interface Trip {
  name: string;
  startDate: { seconds: number; nanoseconds: number };
  endDate: { seconds: number; nanoseconds: number };
  provinceIds?: string[];
  townIds?: string[];
  sightIds?: string[];
  routeIds?: string[];
  accommodationIds?: string[];
}

type DialogState = {
  isOpen: boolean;
  type: 'province' | 'town' | 'sight' | 'route' | null;
}

export function TripPlanner({ user }: { user: User }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const tripsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/trips`);
  }, [firestore, user]);
  
  const { data: trips, isLoading: tripsLoading } = useCollection<Trip>(tripsQuery);
  
  const [selectedTrip, setSelectedTrip] = useState<WithId<Trip> | null>(null);
  const [isCreateTripOpen, setCreateTripOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState<Date | undefined>();
  const [newTripEndDate, setNewTripEndDate] = useState<Date | undefined>();
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, type: null });
  const [isStartCalOpen, setStartCalOpen] = useState(false);
  const [isEndCalOpen, setEndCalOpen] = useState(false);

  useEffect(() => {
    if (!selectedTrip && trips && trips.length > 0) {
        setSelectedTrip(trips[0]);
    }
    if (selectedTrip && trips && !trips.find(t => t.id === selectedTrip.id)) {
        setSelectedTrip(trips.length > 0 ? trips[0] : null);
    }
  }, [trips, selectedTrip]);


  const handleCreateTrip = () => {
    if (!newTripName || !newTripStartDate || !newTripEndDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a name, start date, and end date for your trip.",
      });
      return;
    }
    createTrip(firestore, {
      name: newTripName,
      startDate: newTripStartDate,
      endDate: newTripEndDate,
      userId: user.uid,
    });
    setCreateTripOpen(false);
    setNewTripName('');
    setNewTripStartDate(undefined);
    setNewTripEndDate(undefined);
    toast({
        title: "Trip Created!",
        description: `Your trip "${newTripName}" has been created.`,
    });
  };

  const handleSaveChanges = (itemType: 'provinceIds' | 'townIds' | 'sightIds' | 'routeIds', selectedSlugs: string[]) => {
    if (!selectedTrip) return;
    updateTripItems(firestore, user.uid, selectedTrip.id, itemType, selectedSlugs);
    // Optimistic update
    setSelectedTrip(prev => prev ? ({ ...prev, [itemType]: selectedSlugs }) : null);
    toast({
        title: "Itinerary Updated!",
        description: `Your trip "${selectedTrip.name}" has been updated.`,
    });
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    
    const tripDocRef = doc(firestore, `users/${user.uid}/trips`, tripId);
    
    try {
        await deleteDoc(tripDocRef);
        if (selectedTrip?.id === tripId) {
            setSelectedTrip(null);
        }
        toast({
            title: "Trip Deleted",
            description: "Your trip has been successfully deleted.",
        });
    } catch(e) {
        const permissionError = new FirestorePermissionError({
            path: tripDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: "Could not delete trip. You may not have permission.",
        });
    }
  }

  const filteredItems = useMemo(() => {
    if (!selectedTrip || !selectedTrip.provinceIds || selectedTrip.provinceIds.length === 0) {
      return { towns: [], sights: [], routes: [] };
    }

    const provinceSlugs = selectedTrip.provinceIds;

    const filteredTowns = towns.filter(t => provinceSlugs.includes(t.provinceSlug));
    const filteredSights = sights.filter(s => provinceSlugs.includes(s.provinceSlug));
    const filteredRoutes = routes.filter(route => 
      route.townSlugs.some(townSlug => {
        const town = towns.find(t => t.slug === townSlug);
        return town && provinceSlugs.includes(town.provinceSlug);
      })
    );

    return { towns: filteredTowns, sights: filteredSights, routes: filteredRoutes };
  }, [selectedTrip]);

  const dataMap = useMemo(() => ({
    province: { title: "Add Provinces", items: provinces, key: 'provinceIds' as const },
    town: { title: "Add Towns", items: filteredItems.towns, key: 'townIds' as const },
    sight: { title: "Add Sights", items: filteredItems.sights, key: 'sightIds' as const },
    route: { title: "Add Routes", items: filteredItems.routes, key: 'routeIds' as const },
  }), [filteredItems]);

  const currentDialogData = dialogState.type ? dataMap[dialogState.type] : null;

  const renderItemList = (title: string, icon: React.ReactNode, itemIds: string[] | undefined, allItems: {slug: string, name: string}[], type: 'province' | 'town' | 'sight' | 'route') => {
      const items = itemIds?.map(id => allItems.find(p => p.slug === id)).filter(Boolean) as {name: string, slug: string}[];
      const isAddDisabled = type !== 'province' && (!selectedTrip?.provinceIds || selectedTrip.provinceIds.length === 0);

      return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-xl font-headline"><Translatable text={title}/></CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDialogState({ isOpen: true, type: type })} disabled={isAddDisabled}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent>
                {items && items.length > 0 ? (
                    <ul className="list-disc pl-5 text-muted-foreground">
                        {items.map(item => <li key={item.slug}><Translatable text={item.name}/></li>)}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {isAddDisabled 
                            ? <Translatable text={`Please add a province to see available ${title.toLowerCase()}.`} />
                            : <Translatable text={`No ${title.toLowerCase()} added yet.`} />
                        }
                    </p>
                )}
            </CardContent>
        </Card>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1">
                <h2 className="text-2xl font-bold font-headline mb-4"><Translatable text="My Trips"/></h2>
                <div className="space-y-2">
                   <Dialog open={isCreateTripOpen} onOpenChange={setCreateTripOpen} modal>
                        <DialogTrigger asChild>
                            <Button className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <Translatable text="Create New Trip"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle><Translatable text="Create a New Trip" /></DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trip-name"><Translatable text="Trip Name"/></Label>
                                    <Input id="trip-name" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} placeholder="e.g., Garden Route Adventure"/>
                                </div>
                                <div className="space-y-2">
                                    <Label><Translatable text="Start Date"/></Label>
                                    <Popover open={isStartCalOpen} onOpenChange={setStartCalOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {newTripStartDate ? format(newTripStartDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar 
                                                mode="single"
                                                selected={newTripStartDate} 
                                                onSelect={(date) => {
                                                    setNewTripStartDate(date);
                                                    setStartCalOpen(false);
                                                }}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                 <div className="space-y-2">
                                    <Label><Translatable text="End Date"/></Label>
                                    <Popover open={isEndCalOpen} onOpenChange={setEndCalOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {newTripEndDate ? format(newTripEndDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar 
                                                mode="single"
                                                selected={newTripEndDate} 
                                                onSelect={(date) => {
                                                    setNewTripEndDate(date);
                                                    setEndCalOpen(false);
                                                }} 
                                                disabled={(date) => (newTripStartDate && date <= newTripStartDate) || date < new Date(new Date().setHours(0, 0, 0, 0))} 
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                <Button onClick={handleCreateTrip}><Translatable text="Create Trip"/></Button>
                            </DialogFooter>
                        </DialogContent>
                   </Dialog>
                    {tripsLoading && <p>Loading trips...</p>}
                    {trips && trips.map(trip => (
                        <div key={trip.id}
                            onClick={() => setSelectedTrip(trip)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors border-2 ${selectedTrip?.id === trip.id ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-muted/50 border-transparent'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{trip.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(trip.startDate.seconds * 1000), 'd MMM yyyy')} - {format(new Date(trip.endDate.seconds * 1000), 'd MMM yyyy')}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {trips && trips.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4"><Translatable text="You have no saved trips. Create one to get started!"/></p>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
                {selectedTrip ? (
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{selectedTrip.name}</h1>
                        <p className="text-muted-foreground text-lg">
                           {format(new Date(selectedTrip.startDate.seconds * 1000), 'PPP')} to {format(new Date(selectedTrip.endDate.seconds * 1000), 'PPP')}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {renderItemList("Provinces", <Map className="h-6 w-6 text-primary"/>, selectedTrip.provinceIds, provinces, 'province')}
                            {renderItemList("Towns", <MapPin className="h-6 w-6 text-primary"/>, selectedTrip.townIds, towns, 'town')}
                            {renderItemList("Sights", <Mountain className="h-6 w-6 text-primary"/>, selectedTrip.sightIds, sights, 'sight')}
                            {renderItemList("Routes", <RouteIcon className="h-6 w-6 text-primary"/>, selectedTrip.routeIds, routes, 'route')}
                        </div>
                         <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                <Bed className="h-6 w-6 text-primary"/>
                                <CardTitle className="text-xl font-headline"><Translatable text="Accommodation"/></CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    <Translatable text="Accommodation booking feature is coming soon."/>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline"><Translatable text="Plan Your Adventure"/></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground"><Translatable text="Select a trip from the list or create a new one to start planning."/></p>
                        </CardContent>
                    </Card>
                )}
            </div>
       </div>

        {currentDialogData && (
             <AddToTripDialog 
                isOpen={dialogState.isOpen}
                onOpenChange={(isOpen) => setDialogState({ isOpen, type: null })}
                title={currentDialogData.title}
                items={currentDialogData.items}
                selectedItems={(selectedTrip?.[currentDialogData.key] as string[]) || []}
                onSave={(selectedSlugs) => handleSaveChanges(currentDialogData.key, selectedSlugs)}
            />
        )}
    </div>
  );
}
