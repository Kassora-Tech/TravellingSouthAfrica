"use client";

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Translatable } from '../translatable';

const stats = [
  { value: 9, label: 'Provinces' },
  { value: 800, label: 'Towns', plus: true },
  { value: 100, label: 'Iconic Sights', plus: true },
  { value: 10, label: 'Major Routes', plus: true },
];

function AnimatedCounter({ to, plus }: { to: number, plus?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const animation = {
      startTime: 0,
      duration: 2000,
      rafId: 0,
    };

    const step = (timestamp: number) => {
      if (!animation.startTime) {
        animation.startTime = timestamp;
      }
      const progress = Math.min((timestamp - animation.startTime) / animation.duration, 1);
      const currentCount = Math.floor(progress * to);
      setCount(currentCount);

      if (progress < 1) {
        animation.rafId = requestAnimationFrame(step);
      }
    };
    
    animation.rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animation.rafId);
  }, [to]);

  return <span>{count}{plus && '+'}</span>;
}

export function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="bg-secondary py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                {isInView ? <AnimatedCounter to={stat.value} plus={stat.plus} /> : 0}
              </p>
              <p className="mt-2 text-muted-foreground">
                <Translatable text={stat.label} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
