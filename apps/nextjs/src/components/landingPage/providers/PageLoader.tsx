'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  children: React.ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 1500;

    setProgress(10);

    setTimeout(() => {
      const images = Array.from(document.images);
      const totalImages = images.length;

      if (totalImages === 0) {
        let currentProgress = 10;
        const progressInterval = setInterval(() => {
          currentProgress += 15;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);
            setTimeout(() => setIsLoading(false), remaining);
          }
          setProgress(currentProgress);
        }, 100);
        return;
      }

      let loadedImages = 0;

      const imageLoaded = () => {
        loadedImages++;
        const percentComplete = Math.round(10 + (loadedImages / totalImages) * 90);
        setProgress(percentComplete);

        if (loadedImages === totalImages) {
          setImagesLoaded(true);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minDisplayTime - elapsed);
          
          setTimeout(() => {
            setIsLoading(false);
          }, remaining);
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          imageLoaded();
        } else {
          img.addEventListener('load', imageLoaded);
          img.addEventListener('error', imageLoaded);
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener('load', imageLoaded);
          img.removeEventListener('error', imageLoaded);
        });
      };
    }, 100);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='mb-8'
            >
              <div className='text-responsive-6xl font-impact text-green-600'>JANI</div>
            </motion.div>

            <div className='w-64 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className='h-full bg-green-600'
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='mt-4 text-gray-600 font-medium'
            >
              {progress}%
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {!isLoading && (
          <motion.div
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ duration: 2.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
