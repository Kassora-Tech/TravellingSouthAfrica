"use client";

import { Button } from '@/components/ui/button';
import { Translatable } from '@/components/translatable';
import { Calculator, ListChecks, Languages, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ctaItems = [
  {
    icon: ListChecks,
    title: 'Plan Your Trip',
    description: 'Create and save your personalized South African travel itineraries with ease.',
    href: '/plan-your-trip',
    buttonText: 'Start Planning',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Calculator,
    title: 'Convert Currency',
    description: 'Get up-to-date exchange rates before and during your trip.',
    href: '/service-providers/currency-converter',
    buttonText: 'Convert Now',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Languages,
    title: 'SA Slang Guide',
    description: 'Learn the local lingo and connect with South Africans like a local.',
    href: '/service-providers/slang',
    buttonText: 'Learn Slang',
    gradient: 'from-orange-500 to-rose-600',
    bgLight: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

export function CallToActions() {
  return (
    <section id="cta" className="bg-gray-50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Travel Smarter
          </p>
          <h2 className="text-4xl font-bold font-headline md:text-5xl text-gray-900">
            <Translatable text="Everything You Need" />
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            <Translatable text="Tools and resources to make your South African adventure unforgettable." />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ctaItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={item.href} className="group block h-full">
                <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
                  {/* Icon */}
                  <div className={`${item.bgLight} rounded-2xl p-4 w-fit mb-6`}>
                    <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-headline text-2xl font-bold text-gray-900 mb-3">
                    <Translatable text={item.title} />
                  </h3>
                  <p className="text-gray-500 flex-grow leading-relaxed">
                    <Translatable text={item.description} />
                  </p>

                  {/* CTA */}
                  <div className="mt-8 flex items-center gap-2 font-semibold text-gray-900 group-hover:gap-3 transition-all duration-300">
                    <span><Translatable text={item.buttonText} /></span>
                    <ArrowRight className={`h-4 w-4 ${item.iconColor} transition-transform group-hover:translate-x-1`} />
                  </div>

                  {/* Bottom gradient bar */}
                  <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}