"use client";

import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useState } from 'react';

export default function PlanYourTripPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
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
            <Button className="mt-6" onClick={() => alert('Login functionality coming soon!')}>
              <Translatable text="Login or Register" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary">
        <Translatable text="Plan Your Trip" />
      </h1>
      <p className="mt-4 text-muted-foreground">
        <Translatable text="Welcome! Here you can create and manage your personalized travel itineraries." />
      </p>
      {/* Actual trip planning dashboard will go here */}
    </div>
  );
}
