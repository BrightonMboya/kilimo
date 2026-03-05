"use client";

import { motion } from 'framer-motion';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';
import { useTranslations } from 'next-intl';

interface JoinJaniProps {
  className?: string;
}

export default function JoinJani({ className }: JoinJaniProps) {
  const t = useTranslations('joinJani');
  const steps = [
    {
      number: 1,
      title: t('steps.step1.title'),
      description: t('steps.step1.description')
    },
    {
      number: 2,
      title: t('steps.step2.title'),
      description: t('steps.step2.description')
    },
    {
      number: 3,
      title: t('steps.step3.title'),
      description: t('steps.step3.description')
    }
  ];

  return (
    <section className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-green-800 px-4 py-16 text-white md:h-screen md:px-8 md:py-20 lg:px-16 ${className}`}>
      <span className='absolute left-0 top-0'>
        <svg width="2000" height="1200" viewBox="0 0 2000 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="800" r="300" stroke="white" strokeOpacity="0.08" strokeWidth="80" />
          <circle cx="1700" cy="200" r="220" stroke="white" strokeOpacity="0.10" strokeWidth="60" />
          <circle cx="1700" cy="600" r="400" stroke="white" strokeOpacity="0.08" strokeWidth="100" />
          <circle cx="100" cy="442" r="138" stroke="white" strokeOpacity="0.04" strokeWidth="50" />
          <circle cx="446" r="39" stroke="white" strokeOpacity="0.04" strokeWidth="20" />
          <path d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z" stroke="white" strokeOpacity="0.08" strokeWidth="12" />
          <path d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z" stroke="white" strokeOpacity="0.08" strokeWidth="12" />
          <path d="M600 300L550 200L700 250L600 300Z" stroke="white" strokeOpacity="0.10" strokeWidth="14" />
          <path d="M1200 800L1100 700L1300 750L1200 800Z" stroke="white" strokeOpacity="0.12" strokeWidth="16" />
          <path d="M1700 400L1600 350L1800 370L1700 400Z" stroke="white" strokeOpacity="0.09" strokeWidth="13" />
          <path d="M400 1000L350 900L500 950L400 1000Z" stroke="white" strokeOpacity="0.11" strokeWidth="15" />
        </svg>
      </span>
      <ParallaxAnimation speed={-3} className='z-11 mx-auto flex w-full max-w-7xl flex-col gap-8'>
        {/* Header */}
          <div className='text-center flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-center gap-2 md:gap-4'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-responsive-9xl font-impact p-2 cursor-expand'
            >
              {t('join')}
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-responsive-9xl font-impact p-2'
            >
              {t('our')}
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-responsive-9xl cursor-expand font-impact p-2'
            >
              {t('jani')}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-xl md:text-4xl'
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Steps */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className='flex flex-col items-center text-center'
            >
              <div className='w-20 h-20 md:w-24 md:h-24 rounded-full border-white border-2 flex items-center justify-center mb-2'>
                <span className='text-4xl md:text-5xl font-impact text-white'>
                  {step.number}
                </span>
              </div>
              <h3 className='text-3xl md:text-4xl font-bold  mb-3 cursor-expand p-2'>
                {step.title}
              </h3>
              <p className='text-lg md:text-xl  max-w-sm'>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </ParallaxAnimation>
    </section>
  );
}
