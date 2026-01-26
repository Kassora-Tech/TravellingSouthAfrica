import { AccommodationSearch } from '@/components/home/accommodation-search';
import { Translatable } from '@/components/translatable';
import { ListYourAccommodationForm } from '@/components/accommodations/list-your-accommodation-form';

export default function AccommodationsPage() {
  return (
    <>
      <AccommodationSearch />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-headline text-primary">
          <Translatable text="Search Results" />
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          <Translatable text="Accommodation listings are currently under development. Please check back soon!" />
        </p>
      </div>
      <ListYourAccommodationForm />
    </>
  );
}
