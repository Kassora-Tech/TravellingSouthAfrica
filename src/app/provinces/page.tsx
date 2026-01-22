import { Translatable } from '@/components/translatable';
import { provinces } from '@/lib/data/provinces';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ProvincesPage() {
  return (
    <>
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/1Ycpf7ZZ/Nine-provinces-South-Africa-top.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="The Nine Provinces" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="From the sun-drenched beaches of the Western Cape to the wild bushveld of Limpopo, discover the unique character and beauty of each of South Africa's nine provinces." />
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {provinces.map((province) => {
                    const image = PlaceHolderImages.find(p => p.id === province.imageId);
                    return (
                        <Card key={province.slug} className="group overflow-hidden flex flex-col">
                            {image && (
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <h2 className="font-headline text-2xl font-bold text-primary">
                                    <Translatable text={province.name} />
                                </h2>
                                <p className="mt-2 text-muted-foreground flex-grow">
                                    <Translatable text={province.shortDescription} />
                                </p>
                                <div className="mt-6">
                                    <Button asChild>
                                        <Link href={`/provinces/${province.slug}`}>
                                            <Translatable text="Explore Province" />
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
      </section>
    </>
  );
}
