export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function TechnologyPage() {
  return (
    <ServiceProviderListings
      category="Technology"
      title="Technology Services"
      description="Services for staying connected during your South African trip."
    />
  );
}