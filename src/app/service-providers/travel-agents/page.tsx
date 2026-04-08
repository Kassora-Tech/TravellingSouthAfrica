export const dynamic = 'force-dynamic';
import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function TravelAgentsPage() {
  return (
    <ServiceProviderListings
      category="Tour Operator"
      title="Travel Agents & Tour Operators"
      description="Connect with expert travel agents to plan your perfect South African trip."
    />
  );
}
