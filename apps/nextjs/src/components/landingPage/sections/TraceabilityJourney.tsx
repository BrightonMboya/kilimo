"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import MouseFollow from '~/components/landingPage/animations/MouseFollow';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface TraceabilityJourneyProps {
  className?: string;
}

export default function TraceabilityJourney({ className }: TraceabilityJourneyProps) {
  const t = useTranslations('traceability');
  const containerRef = useRef<HTMLDivElement>(null);

  const journeyItems = [
    { id: 1, title: t('item1.title'), description: t('item1.description') },
    { id: 2, title: t('item2.title'), description: t('item2.description') },
    { id: 3, title: t('item3.title'), description: t('item3.description') },
    { id: 4, title: t('item4.title'), description: t('item4.description') },
    { id: 5, title: t('item5.title'), description: t('item5.description') },
  ];
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Item 0 transforms - starts off-screen, moves to centered position (-240px from center)
  const item0Progress = useTransform(scrollYProgress, [0 / journeyItems.length, 1 / journeyItems.length], [0, 1]);
  const item0Y = useTransform(scrollYProgress, [0, 0.5 / journeyItems.length, 1], [800, 130, 130]);
  const item0LeftOpacity = useTransform(item0Progress, [0, 0.5, 1], [0, 1, 1]);
  const item0RightOpacity = useTransform(item0Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const item0Scale = useTransform(item0Progress, [0, 0.5, 1], [0.8, 1, 1]);

  // Item 1 transforms - starts off-screen, moves to centered position (-120px from center)
  const item1Progress = useTransform(scrollYProgress, [1 / journeyItems.length, 2 / journeyItems.length], [0, 1]);
  const item1Y = useTransform(scrollYProgress, [0, 1 / journeyItems.length, 1.5 / journeyItems.length, 1], [800, 800, 260, 260]);
  const item1LeftOpacity = useTransform(item1Progress, [0, 0.5, 1], [0, 1, 1]);
  const item1RightOpacity = useTransform(item1Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const item1Scale = useTransform(item1Progress, [0, 0.5, 1], [0.8, 1, 1]);

  // Item 2 transforms - starts off-screen, moves to center (0px from center)
  const item2Progress = useTransform(scrollYProgress, [2 / journeyItems.length, 3 / journeyItems.length], [0, 1]);
  const item2Y = useTransform(scrollYProgress, [0, 2 / journeyItems.length, 2.5 / journeyItems.length, 1], [800, 800, 390, 390]);
  const item2LeftOpacity = useTransform(item2Progress, [0, 0.5, 1], [0, 1, 1]);
  const item2RightOpacity = useTransform(item2Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const item2Scale = useTransform(item2Progress, [0, 0.5, 1], [0.8, 1, 1]);

  // Item 3 transforms - starts off-screen, moves to centered position (120px from center)
  const item3Progress = useTransform(scrollYProgress, [3 / journeyItems.length, 4 / journeyItems.length], [0, 1]);
  const item3Y = useTransform(scrollYProgress, [0, 3 / journeyItems.length, 3.5 / journeyItems.length, 1], [800, 800, 520, 520]);
  const item3LeftOpacity = useTransform(item3Progress, [0, 0.5, 1], [0, 1, 1]);
  const item3RightOpacity = useTransform(item3Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const item3Scale = useTransform(item3Progress, [0, 0.5, 1], [0.8, 1, 1]);

  // Item 4 transforms - starts off-screen, moves to centered position (240px from center)
  const item4Progress = useTransform(scrollYProgress, [4 / journeyItems.length, 5 / journeyItems.length], [0, 1]);
  const item4Y = useTransform(scrollYProgress, [0, 4 / journeyItems.length, 4.5 / journeyItems.length, 1], [800, 800, 650, 650]);
  const item4LeftOpacity = useTransform(item4Progress, [0, 0.5, 1], [0, 1, 1]);
  const item4RightOpacity = useTransform(item4Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const item4Scale = useTransform(item4Progress, [0, 0.5, 1], [0.8, 1, 1]);

  const itemTransforms = [
    { y: item0Y, leftOpacity: item0LeftOpacity, rightOpacity: item0RightOpacity, scale: item0Scale },
    { y: item1Y, leftOpacity: item1LeftOpacity, rightOpacity: item1RightOpacity, scale: item1Scale },
    { y: item2Y, leftOpacity: item2LeftOpacity, rightOpacity: item2RightOpacity, scale: item2Scale },
    { y: item3Y, leftOpacity: item3LeftOpacity, rightOpacity: item3RightOpacity, scale: item3Scale },
    { y: item4Y, leftOpacity: item4LeftOpacity, rightOpacity: item4RightOpacity, scale: item4Scale },
  ];

  return (
    <div ref={containerRef} className='relative h-[600vh] z-11'>

      <div className='sticky top-0 h-screen w-screen flex justify-start items-center overflow-hidden bg-white'>
        <div className='w-1/2 h-screen relative flex justify-center items-center'>
          <Image
            src={"/static/images/why-jani-bg.jpg"}
            alt='Why Jani Backgound'
            fill
            className='object-cover'
            style={{ zIndex: 0 }}
            priority
            loading="eager"
          />
          <div className="absolute inset-0 backdrop-blur-lg  flex justify-center items-center z-10">
            <div className='w-full h-full flex justify-center items-center'>
              <div className='flex justify-center items-center h-full w-full'>
                <p className='font-bold text-white text-responsive-9xl p-4 cursor-expand font-impact uppercase tracking-[0.1rem]'>
                  {t('title')}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Left side - Stacked IDs and Titles */}
        <div className='w-1/2 relative h-screen flex flex-row justify-center m-4'>
          
          {journeyItems.map((item, index) => (
            <motion.div
              key={item.id}
              style={{ y: itemTransforms[index].y, opacity: itemTransforms[index].leftOpacity }}
              className='absolute h-fit flex flex-col justify-center  items-center gap-4 border-b w-full p-4'
            >
              <h3 className='text-responsive-3xl md:text-4xl font-bold text-green-700 cursor-expand p-2'>{item.title}</h3>
              {/* Right side - Description */}
              <div className='flex  items-center justify-center px-4'>
                <div className='relative w-full flex justify-center items-center '>
                    <motion.div
                      key={item.id}
                      style={{ opacity: itemTransforms[index].leftOpacity, scale: itemTransforms[index].scale }}
                      className='w-full flex justify-center items-center'
                    >
                      <p className='text-x md:text-2xl text-gray-600 whitespace-nowrap'>{item.description}</p>
                    </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
