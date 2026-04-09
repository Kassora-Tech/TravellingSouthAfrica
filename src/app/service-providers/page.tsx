import { Translatable } from '@/components/translatable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plane, Camera, Car, Settings, Bed, Utensils, Laptop, Users, Truck } from 'lucide-react';

const serviceCategories = [
    {
        icon: Plane,
        title: 'Airlines',
        description: 'Find flights to and within South Africa from major carriers.',
        href: '/service-providers/airlines',
        buttonText: 'Browse Airlines',
    },
    {
        icon: Camera,
        title: 'Attractions',
        description: 'Discover top attractions and book unique experiences.',
        href: '/service-providers/attractions',
        buttonText: 'Explore Attractions',
    },
    {
        icon: Car,
        title: 'Car Hire & Transport',
        description: 'Find car hire, transport and vehicle rentals.',
        href: '/service-providers/car-hire',
        buttonText: 'Find a Vehicle',
    },
    {
        icon: Settings,
        title: 'Spa & Wellness',
        description: 'Discover spa, wellness and relaxation services.',
        href: '/service-providers/general',
        buttonText: 'View Services',
    },
    {
        icon: Bed,
        title: 'Night Life',
        description: 'Discover the best nightlife venues and entertainment.',
        href: '/service-providers/hotels',
        buttonText: 'Book a Stay',
    },
    {
        icon: Utensils,
        title: 'Restaurants',
        description: 'Explore dining options, from fine dining to local eateries.',
        href: '/service-providers/restaurants',
        buttonText: 'Find Restaurants',
    },
    {
        icon: Laptop,
        title: 'Entertainment',
        description: 'Discover entertainment services and experiences.',
        href: '/service-providers/technology',
        buttonText: 'Get Connected',
    },
    {
        icon: Users,
        title: 'Travel Agents',
        description: 'Connect with expert travel agents to plan your perfect trip.',
        href: '/service-providers/travel-agents',
        buttonText: 'Find an Agent',
    },
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline md:text-4xl">
              <Translatable text="Explore Service Providers by Category" />
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              <Translatable text="Find services for your trip." />
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((item) => (
              <Card key={item.title} className="flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
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
