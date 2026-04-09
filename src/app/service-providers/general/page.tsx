export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function GeneralPage() {
  return (
    <ServiceProviderListings
      category="Spa & Wellness"
      title="Spa & Wellness"
      description="Discover spa, wellness and relaxation services across South Africa."
    />
  );
}
