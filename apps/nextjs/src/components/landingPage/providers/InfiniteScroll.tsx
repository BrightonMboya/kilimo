'use client';

import { useEffect } from 'react';

export default function InfiniteScroll() {
  useEffect(() => {
    let loopPoint = 0;
    let lenisInstance: any = null;
    let detachLenisListener: (() => void) | null = null;

    const getCurrentScroll = () => {
      const lenis = (window as any).lenis;
      if (lenis) return lenis.scroll ?? 0;
      return window.scrollY ?? document.documentElement.scrollTop ?? 0;
    };

    const scrollToTop = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, {
          immediate: true,
          force: true,
        });
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    };

    const calculateLoopPoint = () => {
      const section = document.getElementById('content-section-1');
      const spacer = section?.nextElementSibling;
      const documentBottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      if (section && spacer) {
        const sectionBottom = section.offsetTop + section.offsetHeight + (spacer as HTMLElement).offsetHeight;
        loopPoint = Math.max(sectionBottom, documentBottom);
        return;
      }

      loopPoint = documentBottom;
    };

    const checkScroll = () => {
      if (loopPoint === 0) return;

      const currentScroll = getCurrentScroll();
      if (currentScroll >= loopPoint - 8) {
        scrollToTop();
      }
    };

    const attachLenisIfReady = () => {
      const nextLenis = (window as any).lenis;
      if (!nextLenis || lenisInstance === nextLenis) return;

      if (detachLenisListener) {
        detachLenisListener();
        detachLenisListener = null;
      }

      lenisInstance = nextLenis;
      if (typeof nextLenis.on === 'function' && typeof nextLenis.off === 'function') {
        const onLenisScroll = () => checkScroll();
        nextLenis.on('scroll', onLenisScroll);
        detachLenisListener = () => nextLenis.off('scroll', onLenisScroll);
      }
    };

    calculateLoopPoint();
    setTimeout(calculateLoopPoint, 250);
    setTimeout(calculateLoopPoint, 1000);

    window.addEventListener('resize', calculateLoopPoint);
    window.addEventListener('scroll', checkScroll, { passive: true });

    // Lenis may be initialized slightly after this effect.
    const lenisPollId = setInterval(attachLenisIfReady, 250);
    const checkIntervalId = setInterval(checkScroll, 120);

    return () => {
      clearInterval(lenisPollId);
      clearInterval(checkIntervalId);
      if (detachLenisListener) detachLenisListener();
      window.removeEventListener('resize', calculateLoopPoint);
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return null;
}
