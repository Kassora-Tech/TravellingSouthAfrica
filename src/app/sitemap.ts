import type { MetadataRoute } from 'next';
import { provinces } from '@/lib/data/provinces';
import { towns } from '@/lib/data/towns';
import { sights } from '@/lib/data/sights';
import { routes } from '@/lib/data/routes';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travellingsouthafrica.co.za';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = [
    '',
    '/provinces',
    '/towns',
    '/sights',
    '/routes',
    '/accommodations',
    '/service-providers',
    '/service-providers/airlines',
    '/service-providers/attractions',
    '/service-providers/car-hire',
    '/service-providers/general',
    '/service-providers/hotels',
    '/service-providers/restaurants',
    '/service-providers/travel-agents',
    '/service-providers/vehicles',
    '/service-providers/technology',
    '/plan-your-trip',
    '/tools/currency-converter',
    '/tools/directions',
    '/tools/slang',
    '/add-your-listing',
    '/contact',
    '/privacy-policy',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: (path === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const provincePages = provinces.map((province) => ({
    url: `${siteUrl}/provinces/${province.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const townPages = towns.map((town) => ({
    url: `${siteUrl}/towns/${town.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const sightPages = sights.map((sight) => ({
    url: `${siteUrl}/sights/${sight.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const routePages = routes.map((route) => ({
    url: `${siteUrl}/routes/${route.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...provincePages, ...townPages, ...sightPages, ...routePages];
}
