 'use client';

import { motion } from 'framer-motion';
import Button from '~/components/landingPage/ui/Button';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';
import { useTranslations } from 'next-intl';

interface FinalCTAProps {
  className?: string;
}

export default function FinalCTA({ className }: FinalCTAProps) {
  const t = useTranslations('finalCta');

  const handleWaitListClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'join_waitlist_click', {
        event_category: 'CTA',
        event_label: t('ctaLabel'),
        value: 'https://szan6fk6p17.typeform.com/to/d2P3Z44V'
      });
    }
  }
  return (
    <section className={`relative h-screen w-screen flex justify-center items-center py-24 px-4 md:px-8 lg:px-16 bg-white ${className}`}>
      <div className=' gradient_gradient__buN4_'/>
      <ParallaxAnimation speed={0.3} className='max-w-5xl mx-auto text-center flex flex-col gap-8 z-20'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-responsive-5xl lg:text-6xl font-bold text-gray-900'
        >
          {t('title')}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'
        >
          <a
            href="https://szan6fk6p17.typeform.com/to/d2P3Z44V"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit h-fit text-3xl flex justify-center items-center gap-2"
            onClick={handleWaitListClick}
          >
            <Button size='lg' variant='primary'>
              {t('requestPilot')}
            </Button>
            {/* <Button size='lg' variant='secondary'>
              Join Waitlist
            </Button> */}
          </a>
        </motion.div>
      </ParallaxAnimation>
    </section>
  );
}
