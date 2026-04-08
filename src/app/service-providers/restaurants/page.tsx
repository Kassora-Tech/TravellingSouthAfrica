export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function RestaurantsServicePage() {
  return (
    <ServiceProviderListings
      category="Restaurant"
      title="Restaurants & Dining"
      description="Explore dining options across South Africa."
    />
  );
}