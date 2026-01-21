import Link from 'next/link';
import Logo from './logo';
import { Translatable } from './translatable';

const footerNavs = [
  {
    label: 'Explore',
    items: [
      { href: '/provinces', name: 'Provinces' },
      { href: '/towns', name: 'Towns' },
      { href: '/sights', name: 'Sights to See' },
      { href: '/routes', name: 'Major Routes' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/plan-your-trip', name: 'Plan Your Trip' },
      { href: '/currency-converter', name: 'Currency Converter' },
      { href: '/directions', name: 'Get Directions' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '/contact', name: 'Contact Us' },
      { href: '/privacy-policy', name: 'Privacy Policy' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/">
              <Logo className="w-48" />
            </Link>
            <p className="mt-4 text-sm max-w-xs">
              <Translatable text="Discover the Rainbow Nation – Your Free Comprehensive Guide" />
            </p>
          </div>
          {footerNavs.map((nav) => (
            <div key={nav.label}>
              <h3 className="font-headline text-lg font-semibold">
                <Translatable text={nav.label} />
              </h3>
              <ul className="mt-4 space-y-2">
                {nav.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      <Translatable text={item.name} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Travelling South Africa Reborn. All
            rights reserved.
          </p>
          <p className="mt-4 sm:mt-0">Email: ddvprivate@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};
