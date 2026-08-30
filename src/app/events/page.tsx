import { Translatable } from '@/components/translatable';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { towns } from '@/lib/data/towns';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  townSlug?: string;
  imageUrl?: string;
}

export const metadata: Metadata = {
  title: 'Upcoming Events in South Africa | Travel SA | TravellingSA',
  description: "See what's coming up around South Africa with Travelling South Africa (Travel SA) — festivals, markets, and local happenings.",
  alternates: {
    canonical: '/events',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Upcoming Events',
      item: `${siteUrl}/events`,
    },
  ],
};

async function getUpcomingEvents(): Promise<EventItem[]> {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const eventsRef = collection(firestore, 'events');

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const q = query(eventsRef, where('eventDate', '>=', Timestamp.fromDate(startOfToday)), orderBy('eventDate', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const plainObject = JSON.parse(JSON.stringify(data));
      return { id: doc.id, ...plainObject } as EventItem;
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

function formatEventDate(eventDate: any) {
  // Server-serialized Timestamp comes through as { seconds, nanoseconds } after
  // the JSON round-trip above, same shape blog posts already use for their date field.
  const seconds = eventDate?.seconds ?? eventDate?._seconds;
  if (typeof seconds !== 'number') return null;
  return new Date(seconds * 1000).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  const townNameMap = new Map(towns.map((t) => [t.slug, t.name]));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/bj4CV8rW/578251416429199326767899.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="Upcoming Events" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="Festivals, markets, and local happenings from around South Africa." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {events.map((event) => {
                const formattedDate = formatEventDate(event.eventDate);
                const townName = event.townSlug ? townNameMap.get(event.townSlug) || event.townSlug : null;

                return (
                  <Card key={event.id} className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                    <div className="relative h-64 w-full overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                        <h2 className="font-headline text-xl font-bold"><Translatable text={event.title} /></h2>
                        {formattedDate && (
                          <p className="flex items-center mt-1 text-sm">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {formattedDate}
                          </p>
                        )}
                        {townName && (
                          <p className="flex items-center mt-1 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            <Translatable text={townName} />
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-lg mx-auto">
              <Card>
                <div className="p-10">
                  <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">
                    <Translatable text="No Upcoming Events" />
                  </h3>
                  <p className="text-lg text-muted-foreground mt-2">
                    <Translatable text="There's nothing on the calendar right now — check back soon!" />
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
