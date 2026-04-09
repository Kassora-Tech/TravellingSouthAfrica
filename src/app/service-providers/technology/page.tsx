export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function ShopsPage() {
  return (
    <ServiceProviderListings
      category="Shop"
      title="Shops"
      description="Browse a variety of shops for souvenirs, gifts, and local goods."
    />
  );
}
