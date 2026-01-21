import { Hero } from '@/components/home/hero';
import { QuickNav } from '@/components/home/quick-nav';
import { FeaturedDestinations } from '@/components/home/featured-destinations';
import { CallToActions } from '@/components/home/call-to-actions';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickNav />
      <FeaturedDestinations />
      <CallToActions />
    </>
  );
}
