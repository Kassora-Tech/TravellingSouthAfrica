import { Hero } from '@/components/home/hero';
import { AccommodationSearch } from '@/components/home/accommodation-search';
import { CallToActions } from '@/components/home/call-to-actions';
import { FeaturedProvinces } from '@/components/home/featured-provinces';
import { AnimatedStats } from '@/components/home/animated-stats';

export default function Home() {
  return (
    <>
      <Hero />
      <AccommodationSearch />
      <AnimatedStats />
      <FeaturedProvinces />
      <CallToActions />
    </>
  );
}
