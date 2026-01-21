import { Translatable } from '@/components/translatable';

export default function CurrencyConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Currency Converter" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="A handy tool for currency conversions. Content coming soon." />
      </p>
    </div>
  );
}
