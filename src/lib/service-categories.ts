import { Car, Briefcase, Compass, Waves, PartyPopper, ShoppingBag, Utensils, Wine } from 'lucide-react';

export const serviceCategories = [
    'Activities',
    'Car Hire & Transport',
    'Tour Operator',
    'Spa & Wellness',
    'Night Life',
    'Shops',
    'Restaurant',
    'Food & Beverage Experiences',

  ];

export const serviceCategoriesMap: { [key: string]: { icon: React.ElementType, description: string, buttonText: string, href: string } } = {
    'Activities': {
        icon: Compass,
        description: 'Discover activities and things to do across South Africa.',
        buttonText: 'Browse Activities',
        href: '/service-providers/activities',
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
    'Food & Beverage Experiences': {
        icon: Wine,
        description: 'Discover food and beverage experiences, from tastings to culinary tours.',
        buttonText: 'Explore Experiences',
        href: '/service-providers/food-beverage-experiences',
    },
};

    