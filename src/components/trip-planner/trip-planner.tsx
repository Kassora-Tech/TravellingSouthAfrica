'use client';

import { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Map, MapPin, Mountain, Bed, Route as RouteIcon, Trash2, Download, Sparkles, Car } from 'lucide-react';
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
import { CalendarIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface Trip {
  name: string;
  startDate: { seconds: number; nanoseconds: number };
  endDate: { seconds: number; nanoseconds: number };
  provinceIds?: string[];
  townIds?: string[];
  sightIds?: string[];
  routeIds?: string[];
  accommodationIds?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
}

type DialogState = {
  isOpen: boolean;
  type: 'province' | 'town' | 'sight' | 'route' | null;
}

export function TripPlanner({ user }: { user: User }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

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
    if (!trips) return;
    
    const tripIdFromQuery = searchParams.get('tripId');
    if (tripIdFromQuery) {
        const tripFromQuery = trips.find(t => t.id === tripIdFromQuery);
        if (tripFromQuery) {
            setSelectedTrip(tripFromQuery);
            return;
        }
    }

    if (!selectedTrip || !trips.find(t => t.id === selectedTrip.id)) {
        // Sort trips by creation date, newest first
        const sortedTrips = [...trips].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setSelectedTrip(sortedTrips.length > 0 ? sortedTrips[0] : null);
    }
  }, [trips, searchParams, selectedTrip]);


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

  const handleDeleteTrip = (tripId: string) => {
    
    const tripDocRef = doc(firestore, `users/${user.uid}/trips`, tripId);
    
    deleteDoc(tripDocRef)
      .then(() => {
        toast({
            title: "Trip Deleted",
            description: "Your trip has been successfully deleted.",
        });
      })
      .catch(async (serverError) => {
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
    });
  }

  const handleDownloadPdf = () => {
    const input = document.getElementById('itinerary-to-print');
    if (!input || !selectedTrip) {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not find the itinerary content to download.",
        });
        return;
    }

    const buttons = Array.from(input.querySelectorAll('button')) as HTMLElement[];
    buttons.forEach(btn => btn.style.visibility = 'hidden');

    const bgColor = window.getComputedStyle(document.body).getPropertyValue('background-color');

    html2canvas(input, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: bgColor 
    }).then(canvas => {
      buttons.forEach(btn => btn.style.visibility = 'visible');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = imgWidth / imgHeight;

      let finalWidth = pdfWidth - 20; // with margin
      let finalHeight = finalWidth / ratio;
      
      if (finalHeight > pdfHeight - 20) {
          finalHeight = pdfHeight - 20;
          finalWidth = finalHeight * ratio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 10;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`${selectedTrip.name}.pdf`);
      
      toast({
        title: "Download Started",
        description: `Your itinerary "${selectedTrip.name}.pdf" is being downloaded.`,
      });
    }).catch(err => {
      buttons.forEach(btn => btn.style.visibility = 'visible');
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "An error occurred while generating the PDF.",
      });
      console.error(err);
    });
  };

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

  const renderItemList = (
    title: string,
    icon: React.ReactNode,
    itemIds: string[] | undefined,
    allItems: any[], // Using any for simplicity as it can be provinces, towns, etc.
    type: 'province' | 'town' | 'sight' | 'route'
  ) => {
      const items = itemIds?.map(id => allItems.find(p => p.slug === id)).filter(Boolean);
      const isAddDisabled = type !== 'province' && (!selectedTrip?.provinceIds || selectedTrip.provinceIds.length === 0);
  
      const handleDirectionsClick = (item: any) => {
          let destination = '';
          if (type === 'province') {
              destination = `${item.name}, South Africa`;
          } else if (type === 'town') {
              const province = provinces.find(p => p.slug === item.provinceSlug);
              destination = `${item.name}, ${province?.name || ''}, South Africa`;
          } else if (type === 'sight') {
              const province = provinces.find(p => p.slug === item.provinceSlug);
              destination = `${item.name}, ${item.location}, ${province?.name || ''}, South Africa`;
          } else if (type === 'route') {
              const firstTown = towns.find(t => t.slug === item.townSlugs?.[0]);
              const province = provinces.find(p => p.slug === firstTown?.provinceSlug);
              destination = `${item.name}, ${firstTown?.name || ''}, ${province?.name || ''}, South Africa`;
          }
          
          if (destination) {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
              window.open(url, '_blank');
          }
      };
  
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
                    <ul className="space-y-3">
                        {items.map(item => (
                            <li key={item.slug} className="flex justify-between items-center">
                                <span className="text-muted-foreground"><Translatable text={item.name}/></span>
                                <Button
                                    size="sm"
                                    className="bg-accent text-primary-foreground hover:bg-accent/90 h-auto px-2 py-1 text-xs"
                                    onClick={() => handleDirectionsClick(item)}
                                >
                                    <Car className="mr-1 h-3 w-3" />
                                    <Translatable text="Directions" />
                                </Button>
                            </li>
                        ))}
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
                   <Dialog open={isCreateTripOpen} onOpenChange={setCreateTripOpen}>
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
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newTripStartDate ? format(newTripStartDate, "dd/MM/yyyy") : <span>Pick a date</span>}
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
                                                onClose={() => setStartCalOpen(false)}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                 <div className="space-y-2">
                                    <Label><Translatable text="End Date"/></Label>
                                    <Popover open={isEndCalOpen} onOpenChange={setEndCalOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newTripEndDate ? format(newTripEndDate, "dd/MM/yyyy") : <span>Pick a date</span>}
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
                                                onClose={() => setEndCalOpen(false)}
                                                disabled={(date) => (newTripStartDate && date <= newTripStartDate) || date < new Date(new Date().setHours(0, 0, 0, 0))} 
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
                    <div className="space-y-6" id="itinerary-to-print">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{selectedTrip.name}</h1>
                            <Button onClick={handleDownloadPdf} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                <Translatable text="Download PDF" />
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-lg">
                           {format(new Date(selectedTrip.startDate.seconds * 1000), 'PPP')} to {format(new Date(selectedTrip.endDate.seconds * 1000), 'PPP')}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {renderItemList("Provinces", <Map className="h-6 w-6 text-primary"/>, selectedTrip.provinceIds, provinces, 'province')}
                            {renderItemList("Towns", <MapPin className="h-6 w-6 text-primary"/>, selectedTrip.townIds, towns, 'town')}
                            {renderItemList("Sights", <Mountain className="h-6 w-6 text-primary"/>, selectedTrip.sightIds, sights, 'sight')}
                            {renderItemList("Routes", <RouteIcon className="h-6 w-6 text-primary"/>, selectedTrip.routeIds, routes, 'route')}
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
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-6 w-6 text-primary"/>
                                        <CardTitle className="text-xl font-headline"><Translatable text="Extras"/></CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                                        {['Adventure', 'Airlines', 'Attractions', 'Car Hire', 'General', 'Hotels', 'Restaurants', 'Technology', 'Travel Agents', 'Vehicles'].map(item => (
                                            <li key={item}>
                                                <Translatable text={item}/>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
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
