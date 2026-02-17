"use client";

import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { TripPlanner } from '@/components/trip-planner/trip-planner';
import { PlanTripHero } from '@/components/trip-planner/page-hero';

export default function PlanYourTripPage() {
  const { user, isUserLoading } = useUser();
  
  useEffect(() => {
    document.title = 'Plan My Trip – Travelling South Africa';
  }, []);

  if (isUserLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p><Translatable text="Loading..." /></p>
        </div>
    );
  }

  return (
    <>
      <PlanTripHero />
      {user ? (
        <TripPlanner user={user} />
      ) : (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline text-2xl">
                <Translatable text="Feature Locked" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                <Translatable text="Please log in to plan your trip and save your favorite destinations." />
                </p>
                <Button asChild className="mt-6">
                    <Link href="/login?redirect=/plan-your-trip">
                        <Translatable text="Login or Register" />
                    </Link>
                </Button>
            </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
