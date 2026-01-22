import { Translatable } from '@/components/translatable';

export default function AccommodationsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">
          <Translatable text="Accommodations in South Africa" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <Translatable text="Discover guesthouses, hotels, lodges, and more from local owners." />
        </p>
        <p className="mt-8 text-2xl font-semibold">
          <Translatable text="Coming Soon!" />
        </p>
      </div>
    </div>
  );
}
