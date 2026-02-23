'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Translatable } from '../translatable';
import { routes } from '@/lib/data/routes';
import { useToast } from '@/hooks/use-toast';

interface TripCreatorBarProps {
    onTripCreate: (name: string, routeSlug?: string, reverse?: boolean) => void;
}

export function TripCreatorBar({ onTripCreate }: TripCreatorBarProps) {
    const [newTripName, setNewTripName] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [reverseRoute, setReverseRoute] = useState(false);
    const { toast } = useToast();

    const handleCreateTrip = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTripName) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please provide a name for your new trip.",
            });
            return;
        }
        onTripCreate(newTripName, selectedRoute, reverseRoute);
        // Reset form
        setNewTripName('');
        setSelectedRoute('');
        setReverseRoute(false);
    };
    
    const handleRouteChange = (value: string) => {
        setSelectedRoute(value);
        if (value) {
            const routeName = routes.find(r => r.slug === value)?.name;
            if (routeName) setNewTripName(routeName);
        } else {
             if (routes.some(r => r.name === newTripName)) {
                setNewTripName('');
            }
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <form onSubmit={handleCreateTrip} className="inline-flex flex-col md:flex-row gap-4 items-center p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="w-full md:w-auto">
                            <Label htmlFor="trip-name" className="sr-only">Trip Name</Label>
                            <Input
                                id="trip-name"
                                placeholder="Name your new trip..."
                                value={newTripName}
                                onChange={(e) => setNewTripName(e.target.value)}
                                className="bg-white/10 border-white/30 placeholder:text-white/70 text-white focus-visible:ring-accent"
                            />
                        </div>
                        <div className="flex gap-4 items-center">
                            <Select value={selectedRoute} onValueChange={handleRouteChange}>
                                <SelectTrigger className="w-full md:w-[220px] bg-white/10 border-white/30 text-white focus:ring-accent">
                                    <SelectValue placeholder="Or create from a route" />
                                </SelectTrigger>
                                <SelectContent>
                                    {routes.filter(r => r.name.startsWith('N') || r.name.startsWith('R')).sort((a,b) => a.name.localeCompare(b.name)).map(r => <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="reverse-route" checked={reverseRoute} onCheckedChange={(checked) => setReverseRoute(checked as boolean)} className="border-white/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                                <Label htmlFor="reverse-route" className="text-white text-sm"><Translatable text="Reverse"/></Label>
                            </div>
                        </div>
                        <Button type="submit" variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground w-full md:w-auto">
                            <Translatable text="Create Trip" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
