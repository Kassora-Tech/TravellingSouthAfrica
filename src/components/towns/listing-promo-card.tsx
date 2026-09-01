import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

const PROMO_TEXT = "If you were listed, this is where you'd be seen!";
const ADD_LISTING_HREF = '/add-your-listing';
const PROMO_IMAGE_SRC = '/Images/AD_IMAGE_FILENAME.jpeg';

/**
 * "You could be here" promo tile shown in place of an empty accommodation or
 * service provider grid on a town page. Mirrors ServiceProviderCard's visual
 * structure (image area, heading + star row, divider, full-width button) so
 * both tabs render one consistent style. This is a dedicated component, not
 * the real listing cards themselves, so it can't drift the real cards'
 * styling and won't render a category badge with no category to show.
 *
 * The source creative is portrait (2:3), unlike the landscape aspect-video
 * used by real listing cards, so the image area uses aspect-[2/3] to show it
 * uncropped rather than forcing the wide crop and distorting/clipping it.
 */
export function ListingPromoCard() {
  return (
    <Card className="flex flex-col overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full bg-muted">
          <ImageWithFallback
            src={PROMO_IMAGE_SRC}
            alt="Example ad placement - this is where your business listing would be seen"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold text-primary leading-tight">{PROMO_TEXT}</h3>
          <div className="flex items-center gap-0.5 text-yellow-400 mt-1 shrink-0">
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-auto border-t">
          <Button asChild className="w-full sm:w-auto flex-1">
            <Link href={ADD_LISTING_HREF}>Add Your Listing</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
