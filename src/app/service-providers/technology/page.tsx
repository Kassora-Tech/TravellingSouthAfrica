import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function TechnologyPage() {
  return (
    <ServiceProviderListings
      category="Other"
      title="Technology Services"
      description="Services for staying connected during your South African trip, like SIM cards and Wi-Fi."
    />
  );
}