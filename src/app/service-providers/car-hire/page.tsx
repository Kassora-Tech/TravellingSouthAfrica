export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function CarHirePage() {
  return (
    <ServiceProviderListings
      category="Car Hire"
      title="Car Hire"
      description="Rent a car for your South African road trip adventure."
    />
  );
}
