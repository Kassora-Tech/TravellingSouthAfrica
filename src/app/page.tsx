import { Hero } from '@/components/home/hero';
import { QuickNav } from '@/components/home/quick-nav';
import { FeaturedProvinces } from '@/components/home/featured-provinces';
import { FeaturedDestinations } from '@/components/home/featured-destinations';
import { CallToActions } from '@/components/home/call-to-actions';
import { AnimatedStats } from '@/components/home/animated-stats';
import { PromotionalBanner } from '@/components/home/promotional-banner';
import { AccommodationSearch } from '@/components/home/accommodation-search';
import { OurPartners } from '@/components/home/our-partners';

export default function HomePage() {
  return (
    <>
      <PromotionalBanner />
      <Hero />
      <AccommodationSearch />
      <QuickNav />
      <FeaturedProvinces />
      <AnimatedStats />
      <FeaturedDestinations />
      <CallToActions />
      <OurPartners />
    </>
  );
}
