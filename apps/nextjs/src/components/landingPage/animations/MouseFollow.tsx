'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MouseFollowProps {
  children: ReactNode;
  strength?: number; // How much the image moves (0.1 = subtle, 0.5 = dramatic)
  className?: string;
}

export default function MouseFollow({ children, strength = 0.2, className = '' }: MouseFollowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate center of container
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate offset from center
      const offsetX = mouseX - centerX;
      const offsetY = mouseY - centerY;

      // Inverse movement: mouse left → image right (negative values)
      const x = -offsetX * strength;
      const y = -offsetY * strength;

      setPosition({ x, y });
    };

    // Listen to mouse move on the entire window
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return (
    <div
      ref={containerRef}
      className={`${className}`}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className='w-full h-full'
      >
        {children}
      </motion.div>
    </div>
  );
}
