'use client';

import { useEffect } from 'react';

export default function InfiniteScroll() {
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;

    let loopPoint = 0;
    
    const calculateLoopPoint = () => {
      const section = document.getElementById('content-section-1');
      const spacer = section?.nextElementSibling;
      
      if (section && spacer) {
        loopPoint = section.offsetTop + section.offsetHeight + (spacer as HTMLElement).offsetHeight;
      }
    };

    setTimeout(calculateLoopPoint, 500);
    window.addEventListener('resize', calculateLoopPoint);

    const checkScroll = () => {
      if (loopPoint === 0) return;

      const currentScroll = lenis.scroll;
      
      if (currentScroll >= loopPoint - 5) {
        lenis.scrollTo(0, {
          immediate: true,
          force: true,
        });
      }
    };

    const intervalId = setInterval(checkScroll, 16);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', calculateLoopPoint);
    };
  }, []);

  return null;
}
