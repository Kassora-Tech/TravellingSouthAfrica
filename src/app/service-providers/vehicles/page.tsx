export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function VehiclesPage() {
  return (
    <ServiceProviderListings
      category="Transport"
      title="Vehicles & Transport"
      description="Specialty vehicle rentals like campers, 4x4s and transport services."
    />
  );
}
