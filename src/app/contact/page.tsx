"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Translatable } from '@/components/translatable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useState } from 'react';
import { addContactMessage } from '@/firebase/firestore/messages';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    const result = await addContactMessage(firestore, data);
    
    if (result.success) {
      toast({
        title: 'Message Sent!',
        description: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error || 'An unexpected error occurred. Please try again.',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center text-primary">
          <Translatable text="Contact Us" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          <Translatable text="Have questions or feedback? We'd love to hear from you." />
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Translatable text="Name" /></FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Translatable text="Email" /></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><Translatable text="Subject" /></FormLabel>
                  <FormControl>
                    <Input placeholder="What is your message about?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><Translatable text="Message" /></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message..." rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Translatable text="Sending..." /> : <Translatable text="Send Message" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
