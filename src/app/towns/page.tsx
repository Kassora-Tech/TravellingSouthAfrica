import type { Metadata } from 'next';
import Script from 'next/script';
import TownsClient from './TownsPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    { '@type': 'ListItem', position: 2, name: 'Towns', item: `${siteUrl}/towns` },
  ],
};

export const metadata: Metadata = {
  title: 'South African Towns & Cities | Travel SA | TravellingSA',
  description: 'Search and discover over 800 towns and cities with Travelling South Africa (Travel SA). Your guide to finding your next destination in South Africa.',
  alternates: {
    canonical: `${siteUrl}/towns`,
  },
};

export default function TownsPage() {
  return (
    <>
      <Script
        id="towns-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TownsClient />
    </>
  );
}
