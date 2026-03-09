'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Translatable } from '../translatable';
import { updateListingStatus, deleteListing } from '@/firebase/firestore/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface Listing {
  id: string;
  name: string;
  approved: boolean;
  createdAt?: { seconds: number };
  ownerUid: string;
  contactEmail: string;
  [key: string]: any;
}

export function AdminListingsPanel({ collectionName }: { collectionName: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const listingsQuery = useMemoFirebase(() => collection(firestore, collectionName), [firestore, collectionName]);
  const { data: listings, isLoading } = useCollection<Listing>(listingsQuery);

  const handleApprove = (id: string) => {
    updateListingStatus(firestore, collectionName, id, true);
    toast({ title: "Listing Approved" });
  };
  
  const handleUnapprove = (id: string) => {
    updateListingStatus(firestore, collectionName, id, false);
    toast({ title: "Listing Un-approved" });
  };

  const handleDelete = (id: string) => {
    deleteListing(firestore, collectionName, id);
    toast({ variant: "destructive", title: "Listing Deleted" });
  };
  
  const pendingListings = listings?.filter(l => !l.approved).sort((a,b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)) || [];
  const approvedListings = listings?.filter(l => l.approved).sort((a,b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)) || [];

  if (isLoading) return <p>Loading listings...</p>;
  
  return (
    <div className="space-y-8 mt-4">
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Pending Approval ({pendingListings.length})</h2>
        {pendingListings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingListings.map(listing => (
              <Card key={listing.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{listing.name}</CardTitle>
                  <CardDescription>
                    Submitted by: {listing.contactEmail} on {listing.createdAt ? format(new Date(listing.createdAt.seconds * 1000), 'd MMM yyyy') : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(listing.id)}>Approve</Button>
                    <Button variant="destructive" onClick={() => handleDelete(listing.id)}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : <p className="text-muted-foreground">No pending listings.</p>}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Approved Listings ({approvedListings.length})</h2>
        {approvedListings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {approvedListings.map(listing => (
              <Card key={listing.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{listing.name}</CardTitle>
                  <CardDescription>
                    Submitted by: {listing.contactEmail} on {listing.createdAt ? format(new Date(listing.createdAt.seconds * 1000), 'd MMM yyyy') : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={() => handleUnapprove(listing.id)}>Un-approve</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(listing.id)}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : <p className="text-muted-foreground">No approved listings.</p>}
      </div>
    </div>
  );
}
