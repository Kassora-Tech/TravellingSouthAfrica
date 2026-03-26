import type { Metadata } from 'next';
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
    default: 'Travelling South Africa | Free Guide to Provinces, Towns, Sights, Routes & Accommodations 2026',
    template: '%s | Travelling South Africa',
  },
  description: 'Your free, comprehensive guide to travelling South Africa. Discover the Rainbow Nation with our guides to provinces, towns, sights, routes, and trip planning tools.',
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
  ]
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: 'Travelling South Africa',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      'urlTemplate': `${siteUrl}/towns?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-05SCK85RK9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-05SCK85RK9');
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
