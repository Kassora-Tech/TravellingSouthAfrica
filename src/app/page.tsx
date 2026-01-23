import { Hero } from '@/components/home/hero';
import { CallToActions } from '@/components/home/call-to-actions';
import { FeaturedProvinces } from '@/components/home/featured-provinces';
import { AnimatedStats } from '@/components/home/animated-stats';

export default function Home() {
  return (
    <>
      <Hero />
      <AnimatedStats />
      <CallToActions />
      <FeaturedProvinces />
    </>
  );
}
