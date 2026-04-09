export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function VehiclesPage() {
  return (
    <ServiceProviderListings
      category="Car Hire & Transport"
      title="Car Hire & Transport"
      description="Find car hire, transport and vehicle rental services across South Africa."
    />
  );
}
