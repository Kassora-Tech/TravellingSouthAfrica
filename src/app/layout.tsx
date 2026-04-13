import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LanguageProvider } from '@/contexts/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Travelling South Africa | Travel SA | TravellingSA | Free Guide to Provinces, Towns, Sights & Routes',
    template: '%s | Travelling South Africa',
  },
  description: 'Travelling South Africa (Travel SA) – Your free comprehensive guide to provinces, towns, sights, routes, accommodations, restaurants & attractions in South Africa. Plan your trip today.',
  openGraph: {
    title: 'Travelling South Africa | Free Guide to Provinces, Towns, Sights & Routes 2026',
    description: 'Your free, comprehensive guide to travelling South Africa. Discover the Rainbow Nation with our guides to provinces, towns, sights, routes, and trip planning tools.',
    url: siteUrl,
    siteName: 'Travelling South Africa',
    images: [
      {
        url: 'https://i.ibb.co/nNDFjwr0/Why-2025-Is-Africas-Year-for-Travellers-1140x530.jpg', // Default OG image
        width: 1140,
        height: 530,
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travelling South Africa | Free Guide to Provinces, Towns, Sights & Routes 2026',
    description: 'Your free, comprehensive guide to travelling South Africa.',
    images: ['https://i.ibb.co/nNDFjwr0/Why-2025-Is-Africas-Year-for-Travellers-1140x530.jpg'],
  },
  alternates: {
    canonical: '/',
  }
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Travelling South Africa',
  alternateName: ["Travel SA", "TravellingSA"],
  url: siteUrl,
  logo: 'https://i.ibb.co/0prkKCw3/2026-Logo-1-Photoroom.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cape Town',
    addressCountry: 'ZA',
  },
  sameAs: [
    'https://www.facebook.com/people/Travellingsouthafricacoza/61586123114017/',
    'https://www.instagram.com/travellingsouthafrica.co.za?utm_source=qr&igsh=ZTV6OGM4MWx2MW1r',
    'https://www.tiktok.com/@travellingsouthaf?_r=1&_t=ZS-949r0bDVUzV',
    'https://za.pinterest.com/travellingsouthafrica/?invite_code=ce83b92eb4ef48c7a45fd836c5619898&sender=1107674608259442133'
  ],
  keywords: "travel south africa, travelling south africa, travel sa, travellingsa, south africa travel guide"
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: 'Travelling South Africa',
  alternateName: ["Travel SA", "TravellingSA"],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      'urlTemplate': `${siteUrl}/towns?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string',
  },
  keywords: "travel south africa, travelling south africa, travel sa, travellingsa, south africa travel guide"
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Travelling South Africa',
  image: 'https://i.ibb.co/0prkKCw3/2026-Logo-1-Photoroom.png',
  '@id': siteUrl,
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cape Town',
    addressCountry: 'ZA'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -33.9249,
    longitude: 18.4241
  },
  keywords: "travel south africa, travelling south africa, travel sa, travellingsa"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="gtag-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-05SCK85RK9');
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="localbusiness-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-body antialiased text-base">
        <FirebaseClientProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
