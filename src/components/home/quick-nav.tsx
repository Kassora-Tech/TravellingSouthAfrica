"use client";

import Link from 'next/link';
import { Globe, Building, Mountain, Map, Wrench, ArrowRight, CalendarDays } from 'lucide-react';
import { Translatable } from '@/components/translatable';
import { motion } from 'framer-motion';

const navItems = [
  {
    icon: Globe,
    title: '9 Provinces',
    description: 'Diverse regions',
    href: '/provinces',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-200',
  },
  {
    icon: Building,
    title: '862 Towns',
    description: 'Cities & villages',
    href: '/towns',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-200',
  },
  {
    icon: Mountain,
    title: 'Sights to See',
    description: 'Top attractions',
    href: '/sights',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'hover:border-orange-200',
  },
  {
    icon: Map,
    title: 'Major Routes',
    description: 'Scenic road trips',
    href: '/routes',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'hover:border-purple-200',
  },
  {
    icon: Wrench,
    title: 'Travel Tools',
    description: 'Plan your trip',
    href: '#cta',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-200',
  },
  {
    icon: CalendarDays,
    title: 'Upcoming Events',
    description: "What's on",
    href: '/events',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'hover:border-cyan-200',
  },
];

export function QuickNav() {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link href={item.href} className="group block h-full">
                <div className={`bg-white rounded-2xl p-5 h-full border border-gray-100 ${item.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center`}>
                  <div className={`${item.bg} rounded-xl p-3 mb-3`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    <Translatable text={item.title} />
                  </h3>
                  <p className="mt-1 text-gray-400 text-xs">
                    <Translatable text={item.description} />
                  </p>
                  <div className={`mt-3 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}