"use client";

import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center text-primary">
          <Translatable text="Contact Us" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          <Translatable text="Have questions or feedback? We'd love to hear from you." />
        </p>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name"><Translatable text="Name" /></Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email"><Translatable text="Email" /></Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message"><Translatable text="Message" /></Label>
            <Textarea id="message" placeholder="Your message..." rows={6} />
          </div>
          <div className="text-center">
            <Button type="submit" size="lg">
              <Translatable text="Send Message" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
