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
        <section className='relative w-screen h-screen flex flex-col overflow-hidden p-4 py-10 pb-30 bg-white z-11'>
            <div className='w-full h-1/7 gap-2 mt-10 flex justify-between text-[50px] font-light  p-4 flex-row  whitespace-nowrap'>
                <ParallaxAnimation speed={1.5} className=' h-full w-fit flex flex-row justify-center items-center'>
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
                <ParallaxAnimation speed={1.5} className='w-full h-full flex justify-center items-center font-bold text-green-700'>
                    <p>
                        {t('ourValueChains')}
                    </p>
                </ParallaxAnimation>
                <ParallaxAnimation speed={1} className=' h-full w-fit flex flex-row justify-center items-center'>
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
            <div className='w-full h-5/6 flex gap-2 pr-10 pl-6 overflow-visible'>
                <motion.div 
                    className='h-full w-1/5 flex items-start'
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
                    className='h-full w-3/5'
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
                    className='h-full w-1/5 flex items-end'
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
            <div className='w-full h-1/6 gap-10 flex justify-between text-[50px] font-light  p-4 flex-row whitespace-nowrap'>
                <ParallaxAnimation speed={1} className=' h-full w-fit flex flex-row justify-center items-center'>
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
                <div className='h-full w-full flex justify-center items-center gap-2'>
                    {products.map((product, index) => {
                        const isActive = index === currentIndex;
                        const size = isActive ? 'w-[5vw] h-[5vw]' : 'w-[4vw] h-[4vw]';
                        const blend = isActive ? 'mix-blend-normal' : 'mix-blend-luminosity';
                        
                        return (
                            <motion.div 
                                key={index} 
                                className={`${size} ${blend} cursor-expand relative overflow-hidden cursor-pointer hover:mix-blend-normal transition-all duration-300`}
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
                <ParallaxAnimation speed={1.5} className=' h-full w-fit flex flex-row justify-center items-center'>
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
