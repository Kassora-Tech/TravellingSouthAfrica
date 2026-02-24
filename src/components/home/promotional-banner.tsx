import Link from 'next/link';
import { Translatable } from '@/components/translatable';

export function PromotionalBanner() {
  const bannerText = "For a limited time, advertise your accommodation, restaurants & must-see services in your town for only R200 per year.";
  return (
    <div className="bg-blue-900 w-full overflow-x-hidden">
      <div className="flex h-12 items-center">
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          <p className="font-semibold text-sm sm:text-base text-white mx-8 py-3">
            <Translatable text={bannerText} />
            <Link href="/accommodations#list-accommodation" className="ml-2 font-bold text-accent hover:underline">
              <Translatable text="Click here" />
            </Link>
          </p>
          <p className="font-semibold text-sm sm:text-base text-white mx-8 py-3">
            <Translatable text={bannerText} />
            <Link href="/accommodations#list-accommodation" className="ml-2 font-bold text-accent hover:underline">
              <Translatable text="Click here" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
