"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Translatable } from "@/components/translatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout } from "@/firebase/auth/actions";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p><Translatable text="Loading..." /></p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-primary">
          <Translatable text={`Welcome, ${user.displayName || 'Explorer'}!`} />
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          <Translatable text="This is your personal dashboard. Plan your next South African adventure." />
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
           <Card>
            <CardHeader>
              <CardTitle><Translatable text="My Trips" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <Translatable text="Functionality to view, create, and manage your personalized trips is coming soon." />
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle><Translatable text="My Bookings" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <Translatable text="Accommodation booking history will be available here soon." />
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle><Translatable text="Plan Your Trip" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                <Translatable text="Go to the trip planner to create and manage your itineraries." />
              </p>
              <Button asChild>
                <Link href="/plan-your-trip">
                    <Translatable text="Start Planning" />
                </Link>
              </Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle><Translatable text="Log Out" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                <Translatable text="End your current session." />
              </p>
              <Button onClick={handleLogout} variant="outline">
                <Translatable text="Logout" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
