import { Translatable } from '@/components/translatable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calculator, Languages, ListChecks, Map } from 'lucide-react';

const serviceItems = [
  {
    icon: ListChecks,
    title: 'Plan Your Trip',
    description: 'Create and save your personalized travel itineraries.',
    href: '/plan-your-trip',
    buttonText: 'Start Planning',
  },
  {
    icon: Calculator,
    title: 'Currency Converter',
    description: 'Use our handy tool for up-to-date exchange rates.',
    href: '/service-providers/currency-converter',
    buttonText: 'Convert Now',
  },
  {
    icon: Languages,
    title: 'South African Slang',
    description: 'Learn some local lingo with our handy slang guide.',
    href: '/service-providers/slang',
    buttonText: 'Learn Slang',
  },
  {
    icon: Map,
    title: 'Get Directions',
    description: 'Find the best route for your journey across South Africa.',
    href: '/service-providers/directions',
    buttonText: 'Find Route',
  }
];

export default function ServiceProvidersPage() {
  return (
    <>
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/xSfW78nr/foreign-exchange-1024x684.webp')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="Service Providers in South Africa" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="Enhance your trip with these helpful services and tools recommended by Travelling South Africa." />
          </p>
        </div>
      </section>

      <section id="services" className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((item) => (
              <Card key={item.title} className="flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <item.icon className="h-10 w-10" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col text-center">
                  <CardTitle className="font-headline text-2xl">
                    <Translatable text={item.title} />
                  </CardTitle>
                  <p className="mt-2 flex-grow text-muted-foreground">
                    <Translatable text={item.description} />
                  </p>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href={item.href}>
                        <Translatable text={item.buttonText} />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
