'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isTouchOrCoarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // Keep native scrolling on touch/coarse devices to avoid mobile scroll lock.
    if (isTouchOrCoarse) {
      return;
    }

    const lenis = new Lenis({
      duration: 2,
      lerp: 0.15,
      wheelMultiplier: 1,
      smoothWheel: true,
      // smoothTouch: false,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
