'use client';

import { motion } from 'framer-motion';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';

interface WePowerProps {
  className?: string;
}

const stakeholders = [
  'Farmers',
  'Growers',
  'Cooperatives',
  'Exporters',
];

export default function WePower({ className }: WePowerProps) {
  return (
    <section className={`w-screen py-20 px-4 md:px-8 lg:px-16 bg-[#10B248] ${className}`}>
      <div className='max-w-7xl mx-auto'>
        <ParallaxAnimation speed={0.3} className='text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-5xl md:text-7xl font-impact text-white mb-12'
          >
            We power
          </motion.h2>
          
          <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-16'>
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={stakeholder}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className='text-4xl md:text-5xl lg:text-6xl font-bold text-white'
              >
                {stakeholder}
              </motion.div>
            ))}
          </div>
        </ParallaxAnimation>
      </div>
    </section>
  );
}
