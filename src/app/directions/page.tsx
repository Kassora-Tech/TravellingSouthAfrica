import { Translatable } from '@/components/translatable';

export default function DirectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Get Directions" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Find the best route for your journey. Content coming soon." />
      </p>
    </div>
  );
}
