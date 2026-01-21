import { Translatable } from '@/components/translatable';

export default function PlanYourTripPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Plan Your Trip" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Create and manage your personalized travel itineraries. Content coming soon." />
      </p>
    </div>
  );
}
