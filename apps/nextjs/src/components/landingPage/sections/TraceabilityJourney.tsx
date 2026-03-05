"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface TraceabilityJourneyProps {
  className?: string;
}

export default function TraceabilityJourney({ className }: TraceabilityJourneyProps) {
  const t = useTranslations('traceability');

  const journeyItems = [
    { id: 1, title: t('item1.title'), description: t('item1.description') },
    { id: 2, title: t('item2.title'), description: t('item2.description') },
    { id: 3, title: t('item3.title'), description: t('item3.description') },
    { id: 4, title: t('item4.title'), description: t('item4.description') },
    { id: 5, title: t('item5.title'), description: t('item5.description') },
  ];

  return (
    <section className={`z-11 w-full bg-white px-4 py-14 md:px-8 lg:px-10 ${className ?? ''}`}>
      <div className='mx-auto mb-8 w-full max-w-6xl overflow-hidden rounded-2xl'>
        <div className='relative h-56 w-full md:h-72 lg:h-80'>
          <Image
            src={"/static/images/why-jani-bg.jpg"}
            alt='Why Jani Backgound'
            fill
            className='object-cover'
            priority
            loading="eager"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-4">
            <p className='text-center font-impact text-5xl font-bold uppercase tracking-[0.08rem] text-white md:text-7xl'>
              {t('title')}
            </p>
          </div>
        </div>
      </div>

      <div className='mx-auto flex w-full max-w-6xl flex-col gap-4'>
        {journeyItems.map((item) => (
          <div key={item.id} className='rounded-xl border border-green-200 p-4 md:p-6'>
            <h3 className='mb-2 text-2xl font-bold text-green-700 md:text-3xl'>{item.title}</h3>
            <p className='text-base text-gray-600 md:text-lg'>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
