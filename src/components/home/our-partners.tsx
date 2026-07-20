import Image from 'next/image';
import { Translatable } from '@/components/translatable';

const partners = [
  {
    name: 'Life&Leisure Club',
    image: '/Images/partners/life-and-leisure-club.jpg',
  },
  {
    name: 'ontbyt SAKE and super SAKE',
    image: '/Images/partners/ontbyt-sake-super-sake.jpg',
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

        <div className="flex flex-wrap items-center justify-center gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col items-center w-64"
            >
              <div className="relative w-44 h-44">
                <Image
                  src={partner.image}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="176px"
                  className="object-contain"
                />
              </div>
              <p className="mt-4 font-semibold text-gray-900 text-center">
                <Translatable text={partner.name} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
