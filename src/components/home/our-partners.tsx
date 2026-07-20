import Image from 'next/image';
import { Translatable } from '@/components/translatable';

const partners = [
  {
    alt: 'Life&Leisure Club logo',
    image: '/Images/partners/life-and-leisure-club.jpg',
    width: 240,
    height: 240,
  },
  {
    alt: 'ontbyt SAKE logo',
    image: '/Images/partners/ontbyt SAKE.jpeg',
    width: 222,
    height: 300,
  },
  {
    alt: 'super SAKE logo',
    image: '/Images/partners/super SAKE.jpeg',
    width: 223,
    height: 300,
  },
];

export function OurPartners() {
  return (
    <section id="partners" className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            <Translatable text="In Good Company" />
          </p>
          <h2 className="text-4xl font-bold font-headline md:text-5xl text-gray-900">
            <Translatable text="Our Partners" />
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            <Translatable text="Proudly working together to showcase the best of South Africa." />
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.image}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex items-center justify-center"
            >
              <Image
                src={partner.image}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="h-28 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
