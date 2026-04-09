export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function TechnologyPage() {
  return (
    <ServiceProviderListings
      category="Entertainment"
      title="Entertainment"
      description="Discover entertainment services and experiences across South Africa."
    />
  );
}
