'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAdmin } from '@/lib/admin';
import { Translatable } from '@/components/translatable';
import { AdminListingsPanel } from '@/components/admin/admin-listings-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !isAdmin(user)) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAdmin(user)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p><Translatable text="Loading..." /></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold font-headline text-primary">Admin Dashboard</h1>
      <p className="mt-2 text-lg text-muted-foreground">Manage user-submitted listings.</p>
      <Tabs defaultValue="accommodations" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="service_providers">Services</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
        </TabsList>
        <TabsContent value="accommodations">
          <AdminListingsPanel collectionName="accommodations" />
        </TabsContent>
        <TabsContent value="restaurants">
          <AdminListingsPanel collectionName="restaurants" />
        </TabsContent>
        <TabsContent value="service_providers">
          <AdminListingsPanel collectionName="service_providers" />
        </TabsContent>
        <TabsContent value="attractions">
          <AdminListingsPanel collectionName="attractions" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
