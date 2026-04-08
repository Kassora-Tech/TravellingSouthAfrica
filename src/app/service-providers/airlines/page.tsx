import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function AirlinesPage() {
  return (
    <ServiceProviderListings
      category="Transport"
      title="Airlines"
      description="Find flights to and within South Africa from major carriers and travel services."
    />
  );
}