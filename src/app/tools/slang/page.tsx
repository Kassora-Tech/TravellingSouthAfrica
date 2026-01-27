import { Translatable } from '@/components/translatable';

export default function SlangPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="South African Slang" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Learn some local lingo! Content coming soon." />
      </p>
    </div>
  );
}
