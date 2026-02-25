import Link from 'next/link';
import { Translatable } from '@/components/translatable';

export function PromotionalBanner() {
  const bannerText = "For a limited time, advertise your accommodation, restaurants & must-see services in your town for only R200 per year.";
  return (
    <Link href="/accommodations#list-accommodation" className="group block w-full overflow-x-hidden bg-blue-900">
      <div className="flex h-12 items-center">
        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          <p className="mx-8 py-3 text-sm font-semibold text-white sm:text-base">
            <Translatable text={bannerText} />
            <span className="ml-2 font-bold text-accent group-hover:underline">
              <Translatable text="Click here" />
            </span>
          </p>
          <p className="mx-8 py-3 text-sm font-semibold text-white sm:text-base">
            <Translatable text={bannerText} />
            <span className="ml-2 font-bold text-accent group-hover:underline">
              <Translatable text="Click here" />
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
