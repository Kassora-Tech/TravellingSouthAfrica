import Link from 'next/link';
import { Translatable } from '@/components/translatable';

export function PromotionalBanner() {
  const bannerText = "For a limited time, list your accommodation on Travelling South Africa for only R200.";
  return (
    <div className="bg-primary/10 w-full overflow-x-hidden">
      <div className="flex h-12 items-center">
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          <p className="font-semibold text-sm sm:text-base text-foreground mx-8 py-3">
            <Translatable text={bannerText} />
            <Link href="/accommodations#list-accommodation" className="ml-2 font-bold text-primary underline hover:text-primary/80">
              <Translatable text="Click here" />
            </Link>
          </p>
          <p className="font-semibold text-sm sm:text-base text-foreground mx-8 py-3">
            <Translatable text={bannerText} />
            <Link href="/accommodations#list-accommodation" className="ml-2 font-bold text-primary underline hover:text-primary/80">
              <Translatable text="Click here" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
