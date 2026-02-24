import Link from 'next/link';
import { Translatable } from '@/components/translatable';

export function PromotionalBanner() {
  return (
    <div className="bg-primary/10 w-full">
      <div className="container mx-auto px-4 py-3 text-center">
        <p className="font-semibold text-sm sm:text-base text-foreground">
          <Translatable text="For a limited time, list your accommodation on Travelling South Africa for only R200." />
          <Link href="/accommodations#list-accommodation" className="ml-2 font-bold text-primary underline hover:text-primary/80 whitespace-nowrap">
            <Translatable text="Click here" />
          </Link>
        </p>
      </div>
    </div>
  );
}
