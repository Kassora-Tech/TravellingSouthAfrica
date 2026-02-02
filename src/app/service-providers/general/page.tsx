import { Translatable } from '@/components/translatable';

export default function GeneralPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="General Services" />
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        <Translatable text="Coming Soon – Featured General Service Providers" />
      </p>
    </div>
  );
}
