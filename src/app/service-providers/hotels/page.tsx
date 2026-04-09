export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function HotelsPage() {
  return (
    <ServiceProviderListings
      category="Night Life"
      title="Night Life"
      description="Discover the best nightlife, bars, clubs and entertainment venues across South Africa."
    />
  );
}
