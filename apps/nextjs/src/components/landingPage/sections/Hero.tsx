'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '~/components/landingPage/ui';
import { ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';
import { useTranslations } from 'next-intl';

interface HeroProps {
  className?: string;
}

// roles are provided by translations so they change with locale

export default function Hero({ className }: HeroProps) {
  const t = useTranslations('hero');
  const roleKeys = ['exporters', 'growers', 'coops', 'farmers', 'millers'];
  const roles = roleKeys.map((k) => t(`roles.${k}`));
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const isFirstRender = useRef(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [canStart, setCanStart] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleBookDemoClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'book_demo_click', {
        event_category: 'CTA',
        event_label: 'Book a Demo',
        value: 'https://cal.com/brightonmboya'
      });
    }
  };

  useEffect(() => {
      isFirstRender.current = false;

    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkPosition = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsAtTop(rect.top >= -10 && rect.top <= 10);
        setCanStart(rect.top <= 0)
      }
    };

    checkPosition();

    window.addEventListener('scroll', checkPosition);
    
    const intervalId = setInterval(checkPosition, 100);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div ref={heroRef} className='relative z-[100] h-[100svh] min-h-[100svh] w-full overflow-hidden'>
      <div className="absolute h-full w-full">
        <div className="h-full w-full overflow-hidden">
          <Image
              src="/static/images/Hero-bg.jpg"
              alt="Green Farm"
              fill
              priority
              className="object-cover scale-110"
          />
        </div>
      </div>
        <div className='relative z-10 flex h-full w-full flex-col items-center justify-center px-3 pb-8 pt-24 md:pt-25'>
            <ParallaxAnimation speed={ 2 } className='flex h-fit w-full flex-col items-center justify-center gap-3 p-3 text-white md:gap-4 md:p-4'>
                <div className='w-fit h-fit p-2 cursor-expand'>
                  <p className='text-center font-medium text-responsive-6xl'>{t('powering')}</p>
                </div>
                <div className='w-fit h-fit overflow-visible cursor-expand'>
                    <AnimatePresence mode="wait">
                        <motion.p
                          key={roles[currentRoleIndex]}
                            initial={isFirstRender.current ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className='p-2 text-center font-impact text-responsive-10xl font-extrabold uppercase'
                        >
                          {roles[currentRoleIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className='flex h-fit w-fit flex-col items-center justify-center gap-1'>
                    <p className='cursor-expand p-2 text-responsive-5xl text-center font-impact font-bold uppercase'>{t('trace')}</p>
                    <p className='p-2 text-center text-responsive-4xl font-medium md:whitespace-nowrap'>{t('foodFrom')}</p>
                    <div className='flex flex-row flex-wrap justify-center items-center'>
                      <p className='cursor-expand p-2 text-responsive-5xl text-center font-impact font-bold uppercase'>{t('farm')}</p>
                      <p className='p-2 text-responsive-4xl text-center font-medium md:whitespace-nowrap'>{t('to')}</p>
                      <p className='cursor-expand p-2 text-responsive-5xl text-center font-impact font-bold uppercase'>{t('fork')}</p>
                    </div>
                </div>
            </ParallaxAnimation>
            <div className='flex h-fit w-full flex-row items-center justify-center gap-2 p-2'>
                <a
                  href="https://cal.com/brightonmboya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-fit w-fit items-center justify-center gap-2"
                  onClick={handleBookDemoClick}
                >
                  <Button variant="ghost" size="md" className='flex h-fit w-fit cursor-expand items-center justify-center gap-2 px-5 text-base md:pl-8 md:text-3xl'>
                    <p>{t('bookDemo')}</p>
                    <ArrowUpRight width={22} height={22} strokeWidth={2.5}/>
                  </Button>
                </a>
            </div>

        </div>
    </div>
  );
}
