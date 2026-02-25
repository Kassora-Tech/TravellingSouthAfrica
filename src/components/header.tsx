"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Translatable } from './translatable';
import { useUser } from '@/firebase';
import { UserNav } from './auth/user-nav';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/provinces', label: 'Provinces' },
  { href: '/towns', label: 'Towns' },
  { href: '/sights', label: 'Sights' },
  { href: '/routes', label: 'Routes' },
  { href: '/plan-your-trip', label: 'Plan My Trip' },
  { href: '/accommodations', label: 'Accommodations' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(50);
  const { user, isUserLoading } = useUser();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <Logo className="h-16 w-auto" />
          </Link>

          <nav className="hidden items-center space-x-1 lg:space-x-2 md:flex">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>
                  <Translatable text={link.label} />
                </Link>
              </Button>
            ))}
            <Button variant="ghost" asChild>
                <Link href="/add-your-listing"><Translatable text="Add Your Listing" /></Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/service-providers"><Translatable text="Service Providers" /></Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/contact"><Translatable text="Contact" /></Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isUserLoading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
                <UserNav />
            ) : (
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login"><Translatable text="Login" /></Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup"><Translatable text="Sign Up" /></Link>
                    </Button>
                </div>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="p-4">
                    <div className="mb-8 flex justify-between items-center">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            <Logo className="h-16 w-auto" />
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>
                  <nav className="flex flex-col space-y-4">
                    {[...navLinks, { href: '/add-your-listing', label: 'Add Your Listing' }, { href: '/service-providers', label: 'Service Providers' }].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium"
                      >
                        <Translatable text={link.label} />
                      </Link>
                    ))}
                     <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium"
                      >
                        <Translatable text="Contact" />
                      </Link>
                    
                    {isUserLoading ? (
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4" />
                    ) : user ? (
                         <Button asChild size="lg" className="mt-4">
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}><Translatable text="My Dashboard" /></Link>
                        </Button>
                    ) : (
                        <div className="flex flex-col space-y-2 mt-4">
                             <Button asChild size="lg" variant="outline">
                                <Link href="/login" onClick={() => setIsOpen(false)}><Translatable text="Login" /></Link>
                            </Button>
                             <Button asChild size="lg">
                                <Link href="/signup" onClick={() => setIsOpen(false)}><Translatable text="Sign Up" /></Link>
                            </Button>
                        </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
