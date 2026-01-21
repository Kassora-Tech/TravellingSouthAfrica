"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/provinces', label: 'Provinces' },
  { href: '/towns', label: 'Towns' },
  { href: '/sights', label: 'Sights' },
  { href: '/routes', label: 'Routes' },
  { href: '/currency-converter', label: 'Currency' },
  { href: '/directions', label: 'Directions' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(50);

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
            {navLinks.slice(0, 4).map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>
                  {link.label}
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navLinks.slice(4).map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild className="hidden md:inline-flex">
              <Link href="/plan-your-trip">Plan Your Trip</Link>
            </Button>
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
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Button asChild size="lg" className="mt-4">
                        <Link href="/plan-your-trip" onClick={() => setIsOpen(false)}>Plan Your Trip</Link>
                    </Button>
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
