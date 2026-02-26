import Link from 'next/link';
import Logo from './logo';
import { Translatable } from './translatable';
import { Facebook, Instagram } from 'lucide-react';

const footerNavs = [
  {
    label: 'Explore',
    items: [
      { href: '/provinces', name: 'Provinces' },
      { href: '/towns', name: 'Towns' },
      { href: '/sights', name: 'Sights' },
      { href: '/routes', name: 'Routes' },
      { href: '/accommodations', name: 'Accommodations' },
    ],
  },
  {
    label: 'Service Providers',
    items: [
      { href: '/plan-your-trip', name: 'Plan Your Trip' },
      { href: '/service-providers/currency-converter', name: 'Currency Converter' },
      { href: '/service-providers/slang', name: 'Slang' },
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

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/travellingsouthafrica.co.za?utm_source=qr&igsh=ZTV6OGM4MWx2MW1r',
    icon: (props: any) => <Instagram {...props} />,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@travellingsouthaf?_r=1&_t=ZS-949r0bDVUzV',
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.6-2.03-2.06-4.84-1.15-7.23.12-.31.25-.62.39-.92.08-.17.15-.34.23-.51.05-.11.1-.22.15-.33.02-.05.04-.1.05-.14l.01-.02.01-.02.01-.02.01-.01c.01 0 .01 0 .01-.01.3-.68.64-1.34 1.02-1.99.31-.52.64-1.03.99-1.52.02-.03.04-.06.06-.09.07-.1.14-.2.21-.3.02-.03.04-.06.05-.08.08-.13.16-.25.24-.38.02-.03.04-.06.06-.09.06-.1.12-.2.18-.3.03-.04.05-.08.08-.12.1-.15.19-.3.29-.44.02-.03.04-.06.06-.09.11-.16.22-.32.33-.48.02-.03.04-.05.05-.08.08-.12.16-.24.24-.36.02-.03.04-.06.06-.08.06-.1.12-.2.18-.29.03-.05.06-.09.09-.14.07-.11.13-.22.2-.33.1-.16.2-.32.31-.47.16-.24.32-.48.48-.72.03-.05.06-.09.09-.14.06-.11.12-.22.18-.33.02-.04.04-.07.06-.11.09-.15.18-.3.27-.45l.03-.05.03-.05c0-.01.01-.01.01-.02zM7.99 15.86c.01-.02.01-.03.02-.05.02-.04.03-.08.05-.12.02-.04.03-.07.05-.11.18-.38.39-.76.61-1.13.18-.31.37-.62.56-.92.36-.59.78-1.15 1.25-1.68.24-.26.5-.52.76-.77.02-.02.03-.03.05-.05.21-.19.42-.38.64-.56.45-.37.91-.71 1.4-1.02.2-.12.4-.24.6-.35.19-.11.38-.22.57-.33l.01-.01c.02-.01.03-.02.05-.03.11-.06.22-.12.33-.18.03-.02.06-.03.1-.05.08-.04.17-.08.25-.12.38-.17.77-.32 1.16-.45v-3.46c-.94.13-1.86.51-2.66 1.11-1.29.98-2.34 2.29-3.1 3.79-.19.38-.37.76-.53 1.15-.07.16-.13.33-.2.49-.12.29-.23.59-.34.88-.07.19-.14.38-.2.57-.04.11-.07.22-.11.33-.09.25-.18.49-.26.74l-.07.22-.05.16-.04.12-.01.04-.01.03c-.01.04-.02.07-.03.11-.03.1-.06.2-.09.29-.02.06-.04.11-.06.17-.01.03-.02.06-.03.09v.01c-.02.06-.03.11-.05.17-.01.03-.02.05-.02.08-.03.09-.06.18-.08.27-.02.06-.03.12-.05.18-.01.03-.02.06-.03.1-.01.03-.01.06-.02.09-.01.04-.02.09-.03.13-.01.03-.01.06-.02.09-.01.03-.02.06-.03.1-.03.11-.06.22-.08.33l-.02.08c-.01.04-.02.08-.03.12-.03.12-.05.24-.07.36-.01.04-.02.09-.03.13z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Travellingsouthafricacoza/61586123114017/?rdid=ac4Uq7NU11pGCXAW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BvH8jhpno%2F',
    icon: (props: any) => <Facebook {...props} />,
  },
  {
    name: 'Pinterest',
    href: 'https://za.pinterest.com/travellingsouthafrica/?invite_code=ce83b92eb4ef48c7a45fd836c5619898&sender=1107674608259442133',
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.017 2.001c-5.485 0-9.94 4.455-9.94 9.94 0 4.35 2.76 8.055 6.596 9.42-.05-.333-.08-.887.02-1.28.09-.38.6-2.55.6-2.55s-.15-.3-.15-.742c0-.695.405-1.215.915-1.215.435 0 .645.33.645.72 0 .435-.27.99-.405 1.53-.12.48.24.87.72.87.87 0 1.545-1.02 1.545-2.385 0-1.26-.87-2.205-2.025-2.205-1.38 0-2.31 1.02-2.31 2.25 0 .285.09.585.225.765.045.06.06.12.03.21-.015.06-.045.18-.06.27-.03.09-.09.12-.18.09-1.05-.36-1.575-1.5-1.575-2.7 0-1.995 1.5-3.795 4.125-3.795 2.1 0 3.705 1.5 3.705 3.45 0 2.115-1.215 3.795-3.03 3.795-.6 0-.96-.48-.81-.99.18-.63.525-1.32.525-1.32.15-.315.09-.27.285-.51.15-.195.27-.375.27-.585 0-.21-.12-.39-.27-.39-.12 0-.225.12-.225.27 0 .15-.06.27-.06.27s-1.02 4.305-1.185 5.105c-.33.9-.06 2.01.6 2.7.75.81 2.025.99 2.85.45 1.155-.75 1.995-2.175 2.295-3.525.21-.99.315-2.025.315-3.09 0-5.325-4.065-9.75-9.33-9.75z" />
      </svg>
    ),
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
            <p className="mt-4 max-w-xs">
              <Translatable text="Your Free Comprehensive Guide to Travelling South Africa" />
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
                      className="hover:text-primary transition-colors"
                    >
                      <Translatable text={item.name} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
          <div className="text-muted-foreground flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="order-2 sm:order-1 mt-4 sm:mt-0">
              &copy; {new Date().getFullYear()} Travelling South Africa Reborn. All
              rights reserved.
            </p>
            <p className="order-1 sm:order-2">Email: maryke@travellingsouthafrica.co.za</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
