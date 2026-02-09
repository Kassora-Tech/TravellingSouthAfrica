// @ts-nocheck
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MapPin, Mountain, Bed, Route as RouteIcon, Trash2, Download, Sparkles, Car, ArrowRightLeft, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Translatable } from '../translatable';
import { format } from 'date-fns';
import { AddToTripDialog } from './add-to-trip-dialog';
import Link from 'next/link';

import { provinces } from '@/lib/data/provinces';
import { towns } from '@/lib/data/towns';
import { routes } from '@/lib/data/routes';
import { sights } from '@/lib/data/sights';

import { createTrip, updateTripItems, updateTripRoutes, type TripRoute, updateTripTowns, type TripTown } from '@/firebase/firestore/trips';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError, errorEmitter } from '@/firebase';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';


interface Trip {
  name: string;
  towns?: TripTown[];
  sightIds?: string[];
  routeIds?: string[];
  tripRoutes?: TripRoute[];
  accommodationIds?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
}

type DialogState = {
  isOpen: boolean;
  type: 'town' | 'sight' | 'route' | null;
}

const findTownSlug = (name: string, allTowns: { slug: string, name: string }[]) => {
    const cleanName = name.split('(')[0].trim().toLowerCase();
    const town = allTowns.find(t => t.name.toLowerCase().startsWith(cleanName));
    return town?.slug;
};

const SummaryRoute = ({ routeName, townNames, onSelectRoute }: { routeName: string, townNames: string[], onSelectRoute: (slug: string) => void }) => {
    const routeSlug = `${routeName.toLowerCase()}-route`;
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Button variant="link" className="p-0 h-auto font-bold text-sm" onClick={() => onSelectRoute(routeSlug)}>
                {routeName}
            </Button>
            <span className="text-muted-foreground">-</span>
            <div className="flex flex-wrap gap-x-2">
                {townNames.map((townName, index) => {
                    const townSlug = findTownSlug(townName, towns);
                    return (
                        <React.Fragment key={townName}>
                            {townSlug ? (
                                <Link href={`/towns/${townSlug}`} className="underline hover:text-primary text-sm" target="_blank">
                                    <Translatable text={townName} />
                                </Link>
                            ) : (
                                <span className="text-sm"><Translatable text={townName} /></span>
                            )}
                            {index < townNames.length - 1 && ','}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


const NationalRoadsCard = ({ onSelectRoute }: { onSelectRoute: (slug: string) => void }) => {
    const nationalRoutesList = ['N1', 'N10', 'N11', 'N12', 'N14', 'N17', 'N18', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9'];
    
    const summaryRoutesData = [
        { name: 'N1', towns: ['Polokwane', 'Pretoria', 'Johannesburg', 'Bloemfontein', 'Cape Town'] },
        { name: 'N2', towns: ['Durban', 'Mthatha', 'East London', 'Port Elizabeth', 'Cape Town'] },
        { name: 'N3', towns: ['Johannesburg', 'Pietermaritzburg', 'Durban'] },
        { name: 'N4', towns: ['Pretoria', 'Mbombela'] },
        { name: 'N5', towns: ['Harrismith'] },
        { name: 'N6', towns: ['East London', 'Bloemfontein'] },
        { name: 'N7', towns: ['Cape Town', 'Springbok', 'Vioolsdrif'] },
        { name: 'N8', towns: ['Groblershoop', 'Kimberley', 'Bloemfontein', 'Ladybrand'] },
        { name: 'N9', towns: ['George', 'Graaff-Reinet', 'Middelburg', 'Colesberg'] },
        { name: 'N10', towns: ['Port Elizabeth', 'Middelburg', 'Upington', 'Nakop border control'] },
        { name: 'N11', towns: ['Groblersbrug', 'Mokopane', 'Middelburg', 'Ermelo', 'Newcastle', 'Ladysmith'] },
        { name: 'N12', towns: ['George', 'Oudtshoorn', 'Victoria West', 'Kimberley', 'Potchefstroom', 'Johannesburg', 'eMalahleni (Witbank)'] },
        { name: 'N14', towns: ['Springbok', 'Upington', 'Krugersdorp', 'Pretoria'] },
        { name: 'N17', towns: ['Johannesburg', 'Springs', 'Evander', 'Ermelo', 'Swaziland border'] },
        { name: 'N18', towns: ['Warrenton', 'Vryburg', 'Mahikeng', 'Miga'] },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl"><Translatable text="National Roads – Quick Route Planning" /></CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>This shows you the routes you can follow on the country's 15 national roads</p>

                <p className="font-bold">South African National Roads:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {nationalRoutesList.sort().map(r => (
                        <Button key={r} variant="link" className="p-0 h-auto" onClick={() => onSelectRoute(`${r.toLowerCase()}-route`)}>
                            {r}
                        </Button>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t font-mono text-xs bg-muted/50 p-4 rounded-lg">
                    <p className="font-sans font-bold text-sm mb-2 text-foreground">N1 Detailed route</p>
                    <div className="font-sans whitespace-pre-wrap">
                        <div className="grid grid-cols-3 font-bold border-b pb-1 mb-1">
                            <span>Town</span>
                            <span className="text-right">Distance</span>
                            <span className="text-right">Cumulative</span>
                        </div>
                        <div className="grid grid-cols-3"><span>Beitbridge</span> <span className="text-right">-</span> <span className="text-right">-</span></div>
                        <div className="grid grid-cols-3"><span>Musina</span> <span className="text-right">19</span> <span className="text-right">19</span></div>
                        <div className="grid grid-cols-3"><span>Polokwane</span> <span className="text-right">201</span> <span className="text-right">220</span></div>
                        <div className="grid grid-cols-3"><span>Pretoria</span> <span className="text-right">281</span> <span className="text-right">501</span></div>
                        <div className="grid grid-cols-3"><span>Centurion</span> <span className="text-right">26</span> <span className="text-right">527</span></div>
                        <div className="grid grid-cols-3"><span>Midrand</span> <span className="text-right">19</span> <span className="text-right">546</span></div>
                        <div className="grid grid-cols-3"><span>Johannesburg</span> <span className="text-right">27</span> <span className="text-right">573</span></div>
                        <div className="grid grid-cols-3"><span>Lenasia</span> <span className="text-right">35</span> <span className="text-right">608</span></div>
                        <div className="grid grid-cols-3"><span>Vanderbijlpark</span> <span className="text-right">53</span> <span className="text-right">661</span></div>
                        <div className="grid grid-cols-3"><span>Vaal River</span> <span className="text-right">10</span> <span className="text-right">671</span></div>
                        <div className="grid grid-cols-3"><span>Kroonstad</span> <span className="text-right">121</span> <span className="text-right">792</span></div>
                        <div className="grid grid-cols-3"><span>Ventersburg</span> <span className="text-right">52</span> <span className="text-right">844</span></div>
                        <div className="grid grid-cols-3"><span>Bloemfontein</span> <span className="text-right">116</span> <span className="text-right">960</span></div>
                        <div className="grid grid-cols-3"><span>Colesberg</span> <span className="text-right">233</span> <span className="text-right">1193</span></div>
                        <div className="grid grid-cols-3"><span>Hanover</span> <span className="text-right">75</span> <span className="text-right">1268</span></div>
                        <div className="grid grid-cols-3"><span>Beaufort West</span> <span className="text-right">241</span> <span className="text-right">1509</span></div>
                        <div className="grid grid-cols-3"><span>Laingsburg</span> <span className="text-right">199</span> <span className="text-right">1708</span></div>
                        <div className="grid grid-cols-3"><span>Matjiesfontein</span> <span className="text-right">29</span> <span className="text-right">1737</span></div>
                        <div className="grid grid-cols-3"><span>Touws River</span> <span className="text-right">56</span> <span className="text-right">1793</span></div>
                        <div className="grid grid-cols-3"><span>De Doorns</span> <span className="text-right">44</span> <span className="text-right">1837</span></div>
                        <div className="grid grid-cols-3"><span>Worcester</span> <span className="text-right">33</span> <span className="text-right">1870</span></div>
                        <div className="grid grid-cols-3"><span>Paarl</span> <span className="text-right">59</span> <span className="text-right">1929</span></div>
                        <div className="grid grid-cols-3"><span>Cape Town</span> <span className="text-right">62</span> <span className="text-right">1991</span></div>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                    <p className="font-bold">Summary routes</p>
                    <p>Click on route number (eg N1) for a detailed listing or on a town for details about the town.</p>
                    <div className="space-y-2 mt-2">
                        {summaryRoutesData.map(route => (
                            <SummaryRoute key={route.name} routeName={route.name} townNames={route.towns} onSelectRoute={onSelectRoute} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


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
  
  const [createMode, setCreateMode] = useState<'custom' | 'route'>('custom');
  const [newTripName, setNewTripName] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [reverseRoute, setReverseRoute] = useState(false);

  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, type: null });

  const [editingNotes, setEditingNotes] = useState<Record<string, string | undefined>>({});

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
        const sortedTrips = [...trips].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setSelectedTrip(sortedTrips.length > 0 ? sortedTrips[0] : null);
    }
  }, [trips, searchParams, selectedTrip]);


  const handleCreateTrip = () => {
    if (!newTripName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a name for your trip.",
      });
      return;
    }

    let initialTowns: TripTown[] = [];
    let initialRoutes: string[] = [];
    if (createMode === 'route' && selectedRoute) {
        const routeData = routes.find(r => r.slug === selectedRoute);
        if (routeData) {
            let townSlugs = routeData.townSlugs;
            if (reverseRoute) {
                townSlugs = [...townSlugs].reverse();
            }
            initialTowns = townSlugs.map(slug => ({ slug, notes: '' }));
            initialRoutes.push(routeData.slug);
        }
    }

    createTrip(firestore, {
      name: newTripName,
      userId: user.uid,
      towns: initialTowns,
      routeIds: initialRoutes,
    });
    setCreateTripOpen(false);
    setNewTripName('');
    setSelectedRoute('');
    setReverseRoute(false);
    toast({
        title: "Trip Created!",
        description: `Your trip "${newTripName}" has been created.`,
    });
  };

  const handleSelectRouteForCreation = (routeSlug: string) => {
    setCreateMode('route');
    setSelectedRoute(routeSlug);
    setNewTripName(routes.find(r => r.slug === routeSlug)?.name || '');
    setCreateTripOpen(true);
  };

  const handleTownsSave = (selectedSlugs: string[]) => {
    if (!selectedTrip) return;
    const currentTowns = selectedTrip.towns || [];
    const newTowns: TripTown[] = selectedSlugs.map(slug => {
        return currentTowns.find(t => t.slug === slug) || { slug, notes: '' };
    });
    
    updateTripTowns(firestore, user.uid, selectedTrip.id, newTowns);
    setSelectedTrip(prev => prev ? { ...prev, towns: newTowns } : null);

    toast({
        title: "Itinerary Updated!",
        description: `Towns in "${selectedTrip.name}" have been updated.`,
    });
  };


  const handleItemsSave = (itemType: 'sightIds' | 'routeIds', selectedSlugs: string[]) => {
    if (!selectedTrip) return;

    if (itemType === 'routeIds') {
        const newTripRoutes = selectedSlugs.map(slug => {
            const existing = selectedTrip.tripRoutes?.find(tr => tr.routeSlug === slug);
            if (existing) return existing;
            const routeData = routes.find(r => r.slug === slug);
            return {
                routeSlug: slug,
                includedRoads: routeData?.roads || [],
            };
        });
        updateTripRoutes(firestore, user.uid, selectedTrip.id, newTripRoutes);
        setSelectedTrip(prev => prev ? ({ ...prev, routeIds: selectedSlugs, tripRoutes: newTripRoutes }) : null);
    } else {
        updateTripItems(firestore, user.uid, selectedTrip.id, itemType, selectedSlugs);
        setSelectedTrip(prev => prev ? ({ ...prev, [itemType]: selectedSlugs }) : null);
    }
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

  const handleRemoveRoad = (routeSlug: string, road: string) => {
      if (!selectedTrip || !selectedTrip.tripRoutes) return;
  
      const newTripRoutes = selectedTrip.tripRoutes.map(r => {
          if (r.routeSlug === routeSlug) {
              return {
                  ...r,
                  includedRoads: r.includedRoads.filter(roadName => roadName !== road)
              };
          }
          return r;
      });
  
      updateTripRoutes(firestore, user.uid, selectedTrip.id, newTripRoutes);
      setSelectedTrip(prev => prev ? ({...prev, tripRoutes: newTripRoutes}) : null);
      toast({
          title: "Road removed",
          description: `${road} has been removed from your itinerary.`
      });
  };

  const handleReverseRoads = (routeSlug: string) => {
    if (!selectedTrip || !selectedTrip.tripRoutes) return;

    const newTripRoutes = selectedTrip.tripRoutes.map(r => {
        if (r.routeSlug === routeSlug) {
            return {
                ...r,
                includedRoads: [...r.includedRoads].reverse()
            };
        }
        return r;
    });

    updateTripRoutes(firestore, user.uid, selectedTrip.id, newTripRoutes);
    setSelectedTrip(prev => prev ? ({...prev, tripRoutes: newTripRoutes}) : null);
    toast({
        title: "Route Reversed",
        description: `The order of roads for ${routes.find(r => r.slug === routeSlug)?.name} has been reversed.`
    });
  };

  const handleDeleteTown = (townSlug: string) => {
    if (!selectedTrip || !selectedTrip.towns) return;

    const newTowns = selectedTrip.towns.filter(t => t.slug !== townSlug);
    updateTripTowns(firestore, user.uid, selectedTrip.id, newTowns);
    setSelectedTrip(prev => prev ? { ...prev, towns: newTowns } : null);
    toast({
        title: "Town Removed",
        description: `${towns.find(t => t.slug === townSlug)?.name} has been removed from your itinerary.`
    });
  }

  const handleReorderTown = (index: number, direction: 'up' | 'down') => {
    if (!selectedTrip || !selectedTrip.towns) return;
    
    const newTowns = [...selectedTrip.towns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newTowns.length) return;

    const [movedItem] = newTowns.splice(index, 1);
    newTowns.splice(targetIndex, 0, movedItem);
    
    updateTripTowns(firestore, user.uid, selectedTrip.id, newTowns);
    setSelectedTrip(prev => prev ? { ...prev, towns: newTowns } : null);
  }

  const handleSaveNotes = (townSlug: string) => {
    if (!selectedTrip || !selectedTrip.towns) return;

    const newTowns = selectedTrip.towns.map(t => 
      t.slug === townSlug ? { ...t, notes: editingNotes[townSlug] } : t
    );

    updateTripTowns(firestore, user.uid, selectedTrip.id, newTowns);
    setSelectedTrip(prev => prev ? { ...prev, towns: newTowns } : null);

    setEditingNotes(prev => {
        const newEditing = {...prev};
        delete newEditing[townSlug];
        return newEditing;
    })
    
    toast({
        title: "Notes Saved",
        description: `Your notes for ${towns.find(t => t.slug === townSlug)?.name} have been saved.`
    });
  }
  
  const handleReverseTrip = () => {
    if (!selectedTrip || !selectedTrip.towns) return;
    const reversedTowns = [...selectedTrip.towns].reverse();
    updateTripTowns(firestore, user.uid, selectedTrip.id, reversedTowns);
    setSelectedTrip(prev => prev ? { ...prev, towns: reversedTowns } : null);
    toast({
        title: "Trip Reversed",
        description: "The sequence of towns in your trip has been reversed."
    });
  }

  const filteredItems = useMemo(() => {
    return { towns, sights, routes };
  }, []);

  const dataMap = useMemo(() => ({
    town: { title: "Add Towns", items: filteredItems.towns, provinces: provinces },
    sight: { title: "Add Sights", items: filteredItems.sights, key: 'sightIds' as const },
    route: { title: "Add Routes", items: filteredItems.routes, key: 'routeIds' as const },
  }), [filteredItems]);

  const currentDialogData = dialogState.type ? dataMap[dialogState.type] : null;

  const renderSightsOrRoutesList = (
    title: string,
    icon: React.ReactNode,
    itemIds: string[] | undefined,
    allItems: any[],
    type: 'sight' | 'route'
  ) => {
      const items = itemIds?.map(id => allItems.find(p => p.slug === id)).filter(Boolean);
  
      if (type === 'route') {
        const tripRoutes = selectedTrip?.tripRoutes?.filter(tr => selectedTrip.routeIds?.includes(tr.routeSlug)) || [];
        const routeItems = tripRoutes.map(tr => {
            const routeData = allItems.find(r => r.slug === tr.routeSlug);
            return routeData ? {
                ...routeData,
                includedRoads: tr.includedRoads,
            } : null;
        }).filter(Boolean);

        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-xl font-headline"><Translatable text={title}/></CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDialogState({ isOpen: true, type: type })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent>
                {routeItems && routeItems.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {routeItems.map(item => (
                            item && <AccordionItem value={item.slug} key={item.slug}>
                                <AccordionTrigger><Translatable text={item.name}/></AccordionTrigger>
                                <AccordionContent>
                                    {item.includedRoads.length > 0 ? (
                                        <>
                                            <div className="flex justify-end -mb-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleReverseRoads(item.slug)}>
                                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                                    <Translatable text="Reverse Route"/>
                                                </Button>
                                            </div>
                                            <ul className="space-y-2 pt-2">
                                                {item.includedRoads.map((road: string) => (
                                                    <li key={road} className="flex justify-between items-center text-sm text-muted-foreground pl-2">
                                                        <span>{road}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveRoad(item.slug, road)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground pt-2 pl-2"><Translatable text="No roads in this route."/></p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-sm text-muted-foreground"><Translatable text={`No ${title.toLowerCase()} added yet.`} /></p>
                )}
            </CardContent>
        </Card>
        );
      }
  
      return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-xl font-headline"><Translatable text={title}/></CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDialogState({ isOpen: true, type: type })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent>
                {items && items.length > 0 ? (
                    <ul className="space-y-3">
                        {items.map(item => (
                            <li key={item.slug} className="flex justify-between items-center">
                                <span className="text-muted-foreground"><Translatable text={item.name}/></span>
                                <Button asChild size="sm" variant="outline" className="h-auto px-2 py-1 text-xs">
                                    <Link href={`/sights/${item.slug}`} target="_blank">
                                        <ExternalLink className="mr-1 h-3 w-3" />
                                        <Translatable text="View" />
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground"><Translatable text={`No ${title.toLowerCase()} added yet.`} /></p>
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
                            <Tabs value={createMode} onValueChange={(value) => setCreateMode(value as 'custom' | 'route')} className="pt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="custom"><Translatable text="Custom Trip" /></TabsTrigger>
                                    <TabsTrigger value="route"><Translatable text="From Route" /></TabsTrigger>
                                </TabsList>
                                <div className="py-6 px-1 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="trip-name"><Translatable text="Trip Name"/></Label>
                                        <Input id="trip-name" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} placeholder="e.g., Garden Route Adventure"/>
                                    </div>
                                    <TabsContent value="route" className="space-y-4 m-0">
                                        <div className="space-y-2">
                                            <Label><Translatable text="Select a National Road" /></Label>
                                            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a route..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {routes.filter(r => r.name.startsWith('N') || r.name.startsWith('R')).sort((a,b) => a.name.localeCompare(b.name)).map(r => <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="reverse-route" checked={reverseRoute} onCheckedChange={(checked) => setReverseRoute(checked as boolean)} />
                                            <Label htmlFor="reverse-route"><Translatable text="Reverse order of towns"/></Label>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
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
                                    {trip.createdAt && (
                                        <p className="text-sm text-muted-foreground">
                                            Created on {format(new Date(trip.createdAt.seconds * 1000), 'd MMM yyyy')}
                                        </p>
                                    )}
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
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{selectedTrip.name}</h1>
                            <div className="flex gap-2">
                                <Button onClick={handleReverseTrip} variant="outline" size="sm">
                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                    <Translatable text="Reverse Trip" />
                                </Button>
                                <Button onClick={handleDownloadPdf} variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    <Translatable text="Download PDF" />
                                </Button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-6 w-6 text-primary"/>
                                        <CardTitle className="text-xl font-headline"><Translatable text="Towns" /></CardTitle>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setDialogState({ isOpen: true, type: 'town' })}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {(selectedTrip.towns?.length ?? 0) > 0 ? (
                                        <Accordion type="multiple" className="w-full">
                                            {selectedTrip.towns?.map((townData, index) => {
                                                const town = towns.find(t => t.slug === townData.slug);
                                                if (!town) return null;
                                                const isEditing = editingNotes.hasOwnProperty(townData.slug);
                                                return (
                                                    <AccordionItem value={town.slug} key={town.slug}>
                                                        <div className="flex items-center group">
                                                            <div className="flex flex-col py-1">
                                                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleReorderTown(index, 'up')} disabled={index === 0}>
                                                                    <ArrowUp className="h-3 w-3" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleReorderTown(index, 'down')} disabled={index === selectedTrip.towns!.length - 1}>
                                                                    <ArrowDown className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <span className="font-medium flex-grow pl-2"><Translatable text={town.name} /></span>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteTown(town.slug)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                            <AccordionTrigger className="w-8 hover:no-underline" />
                                                        </div>
                                                        <AccordionContent>
                                                            <div className="pl-8 space-y-4">
                                                                <div>
                                                                    <Label htmlFor={`notes-${town.slug}`}><Translatable text="My Notes" /></Label>
                                                                    <Textarea 
                                                                        id={`notes-${town.slug}`} 
                                                                        value={isEditing ? editingNotes[townData.slug] : townData.notes || ''}
                                                                        onChange={(e) => setEditingNotes(prev => ({...prev, [townData.slug]: e.target.value}))}
                                                                        placeholder="Add your personal notes for this town..."
                                                                        className="mt-1"
                                                                    />
                                                                    {isEditing && (
                                                                        <Button size="sm" className="mt-2" onClick={() => handleSaveNotes(townData.slug)}><Translatable text="Save Notes" /></Button>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button asChild variant="outline" size="sm"><Link href={`/towns/${town.slug}`} target="_blank">View Details</Link></Button>
                                                                    <Button asChild variant="outline" size="sm"><Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(town.name + ", " + (provinces.find(p => p.slug === town.provinceSlug)?.name || 'South Africa'))}`} target="_blank">Map</Link></Button>
                                                                </div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )
                                            })}
                                        </Accordion>
                                    ) : (
                                        <p className="text-sm text-muted-foreground"><Translatable text="No towns added yet."/></p>
                                    )}
                                </CardContent>
                            </Card>

                            {renderSightsOrRoutesList("Sights", <Mountain className="h-6 w-6 text-primary"/>, selectedTrip.sightIds, sights, 'sight')}
                            {renderSightsOrRoutesList("Routes", <RouteIcon className="h-6 w-6 text-primary"/>, selectedTrip.routeIds, routes, 'route')}
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
                                    <p className="text-sm text-muted-foreground">
                                        <Translatable text="This feature is coming soon."/>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <NationalRoadsCard onSelectRoute={handleSelectRouteForCreation} />
                        <Card className="flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline"><Translatable text="Plan Your Adventure"/></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground"><Translatable text="Select a trip from the list or create a new one to start planning."/></p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
       </div>

        {currentDialogData && dialogState.type === 'town' && (
             <AddToTripDialog 
                isOpen={dialogState.isOpen}
                onOpenChange={(isOpen) => setDialogState({ isOpen, type: null })}
                title={currentDialogData.title}
                items={currentDialogData.items}
                provinces={currentDialogData.provinces}
                selectedItems={(selectedTrip?.towns?.map(t => t.slug)) || []}
                onSave={(selectedSlugs) => handleTownsSave(selectedSlugs)}
            />
        )}
        {currentDialogData && (dialogState.type === 'sight' || dialogState.type === 'route') && (
             <AddToTripDialog 
                isOpen={dialogState.isOpen}
                onOpenChange={(isOpen) => setDialogState({ isOpen, type: null })}
                title={currentDialogData.title}
                items={currentDialogData.items}
                selectedItems={(selectedTrip?.[currentDialogData.key] as string[]) || []}
                onSave={(selectedSlugs) => handleItemsSave(currentDialogData.key, selectedSlugs)}
            />
        )}
    </div>
  );
}
