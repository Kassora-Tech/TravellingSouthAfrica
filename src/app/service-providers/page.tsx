import { Translatable } from '@/components/translatable';
import { ServiceProviderDirectory } from '@/components/service-providers/service-provider-directory';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

export const dynamic = 'force-dynamic';

async function getApprovedServiceProviders() {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const providersRef = collection(firestore, 'service_providers');
      const q = query(providersRef);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
          const data = doc.data();
          const plainObject = JSON.parse(JSON.stringify(data));
          return { id: doc.id, ...plainObject };
      }) as any[];
  
    } catch (error) {
      console.error("Error fetching approved service providers:", error);
      return [];
    }
}

export default async function ServiceProvidersPage() {
  const serviceProviders = await getApprovedServiceProviders();

  return (
    <>
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://i.ibb.co/xSfW78nr/foreign-exchange-1024x684.webp')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-headline text-white md:text-5xl">
            <Translatable text="Service Providers in South Africa" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="Enhance your trip with these helpful services and tools recommended by Travelling South Africa." />
          </p>
        </div>
      </section>

      <section id="services" className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <ServiceProviderDirectory providers={serviceProviders} />
        </div>
      </section>
    </>
  );
}

    