"use client";

import { useInView, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Translatable } from '../translatable';
import { Map, Building2, Camera, Route } from 'lucide-react';

const stats = [
  { value: 9, label: 'Provinces', plus: false, icon: Map, description: 'Unique provinces to explore' },
  { value: 800, label: 'Towns', plus: true, icon: Building2, description: 'Charming towns to discover' },
  { value: 100, label: 'Iconic Sights', plus: true, icon: Camera, description: 'Must-see attractions' },
  { value: 10, label: 'Major Routes', plus: true, icon: Route, description: 'Scenic driving routes' },
];

function AnimatedCounter({ to, plus, isInView }: { to: number, plus?: boolean, isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const animation = {
      startTime: 0,
      duration: 2000,
      rafId: 0,
    };
    const step = (timestamp: number) => {
      if (!animation.startTime) animation.startTime = timestamp;
      const progress = Math.min((timestamp - animation.startTime) / animation.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * to));
      if (progress < 1) animation.rafId = requestAnimationFrame(step);
    };
    animation.rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation.rafId);
  }, [to, isInView]);

  return <span>{count}{plus && '+'}</span>;
}

export function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            By The Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">
            <Translatable text="South Africa At A Glance" />
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/20 rounded-full p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {isInView ? (
                    <AnimatedCounter to={stat.value} plus={stat.plus} isInView={isInView} />
                  ) : '0'}
                </p>
                <p className="mt-2 text-white font-semibold text-lg">
                  <Translatable text={stat.label} />
                </p>
                <p className="mt-1 text-white/50 text-xs">
                  <Translatable text={stat.description} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
