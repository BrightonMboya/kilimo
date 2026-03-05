"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const verticalRef1 = useRef<HTMLDivElement>(null);
  const verticalRef2 = useRef<HTMLDivElement>(null);
  const horizontalRef1 = useRef<HTMLDivElement>(null);
  const horizontalRef2 = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);

  const gap = 20;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(hover: none), (pointer: coarse)").matches);
    }
  }, []);

  useEffect(() => {

    const v1 = verticalRef1.current;
    const v2 = verticalRef2.current;
    const h1 = horizontalRef1.current;
    const h2 = horizontalRef2.current;
    const gapEl = gapRef.current;

    if (!v1 || !v2 || !h1 || !h2 || !gapEl) return;

    const moveHandler = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      let targetWidth = gap;
      let targetHeight = gap;

      if (hoveredElRef.current) {
        const rect = hoveredElRef.current.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
        targetWidth = rect.width;
        targetHeight = rect.height;
      }

      gsap.to(v1, {
        x,
        height: y - targetHeight / 2 - 5,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(v2, {
        x,
        height: window.innerHeight - y - targetHeight / 2 - 5,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(h1, {
        y,
        width: x - targetWidth / 2 - 5,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(h2, {
        y,
        width: window.innerWidth - x - targetWidth / 2 - 5,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(gapEl, {
        x: x - targetWidth / 2,
        y: y - targetHeight / 2,
        width: targetWidth,
        height: targetHeight,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const hoverHandler = (e: Event) => {
      hoveredElRef.current = e.currentTarget as HTMLElement;
      const rect = hoveredElRef.current.getBoundingClientRect();
      
      const hasRounded = hoveredElRef.current.classList.contains('rounded') || 
                         Array.from(hoveredElRef.current.classList).some(cls => cls.startsWith('rounded-'));
      
      if (hasRounded && gapEl) {
        const computedStyle = window.getComputedStyle(hoveredElRef.current);
        const borderRadius = computedStyle.borderRadius;
        gapEl.style.borderRadius = borderRadius;
      }
      
      gsap.killTweensOf(gapEl);
      gsap.to(gapEl, {
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const leaveHandler = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement;
      
      // Check if we're leaving to a child element
      if (relatedTarget && target.contains(relatedTarget)) {
        return;
      }
      
      hoveredElRef.current = null;
      if (gapEl) {
        gapEl.style.borderRadius = '0.125rem';
      }
      gsap.killTweensOf([gapEl, v1, v2, h1, h2]);
      // Move all cursor elements to mouse position and reset size
      const event = e as MouseEvent;
      const x = event.clientX;
      const y = event.clientY;
      gsap.to(gapEl, {
        x: x - gap / 2,
        y: y - gap / 2,
        width: gap,
        height: gap,
        duration: 0.25,
        ease: "power3.out",
      });
      gsap.to(v1, {
        x,
        height: y - gap / 2 - 5,
        duration: 0.25,
        ease: "power3.out",
      });
      gsap.to(v2, {
        x,
        height: window.innerHeight - y - gap / 2 - 5,
        duration: 0.25,
        ease: "power3.out",
      });
      gsap.to(h1, {
        y,
        width: x - gap / 2 - 5,
        duration: 0.25,
        ease: "power3.out",
      });
      gsap.to(h2, {
        y,
        width: window.innerWidth - x - gap / 2 - 5,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const attachListeners = () => {
      const expandables = document.querySelectorAll<HTMLElement>(
        ".cursor-expand"
      );
      expandables.forEach((el) => {
        el.removeEventListener("mouseenter", hoverHandler);
        el.removeEventListener("mouseleave", leaveHandler);
        el.addEventListener("mouseenter", hoverHandler);
        el.addEventListener("mouseleave", leaveHandler);
      });
      return expandables;
    };

    let expandables = attachListeners();
    
    const timeoutId = setTimeout(() => {
      expandables = attachListeners();
    }, 1000);

    document.addEventListener("mousemove", moveHandler);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", moveHandler);
      expandables.forEach((el) => {
        el.removeEventListener("mouseenter", hoverHandler);
        el.removeEventListener("mouseleave", leaveHandler);
      });
      gsap.killTweensOf([v1, v2, h1, h2, gapEl]);
    };
  }, [mounted]);

  if (!mounted || isTouchDevice) return null;
  const containerStyle: React.CSSProperties = { direction: 'ltr' };

  return (
    <div style={containerStyle} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998] mix-blend-exclusion opacity-55">
      <div
        ref={verticalRef1}
        className="absolute top-0 left-0 w-px border-l-2 border-dashed border-white"
      />
      <div
        ref={verticalRef2}
        className="absolute bottom-0 left-0 w-px border-l-2 border-dashed border-white"
      />
      <div
        ref={horizontalRef1}
        className="absolute top-0 left-0 h-px border-t-2 border-dashed border-white"
      />
      <div
        ref={horizontalRef2}
        className="absolute top-0 right-0 h-px border-t-2 border-dashed border-white"
      />
      <div
        ref={gapRef}
        className="absolute border-2 border-white"
        style={{ width: gap, height: gap, borderRadius: '0.125rem' }}
      />
    </div>
  );
}
