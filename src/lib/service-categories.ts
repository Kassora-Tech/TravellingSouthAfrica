import { Car, Briefcase, Compass, Waves, PartyPopper, ShoppingBag, Utensils, Plane } from 'lucide-react';

export const serviceCategories = [
    'Airlines',
    'Car Hire & Transport',
    'Tour Operator',
    'Guide',
    'Spa & Wellness',
    'Night Life',
    'Shops',
    'Restaurant',
    'Travel Agent',
  ];
  
export const serviceCategoriesMap: { [key: string]: { icon: React.ElementType, description: string, buttonText: string, href: string } } = {
    'Airlines': {
        icon: Plane,
        description: 'Find flights to and within South Africa from major carriers.',
        buttonText: 'Browse Airlines',
        href: '/service-providers/airlines',
    },
    'Attractions': {
        icon: Compass,
        description: 'Discover top attractions and book unique experiences.',
        buttonText: 'Explore Attractions',
        href: '/service-providers/attractions',
    },
    'Car Hire & Transport': {
        icon: Car,
        description: 'Find car hire, transport and vehicle rentals.',
        buttonText: 'Find a Vehicle',
        href: '/service-providers/car-hire',
    },
    'Spa & Wellness': {
        icon: Waves,
        description: 'Discover spa, wellness and relaxation services.',
        buttonText: 'View Services',
        href: '/service-providers/general',
    },
    'Night Life': {
        icon: PartyPopper,
        description: 'Discover the best nightlife venues and entertainment.',
        buttonText: 'Explore Venues',
        href: '/service-providers/hotels',
    },
    'Shops': {
        icon: ShoppingBag,
        description: 'Browse a variety of shops for souvenirs, gifts, and local goods.',
        buttonText: 'Browse Shops',
        href: '/service-providers/technology',
    },
    'Restaurant': {
        icon: Utensils,
        description: 'Explore dining options, from fine dining to local eateries.',
        buttonText: 'Find Restaurants',
        href: '/service-providers/restaurants',
    },
    'Tour Operator': {
        icon: Briefcase,
        description: 'Connect with expert tour operators to plan your perfect trip.',
        buttonText: 'Find an Operator',
        href: '/service-providers/travel-agents',
    },
};

    