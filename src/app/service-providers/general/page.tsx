import { ServiceProviderListings } from '@/components/service-providers/service-provider-listings';

export default function GeneralPage() {
  return (
    <ServiceProviderListings
      category="Other"
      title="General Services"
      description="General services to assist with your travel planning in South Africa."
    />
  );
}