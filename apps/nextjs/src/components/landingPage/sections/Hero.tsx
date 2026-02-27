'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '~/components/landingPage/ui';
import { ArrowUpRight, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';
import MouseFollow from '~/components/landingPage/animations/MouseFollow';
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
    <div ref={heroRef} className='relative w-full h-screen overflow-hidden z-100'>
      <div className="w-full h-screen absolute">
        <div className="h-full w-full overflow-hidden">
          <Image
              src="/static/images/Hero-bg.jpg"
              alt="Green Farm"
              fill
              priority
              loading="eager"
              className="object-cover scale-110"
          />
        </div>
      </div>
        <div className='w-screen h-full z-10 relative flex flex-col items-center justify-center pt-25'>
            <ParallaxAnimation speed={ 2 } className='w-full h-fit text-white flex flex-col justify-center items-center p-4 gap-4'>
                <div className='w-fit h-fit p-2 cursor-expand'>
                  <p className='font-medium text-responsive-6xl'>{t('powering')}</p>
                </div>
                <div className='w-fit h-fit overflow-visible cursor-expand'>
                    <AnimatePresence mode="wait">
                        <motion.p
                          key={roles[currentRoleIndex]}
                            initial={isFirstRender.current ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className='font-extrabold text-responsive-10xl p-2 uppercase font-impact'
                        >
                          {roles[currentRoleIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className='w-fit h-fit flex flex-col justify-center items-center gap-1'>
                    <p className='font-bold p-2 text-responsive-5xl cursor-expand uppercase font-impact'>{t('trace')}</p>
                    <p className='font-medium p-2 text-responsive-4xl whitespace-nowrap'>{t('foodFrom')}</p>
                    <div className='flex flex-row  justify-center items-center'>
                      <p className='font-bold p-2 text-responsive-5xl cursor-expand uppercase font-impact'>{t('farm')}</p>
                      <p className='font-medium p-2 text-responsive-4xl whitespace-nowrap'>{t('to')}</p>
                      <p className='font-bold p-2 text-responsive-5xl cursor-expand uppercase font-impact'>{t('fork')}</p>
                    </div>
                </div>
            </ParallaxAnimation>
            <div className='w-full h-fit flex flex-row justify-center items-center gap-2 p-2'>
                <a
                  href="https://cal.com/brightonmboya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit h-fit text-3xl flex justify-center items-center gap-2"
                  onClick={handleBookDemoClick}
                >
                  <Button variant="ghost" size="lg" className='w-fit cursor-expand h-fit pl-8 text-3xl flex justify-center items-center gap-2'>
                    <p>{t('bookDemo')}</p>
                    <ArrowUpRight width={30} height={30} strokeWidth={2.5}/>
                  </Button>
                </a>
            </div>

        </div>
    </div>
  );
}
