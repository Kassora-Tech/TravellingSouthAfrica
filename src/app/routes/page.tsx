import { Translatable } from '@/components/translatable';

export default function RoutesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Major Routes" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Journey along the scenic routes that criss-cross South Africa. Content coming soon." />
      </p>
    </div>
  );
}
