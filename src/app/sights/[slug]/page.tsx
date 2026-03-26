import { sights } from '@/lib/data/sights';
import { provinces } from '@/lib/data/provinces';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translatable } from '@/components/translatable';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sight = sights.find((p) => p.slug === params.slug);
  if (!sight) {
    return {
      title: "Sight Not Found",
      description: "The sight or attraction you are looking for does not exist on Travelling South Africa.",
    };
  }

  const title = `${sight.name} Guide | Travel South Africa | TravellingSA`;
  const description = `Your travel guide to ${sight.name} with Travelling South Africa (Travel SA). Find info on tickets, hours, and the best time to visit this iconic SA attraction.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/sights/${sight.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/sights/${sight.slug}`,
      images: [
        {
          url: PlaceHolderImages.find(p => p.id === sight.imageId)?.imageUrl || '',
          width: 600,
          height: 400,
          alt: `A scenic view of ${sight.name}`,
        }
      ]
    }
  };
}

export async function generateStaticParams() {
  return sights.map((sight) => ({
    slug: sight.slug,
  }));
}

export default function SightDetailPage({ params }: { params: { slug: string } }) {
  const sight = sights.find((p) => p.slug === params.slug);

  if (!sight) {
    notFound();
  }

  const province = provinces.find(p => p.slug === sight.provinceSlug);
  const heroImage = PlaceHolderImages.find((p) => p.id === sight.imageId);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sights',
        item: `${siteUrl}/sights`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: sight.name,
        item: `${siteUrl}/sights/${sight.slug}`,
      },
    ],
  };

  const attractionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: sight.name,
    description: sight.description,
    image: heroImage?.imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: sight.location,
      addressRegion: province?.name,
      addressCountry: 'ZA',
    },
    url: `${siteUrl}/sights/${sight.slug}`,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }} />
      <section className="relative h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`Hero image of ${sight.name}, a popular attraction in ${sight.location}`}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end p-8 md:p-16">
          <Badge variant="secondary" className="text-lg">
            <Translatable text={sight.category} />
          </Badge>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold font-headline">
            <Translatable text={sight.name} />
          </h1>
          <div className="flex items-center text-xl mt-2">
            <MapPin className="w-5 h-5 mr-2" />
            <Translatable text={sight.location} />
            {province && <>, <Translatable text={province.name} /></>}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="font-headline text-3xl font-bold mb-4"><Translatable text={`About ${sight.name}`} /></h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    <Translatable text={sight.description} />
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-2xl font-bold"><Translatable text="Visitor Info" /></h3>
                <div className="text-muted-foreground space-y-2">
                    <p><strong><Translatable text="Best time to visit:" /></strong> <Translatable text={sight.visitorInfo.bestTime} /></p>
                    <p><strong><Translatable text="Entry Fee:" /></strong> <Translatable text={sight.visitorInfo.entryFee} /></p>
                    <p><strong><Translatable text="Opening Hours:" /></strong> <Translatable text={sight.visitorInfo.openingHours} /></p>
                </div>
            </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
         <div className="max-w-4xl mx-auto">
             <h2 className="font-headline text-3xl font-bold mb-4"><Translatable text="Location" /></h2>
            <div className="aspect-video overflow-hidden rounded-lg">
                 <iframe 
                    src={sight.mapEmbed}
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
         </div>
      </section>
    </div>
  );
}
