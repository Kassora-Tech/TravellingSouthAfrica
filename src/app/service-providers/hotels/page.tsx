export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function HotelsPage() {
  return (
    <ServiceProviderListings
      category="Hotel"
      title="Hotels & Accommodation"
      description="Find and book hotels, guesthouses, and lodges across South Africa."
    />
  );
}