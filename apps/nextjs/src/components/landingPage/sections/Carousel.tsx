"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ParallaxAnimation from '~/components/landingPage/animations/ParallaxAnimation';
import { useTranslations } from 'next-intl';

interface CarouselProps {
  className?: string;
}

const products = [
    { src: '/static/images/Olive-Oil.jpeg', key: 'olive' },
    { src: '/static/images/CoffeeJani.jpg', key: 'coffee' },
    { src: '/static/images/TeaJani.jpg', key: 'tea' },
    { src: '/static/images/FruitsJani.jpg', key: 'fruits' },
    { src: '/static/images/Vegetables.jpeg', key: 'vegetables' },
    { src: '/static/images/CerealsJani.jpg', key: 'cereals' },
];

export default function Carousel({ className }: CarouselProps) {
    const t = useTranslations('carousel');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const startInterval = () => {
        // Clear existing interval if any
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Start new interval
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000); // Change every 5 seconds
    };
    
    useEffect(() => {
        if (!isHovered) {
            startInterval();
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovered]);
    
    const handleClick = (index: number) => {
        setCurrentIndex(index);
        startInterval(); // Reset interval on click
    };
    
    return (
        <section className='relative z-11 flex min-h-[100svh] w-full flex-col overflow-hidden bg-white px-3 pb-8 pt-24 md:h-screen md:px-4 md:py-10 md:pb-30'>
            <div className='mt-2 flex h-fit w-full flex-row items-center justify-center gap-2 p-2 text-3xl font-light md:mt-10 md:h-1/7 md:justify-between md:p-4 md:text-[50px]'>
                <ParallaxAnimation speed={1.5} className='hidden h-full w-fit flex-row items-center justify-center md:flex'>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`top-left-${currentIndex}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t(`products.${products[currentIndex].key}`)}
                        </motion.p>
                    </AnimatePresence>
                </ParallaxAnimation>
                <ParallaxAnimation speed={1.5} className='flex h-full w-full items-center justify-center font-bold text-green-700'>
                    <p>
                        {t('ourValueChains')}
                    </p>
                </ParallaxAnimation>
                <ParallaxAnimation speed={1} className='hidden h-full w-fit flex-row items-center justify-center md:flex'>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`top-right-${currentIndex}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t(`products.${products[currentIndex].key}`)}
                        </motion.p>
                    </AnimatePresence>
                </ParallaxAnimation>
            </div>
            <div className='flex h-full w-full flex-col gap-2 overflow-visible md:h-5/6 md:flex-row md:pl-6 md:pr-10'>
                <motion.div 
                    className='hidden h-full w-1/5 items-start md:flex'
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <ParallaxAnimation speed={1} className='w-full h-1/2  relative overflow-hidden '>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: -500 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -500 }}
                                transition={{ duration: 0.8 }}
                                className='absolute inset-0'
                            >
                                <Image
                                    src={products[currentIndex].src}
                                    alt={t(`products.${products[currentIndex].key}`)}
                                    fill
                                    className='object-cover'
                                />
                            </motion.div>
                        </AnimatePresence>
                    </ParallaxAnimation>
                </motion.div>
                <motion.div 
                    className='h-[58svh] w-full md:h-full md:w-3/5'
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className='w-full h-full  relative overflow-hidden '>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`main-${currentIndex}`}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6 }}
                                className='absolute inset-0'
                            >
                                <Image
                                    src={products[currentIndex].src}
                                    alt={t(`products.${products[currentIndex].key}`)}
                                    fill
                                    className='object-cover'
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
                <motion.div 
                    className='hidden h-full w-1/5 items-end md:flex'
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <ParallaxAnimation speed={2.5} className='w-full h-1/2  relative overflow-hidden '>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`right-${currentIndex}`}
                                initial={{ opacity: 0, x: 500 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 500 }}
                                transition={{ duration: 0.8 }}
                                className='absolute inset-0'
                            >
                                <Image
                                    src={products[currentIndex].src}
                                    alt={t(`products.${products[currentIndex].key}`)}
                                    fill
                                    className='object-cover'
                                />
                            </motion.div>
                        </AnimatePresence>
                    </ParallaxAnimation>
                </motion.div>
            </div>
            <div className='flex h-fit w-full flex-row items-center justify-center gap-4 p-2 text-3xl font-light md:h-1/6 md:justify-between md:gap-10 md:p-4 md:text-[50px]'>
                <ParallaxAnimation speed={1} className='hidden h-full w-fit flex-row items-center justify-center md:flex'>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`bottom-left-${currentIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t(`products.${products[currentIndex].key}`)}
                        </motion.p>
                    </AnimatePresence>
                </ParallaxAnimation>
                <div className='flex h-full w-full flex-wrap items-center justify-center gap-2 md:flex-nowrap'>
                    {products.map((product, index) => {
                        const isActive = index === currentIndex;
                        const size = isActive ? 'h-16 w-16 md:h-[5vw] md:w-[5vw]' : 'h-14 w-14 md:h-[4vw] md:w-[4vw]';
                        const blend = isActive ? 'mix-blend-normal' : 'mix-blend-luminosity';
                        
                        return (
                            <motion.div 
                                key={index} 
                                className={`${size} ${blend} relative cursor-expand cursor-pointer overflow-hidden transition-all duration-300 hover:mix-blend-normal`}
                                onClick={() => handleClick(index)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{ 
                                    duration: 0.5, 
                                    ease: "easeInOut",
                                    delay: index * 0.1,
                                }}
                            >
                                <Image
                                    src={product.src}
                                    alt={t(`products.${product.key}`)}
                                    fill
                                    className='object-cover'
                                />
                            </motion.div>
                        );
                    })}
                </div>
                <ParallaxAnimation speed={1.5} className='hidden h-full w-fit flex-row items-center justify-center md:flex'>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`bottom-right-${currentIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t(`products.${products[currentIndex].key}`)}
                        </motion.p>
                    </AnimatePresence>
                </ParallaxAnimation>
            </div>
        </section>
    );
}
