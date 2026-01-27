'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Translatable } from '../translatable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { provinces } from '@/lib/data/provinces';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError, errorEmitter } from '@/firebase';
import { Eye, MapPin, Mountain, Route, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '../ui/badge';

interface Trip {
  name: string;
  startDate?: { seconds: number; nanoseconds: number };
  endDate?: { seconds: number; nanoseconds: number };
  provinceIds?: string[];
  townIds?: string[];
  sightIds?: string[];
  routeIds?: string[];
  createdAt: { seconds: number; nanoseconds: number };
}

export function MyItineraries({ user }: { user: User }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const tripsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/trips`);
  }, [firestore, user]);

  const { data: trips, isLoading } = useCollection<Trip>(tripsQuery);

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

  if (isLoading) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline"><Translatable text="My Itineraries" /></h2>
            <Card>
                <CardContent className="p-6">
                    <p><Translatable text="Loading your itineraries..." /></p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4"><Translatable text="My Itineraries" /></h2>
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        <Translatable text="You haven't planned any trips yet." />
                    </p>
                    <Button asChild>
                        <Link href="/plan-your-trip">
                            <Translatable text="Start Planning Your First Trip" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  const getProvinceName = (provinceId: string) => {
      const province = provinces.find(p => p.slug === provinceId);
      return province?.name || provinceId;
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline"><Translatable text="My Itineraries" /></h2>
        <div className="grid gap-6">
            {trips.map((trip) => (
                <Card key={trip.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <CardTitle className="font-headline text-2xl text-primary">{trip.name}</CardTitle>
                                {trip.createdAt && (
                                <CardDescription className="mt-1">
                                    <Translatable text={`Created on ${format(new Date(trip.createdAt.seconds * 1000), 'd MMM yyyy')}`} />
                                </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center flex-shrink-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <Link href={`/plan-your-trip?tripId=${trip.id}`}>
                                        <Eye />
                                        <span className="sr-only">View</span>
                                    </Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                      <Trash2 />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle><Translatable text="Are you absolutely sure?" /></AlertDialogTitle>
                                      <AlertDialogDescription>
                                        <Translatable text="This action cannot be undone. This will permanently delete your itinerary." />
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel><Translatable text="Cancel" /></AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTrip(trip.id)}><Translatable text="Delete" /></AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="text-sm text-muted-foreground space-y-3">
                             {trip.provinceIds && trip.provinceIds.length > 0 && (
                                <div>
                                    <Badge variant="secondary"><Translatable text={getProvinceName(trip.provinceIds[0])} /></Badge>
                                    {trip.provinceIds.length > 1 && <Badge variant="secondary" className="ml-1">+{trip.provinceIds.length - 1}</Badge>}
                                </div>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                                <span className="flex items-center"><MapPin className="mr-1.5 h-4 w-4" /><strong>{trip.townIds?.length || 0}</strong>&nbsp;<Translatable text="Towns" /></span>
                                <span className="flex items-center"><Mountain className="mr-1.5 h-4 w-4" /><strong>{trip.sightIds?.length || 0}</strong>&nbsp;<Translatable text="Sights" /></span>
                                <span className="flex items-center"><Route className="mr-1.5 h-4 w-4" /><strong>{trip.routeIds?.length || 0}</strong>&nbsp;<Translatable text="Routes" /></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  )
}
