'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { updateListingStatus, deleteListing } from '@/firebase/firestore/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Mail, Phone, Globe, MapPin, Tag, User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Listing {
  id: string;
  name: string;
  approved: boolean;
  createdAt?: { seconds: number };
  ownerUid: string;
  ownerEmail?: string;
  contactEmail: string;
  contactPhone?: string;
  description?: string;
  category?: string;
  cuisine?: string;
  townSlug?: string;
  physicalAddress?: string;
  websiteUrl?: string;
  bookingSiteUrl?: string;
  imageUrls?: string[];
  [key: string]: any;
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No images uploaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <Image src={images[currentIndex]} alt={`Listing image ${currentIndex + 1}`} fill className="object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-1">
          {images.map((img, idx) => (
            <div key={idx} onClick={() => setCurrentIndex(idx)} className={`relative aspect-square rounded cursor-pointer overflow-hidden border-2 ${idx === currentIndex ? 'border-primary' : 'border-transparent'}`}>
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({
  listing,
  onApprove,
  onUnapprove,
  onDelete,
  showApprove = true,
}: {
  listing: Listing;
  onApprove?: (id: string) => void;
  onUnapprove?: (id: string) => void;
  onDelete: (id: string) => void;
  showApprove?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{listing.name}</CardTitle>
            <CardDescription>
              Submitted by: {listing.contactEmail} on {listing.createdAt ? format(new Date(listing.createdAt.seconds * 1000), 'd MMM yyyy') : 'N/A'}
            </CardDescription>
          </div>
          {!showApprove && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(listing.category || listing.cuisine) && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span>{listing.category || listing.cuisine}</span>
            </div>
          )}
          {listing.townSlug && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{listing.townSlug.replace(/-/g, ' ')}</span>
            </div>
          )}
          {listing.contactPhone && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{listing.contactPhone}</span>
            </div>
          )}
          {listing.contactEmail && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{listing.contactEmail}</span>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <><ChevronUp className="h-4 w-4 mr-1" /> Show Less</>
          ) : (
            <><ChevronDown className="h-4 w-4 mr-1" /> Show More Details</>
          )}
        </Button>

        {expanded && (
          <div className="space-y-4 pt-2 border-t">
            <ImageGallery images={listing.imageUrls || []} />
            {listing.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Description</p>
                <p className="text-sm">{listing.description}</p>
              </div>
            )}
            {listing.physicalAddress && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Address</p>
                <div className="flex items-start gap-1 text-sm">
                  <MapPin className="h-3 w-3 mt-1 shrink-0" />
                  <span>{listing.physicalAddress}</span>
                </div>
              </div>
            )}
            {listing.ownerEmail && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Owner</p>
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-3 w-3" />
                  <span>{listing.ownerEmail}</span>
                </div>
              </div>
            )}
            <div className="space-y-1">
              {listing.websiteUrl && (
                <div>
                  <a href={listing.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Globe className="h-3 w-3" /><span>Website</span><ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {listing.bookingSiteUrl && (
                <div>
                  <a href={listing.bookingSiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /><span>Booking Site</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 w-full">
          {showApprove && onApprove && (
            <Button className="flex-1" onClick={() => onApprove(listing.id)}>Approve</Button>
          )}
          {!showApprove && onUnapprove && (
            <Button variant="outline" size="sm" onClick={() => onUnapprove(listing.id)}>Un-approve</Button>
          )}
          <Button variant="destructive" size="sm" onClick={() => onDelete(listing.id)}>Delete</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function AdminListingsPanel({ collectionName }: { collectionName: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const listingsQuery = useMemoFirebase(() => collection(firestore, collectionName), [firestore, collectionName]);
  const { data: listings, isLoading } = useCollection<Listing>(listingsQuery);

  const handleApprove = (id: string) => {
    updateListingStatus(firestore, collectionName, id, true);
    toast({ title: "Listing Approved ✅" });
  };

  const handleUnapprove = (id: string) => {
    updateListingStatus(firestore, collectionName, id, false);
    toast({ title: "Listing Un-approved" });
  };

  const handleDelete = (id: string) => {
    deleteListing(firestore, collectionName, id);
    toast({ variant: "destructive", title: "Listing Deleted" });
  };

  const pendingListings = listings?.filter(l => !l.approved).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)) || [];
  const approvedListings = listings?.filter(l => l.approved).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)) || [];

  if (isLoading) return <p>Loading listings...</p>;

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Pending Approval ({pendingListings.length})</h2>
        {pendingListings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onApprove={handleApprove} onDelete={handleDelete} showApprove={true} />
            ))}
          </div>
        ) : <p className="text-muted-foreground">No pending listings.</p>}
      </div>
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Approved Listings ({approvedListings.length})</h2>
        {approvedListings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onUnapprove={handleUnapprove} onDelete={handleDelete} showApprove={false} />
            ))}
          </div>
        ) : <p className="text-muted-foreground">No approved listings.</p>}
      </div>
    </div>
  );
}
