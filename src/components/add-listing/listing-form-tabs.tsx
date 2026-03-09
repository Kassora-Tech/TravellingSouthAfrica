'use client';

import { useState, type ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'firebase/auth';
import Image from 'next/image';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Translatable } from '@/components/translatable';
import { useToast } from '@/hooks/use-toast';
import { addListing } from '@/firebase/firestore/listings';
import { towns } from '@/lib/data/towns';
import { Camera, CheckCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useFirestore } from '@/firebase';

interface ListingFormTabsProps {
  user: User;
  isAdmin: boolean;
}

const accommodationSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  townSlug: z.string().min(1, 'Town is required'),
  category: z.string().min(1, 'Category is required'),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  bookingSiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1, 'Phone number is required'),
  description: z.string().min(1, 'Description is required').max(500),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the listing fee." }),
  }),
});

const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  townSlug: z.string().min(1, 'Town is required'),
  cuisine: z.string().min(1, 'Cuisine type is required'),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1, 'Phone number is required'),
  description: z.string().min(1, 'Description is required').max(500),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the listing fee." }),
  }),
});

const serviceProviderSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    townSlug: z.string().min(1, 'Town is required'),
    category: z.string().min(1, 'Category is required'),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(1, 'Phone number is required'),
    description: z.string().min(1, 'Description is required').max(500),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must agree to the listing fee." }),
    }),
});

const attractionSchema = z.object({
    name: z.string().min(1, 'Attraction name is required'),
    townSlug: z.string().min(1, 'Nearest Town is required'),
    category: z.string().min(1, 'Category is required'),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    contactEmail: z.string().email().optional().or(z.literal('')),
    description: z.string().min(1, 'Description is required').max(500),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must agree to the listing fee." }),
    }),
});


type FormSchema = z.infer<typeof accommodationSchema> | z.infer<typeof restaurantSchema> | z.infer<typeof serviceProviderSchema> | z.infer<typeof attractionSchema>;

const accommodationCategories = ['Hotel', 'Guesthouse', 'Self-Catering', 'B&B', 'Lodge', 'Backpackers', 'Other'];
const restaurantCuisines = ['South African', 'Italian', 'Seafood', 'Steakhouse', 'Fine Dining', 'Cafe', 'Other'];
const serviceCategories = ['Car Hire', 'Tour Operator', 'Guide', 'Transport', 'Other'];
const attractionCategories = ['Nature', 'Culture', 'Adventure', 'Historical', 'Other'];


export function ListingFormTabs({ user, isAdmin }: ListingFormTabsProps) {
  return (
    <Tabs defaultValue="accommodation" className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto">
        <TabsTrigger value="accommodation"><Translatable text="Accommodation" /></TabsTrigger>
        <TabsTrigger value="restaurant"><Translatable text="Restaurant" /></TabsTrigger>
        <TabsTrigger value="service"><Translatable text="Service Provider" /></TabsTrigger>
        <TabsTrigger value="attraction"><Translatable text="Attraction/Sight" /></TabsTrigger>
      </TabsList>
      <TabsContent value="accommodation">
        <ListingForm
            key="accommodation"
            user={user}
            isAdmin={isAdmin}
            collectionName="accommodations"
            formSchema={accommodationSchema}
            title="Accommodation"
            description="List your hotel, guesthouse, B&B, or other accommodation."
            fields={[
                { name: 'name', label: 'Accommodation Name', type: 'text' },
                { name: 'townSlug', label: 'Town', type: 'select', options: towns.map(t => ({value: t.slug, label: t.name})) },
                { name: 'category', label: 'Category', type: 'select', options: accommodationCategories.map(c => ({value: c, label: c})) },
                { name: 'websiteUrl', label: 'Website URL', type: 'url', optional: true },
                { name: 'bookingSiteUrl', label: 'Booking Site URL', type: 'url', optional: true },
                { name: 'contactEmail', label: 'Contact Email', type: 'email' },
                { name: 'contactPhone', label: 'Contact Phone', type: 'tel' },
                { name: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
      </TabsContent>
      <TabsContent value="restaurant">
        <ListingForm
            key="restaurant"
            user={user}
            isAdmin={isAdmin}
            collectionName="restaurants"
            formSchema={restaurantSchema}
            title="Restaurant"
            description="Add your restaurant, cafe, or eatery to our listings."
            fields={[
                { name: 'name', label: 'Restaurant Name', type: 'text' },
                { name: 'townSlug', label: 'Town', type: 'select', options: towns.map(t => ({value: t.slug, label: t.name})) },
                { name: 'cuisine', label: 'Cuisine Type', type: 'select', options: restaurantCuisines.map(c => ({value: c, label: c})) },
                { name: 'websiteUrl', label: 'Website URL', type: 'url', optional: true },
                { name: 'contactEmail', label: 'Contact Email', type: 'email' },
                { name: 'contactPhone', label: 'Contact Phone', type: 'tel' },
                { name: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
      </TabsContent>
      <TabsContent value="service">
        <ListingForm
            key="service"
            user={user}
            isAdmin={isAdmin}
            collectionName="service_providers"
            formSchema={serviceProviderSchema}
            title="Service Provider"
            description="List your tour, car rental, guide, or other travel service."
            fields={[
                { name: 'name', label: 'Service Name', type: 'text' },
                { name: 'townSlug', label: 'Town', type: 'select', options: towns.map(t => ({value: t.slug, label: t.name})) },
                { name: 'category', label: 'Category', type: 'select', options: serviceCategories.map(c => ({value: c, label: c})) },
                { name: 'websiteUrl', label: 'Website URL', type: 'url', optional: true },
                { name: 'contactEmail', label: 'Contact Email', type: 'email' },
                { name: 'contactPhone', label: 'Contact Phone', type: 'tel' },
                { name: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
      </TabsContent>
      <TabsContent value="attraction">
        <ListingForm
            key="attraction"
            user={user}
            isAdmin={isAdmin}
            collectionName="attractions"
            formSchema={attractionSchema}
            title="Attraction / Sight"
            description="Add a must-see attraction or point of interest."
             fields={[
                { name: 'name', label: 'Attraction Name', type: 'text' },
                { name: 'townSlug', label: 'Nearest Town', type: 'select', options: towns.map(t => ({value: t.slug, label: t.name})) },
                { name: 'category', label: 'Category', type: 'select', options: attractionCategories.map(c => ({value: c, label: c})) },
                { name: 'websiteUrl', label: 'Website URL', type: 'url', optional: true },
                { name: 'contactEmail', label: 'Contact Email', type: 'email', optional: true },
                { name: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
      </TabsContent>
    </Tabs>
  );
}

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'select' | 'textarea' | 'url' | 'email' | 'tel';
    options?: { value: string; label: string }[];
    optional?: boolean;
}

interface ListingFormProps {
    user: User;
    collectionName: string;
    formSchema: z.Schema<any>;
    title: string;
    description: string;
    fields: FieldConfig[];
    isAdmin: boolean;
}

function ListingForm({ user, collectionName, formSchema, title, description, fields, isAdmin }: ListingFormProps) {
    const firestore = useFirestore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
            contactEmail: user.email || '',
            terms: false,
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (isAdmin) {
            form.setValue('terms', true);
        }
        form.setValue('contactEmail', user.email || '');
    }, [isAdmin, user.email, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        // Note: File upload logic to Firebase Storage is not implemented here.
        // In a real app, you'd upload files and get URLs before saving to Firestore.
        const result = await addListing(firestore, collectionName, { 
            ...values,
            ownerUid: user.uid,
            ownerEmail: user.email,
            approved: isAdmin,
        });

        if (result.success) {
            setSuccess(true);
            form.reset();
            setImagePreviews([]);
            setTimeout(() => setSuccess(false), 6000);
        } else {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: result.error || 'An unexpected error occurred.',
            });
        }
        setIsSubmitting(false);
    };
    
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length + imagePreviews.length > 6) {
                toast({ variant: 'destructive', title: 'You can upload a maximum of 6 photos.' });
                return;
            }
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    if (success) {
        return (
            <Card className="shadow-lg">
                 <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                    <h2 className="mt-4 text-2xl font-bold font-headline"><Translatable text="Listing Submitted!" /></h2>
                    <p className="mt-2 text-muted-foreground"><Translatable text={`Thank you. Your listing has been submitted for review. We will review it shortly.${isAdmin ? ' It has been automatically approved.' : ''}`} /></p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary"><Translatable text={`List Your ${title}`} /></CardTitle>
                <CardDescription><Translatable text={description} /></CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map(field => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name}
                                    render={({ field: formField }) => (
                                        <FormItem>
                                            <FormLabel><Translatable text={field.label} />{!field.optional && '*'}</FormLabel>
                                            <FormControl>
                                                {field.type === 'select' ? (
                                                    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select a ${field.label.toLowerCase()}`} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <ScrollArea className="h-72">
                                                                {field.options?.map(option => (
                                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                                ))}
                                                            </ScrollArea>
                                                        </SelectContent>
                                                    </Select>
                                                ) : field.type === 'textarea' ? (
                                                    <Textarea {...formField} placeholder={`A bit about your ${title.toLowerCase()}...`} />
                                                ) : (
                                                    <Input {...formField} type={field.type} disabled={field.name === 'contactEmail'} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="photos"><Translatable text="Upload Photos (up to 6)" /></Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor={`${collectionName}-photos`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold"><Translatable text="Click to upload" /></span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground"><Translatable text="PNG, JPG" /></p>
                                    </div>
                                    <Input id={`${collectionName}-photos`} type="file" className="hidden" multiple accept="image/png, image/jpeg" onChange={handleImageChange} />
                                </label>
                            </div>
                            {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {!isAdmin && (
                            <div className="space-y-4 rounded-lg border bg-secondary p-4">
                                <p className="text-sm italic text-muted-foreground">
                                    <Translatable text="By submitting this listing, you agree to a non-refundable annual fee of R200 per year. This fee covers your listing on Travelling South Africa and is payable upon approval. You will be invoiced after review and acceptance of your submission." />
                                </p>
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    <Translatable text="I understand and agree to the R200 annual listing fee upon approval" />
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full" size="lg">
                            {isSubmitting ? <Translatable text="Submitting..." /> : <Translatable text="Submit for Approval" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
