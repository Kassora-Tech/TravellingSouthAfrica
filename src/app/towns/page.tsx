import { Translatable } from '@/components/translatable';

export default function TownsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Towns" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Explore the many towns and cities of South Africa. Content coming soon." />
      </p>
    </div>
  );
}
