"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Translatable } from "@/components/translatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout } from "@/firebase/auth/actions";
import Link from "next/link";
import { MyItineraries } from "@/components/dashboard/my-itineraries";
import { Bed, Calculator, Languages, LogOut, PlusCircle } from "lucide-react";

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-primary">
          <Translatable text={`Welcome, ${user.displayName || 'Explorer'}!`} />
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          <Translatable text="This is your personal dashboard. Plan and manage your South African adventures." />
        </p>

        <div className="mt-12 space-y-12">
          {user && <MyItineraries user={user} />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="flex flex-col text-center">
              <CardHeader className="items-center">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <PlusCircle className="h-8 w-8" />
                </div>
                <CardTitle><Translatable text="Plan a New Trip" /></CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-4">
                  <Translatable text="Go to the trip planner to create and manage your itineraries." />
                </p>
                <Button asChild>
                  <Link href="/plan-your-trip">
                      <Translatable text="Go to Trip Planner" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
             <Card className="flex flex-col text-center">
              <CardHeader className="items-center">
                 <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Bed className="h-8 w-8" />
                </div>
                <CardTitle><Translatable text="My Bookings" /></CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-4">
                  <Translatable text="Accommodation booking history will be available here soon." />
                </p>
                <Button disabled><Translatable text="View Bookings" /></Button>
              </CardContent>
            </Card>
            <Card className="flex flex-col text-center">
              <CardHeader className="items-center">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Languages className="h-8 w-8" />
                </div>
                <CardTitle><Translatable text="SA Slang" /></CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-4">
                  <Translatable text="Learn some local lingo with our handy slang guide." />
                </p>
                <Button asChild>
                  <Link href="/service-providers/slang">
                      <Translatable text="Learn Slang" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="flex flex-col text-center">
              <CardHeader className="items-center">
                 <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Calculator className="h-8 w-8" />
                </div>
                <CardTitle><Translatable text="Currency Converter" /></CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-4">
                  <Translatable text="Use our handy tool for up-to-date exchange rates." />
                </p>
                <Button asChild>
                  <Link href="/service-providers/currency-converter">
                      <Translatable text="Convert Now" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
             <Card className="flex flex-col text-center">
              <CardHeader className="items-center">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <LogOut className="h-8 w-8" />
                </div>
                <CardTitle><Translatable text="Account" /></CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
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
    </div>
  );
}
