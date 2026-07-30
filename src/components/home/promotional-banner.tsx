import Link from 'next/link';
import { Translatable } from '@/components/translatable';

const headlineText = '🎉 FREE 60-Day Trial!';
const bodyText =
  'List your accommodation, restaurants & must-see services today. Only R350/year after your trial.';
const linkText = 'Click here';

function BannerMessage() {
  return (
    <p className="mx-8 py-3 text-sm font-semibold sm:text-base">
      <span className="font-bold text-accent">
        <Translatable text={headlineText} />
      </span>
      <span className="ml-2 text-white">
        <Translatable text={bodyText} />
      </span>
      <span className="ml-2 font-bold text-accent group-hover:underline">
        <Translatable text={linkText} />
      </span>
    </p>
  );
}

export function PromotionalBanner() {
  return (
    <Link href="/add-your-listing" className="group block w-full overflow-x-hidden bg-blue-900">
      <div className="flex h-12 items-center">
        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          <BannerMessage />
          <BannerMessage />
        </div>
      </div>
    </Link>
  );
}
