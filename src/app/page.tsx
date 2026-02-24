import { Hero } from '@/components/home/hero';
import { CallToActions } from '@/components/home/call-to-actions';
import { FeaturedProvinces } from '@/components/home/featured-provinces';
import { AnimatedStats } from '@/components/home/animated-stats';
import { PromotionalBanner } from '@/components/home/promotional-banner';

export default function Home() {
  return (
    <>
      <PromotionalBanner />
      <Hero />
      <AnimatedStats />
      <CallToActions />
      <FeaturedProvinces />
    </>
  );
}
