import { Translatable } from '@/components/translatable';

export default function SightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Sights to See" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Find breathtaking attractions and points of interest. Content coming soon." />
      </p>
    </div>
  );
}
