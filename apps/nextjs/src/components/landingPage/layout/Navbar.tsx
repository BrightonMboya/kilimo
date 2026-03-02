"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '~/components/landingPage/ui';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';


interface NavbarProps {
  className?: string;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

export default function Navbar({ className }: NavbarProps) {
  const t = useTranslations('navbar');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);


  const handleWaitListClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'join_waitlist_click', {
        event_category: 'CTA',
        event_label: t('joinWaitlist'),
        value: 'https://szan6fk6p17.typeform.com/to/d2P3Z44V'
      });
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supportedCodes = languages.map((l) => l.code);
      const parts = window.location.pathname.split('/').filter(Boolean);
      const first = parts[0];
      if (first && supportedCodes.includes(first)) {
        setSelectedLanguage(first);
      }
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      const heroHeight = window.innerHeight * 0.9;
      setIsInHeroSection(currentScrollY < heroHeight);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isInHeroSection) {
        setIsVisible(false);
        setIsLanguageMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (code: string) => {
    if (typeof window === 'undefined') return;
    const supported = languages.map((l) => l.code);
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) {
      window.location.href = `/${code}` + window.location.search;
      return setIsLanguageMenuOpen(false);
    }

    if (supported.includes(parts[0])) {
      parts[0] = code;
    } else {
      parts.unshift(code);
    }
    const final = '/' + parts.join('/');
    window.location.href = final + window.location.search;
    setIsLanguageMenuOpen(false);
  };

  return (
    <motion.div 
      className={`fixed top-0 w-screen h-[5rem] pl-4 pr-4 flex z-[9990] transition-colors duration-200 ${
        isInHeroSection ? 'bg-transparent' : 'bg-white shadow-md'
      }`}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: 1 }}
      transition={{ duration: 1.3, ease: [0.6, 0.01, 0.05, 0.95] }}
    >
        <nav className='w-full h-full flex flex-row justify-between gap-4'>
            <div className='h-full w-fit justify-center items-center gap-4 flex flex-row '>
              <Link href={`/${selectedLanguage}`} className='relative flex justify-start items-center cursor-expand overflow-hidden w-[10rem] h-[5rem]'>
                <Image 
                  src={isInHeroSection ? "/static/images/JANI AI -HD- White.png" : "/static/images/JANI AI -HD- Green.png"}
                  alt="JANI Logo" 
                  fill
                  className="object-cover scale-150"
                />
              </Link>
            </div>
            {/* <div className='h-full w-2/3 '/> */}
            <div className='h-full w-fit gap-4 flex flex-row justify-center items-center'>
                <div className={` ${isInHeroSection ? " backdrop-blur-2xl border border-gray-50": "" } relative px-4 rounded-full w-full flex justify-center items-center gap-2 p-2`} ref={menuRef}>
                    <p className={`font-bold transition-colors duration-300 px-2 ${
                      isInHeroSection ? 'text-white' : 'text-gray-900'
                    }`}>{selectedLanguage}</p>
                    <div 
                      className={`rounded-full p-1 hover:bg-gray-500/10 cursor-expand hover:cursor-pointer transition-colors duration-300 ${
                        isInHeroSection ? 'text-white' : 'text-gray-900'
                      }`}
                      onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    >
                        <ChevronDown width={15} height={15} strokeWidth={2.5}/>
                    </div>
                    
                    <AnimatePresence>
                      {isLanguageMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className='absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-30 z-[50]'
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageSelect(lang.code)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                                selectedLanguage === lang.code ? 'bg-green-50 text-green-600 font-bold' : 'text-gray-700'
                              }`}
                            >
                              <span className='text-sm font-medium'>{lang.code}</span>
                              <span className='text-xs text-gray-500 ml-2'>({lang.label})</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
                <div className=' w-fit h-full flex justify-end items-center'>
                  <a
                    href="https://szan6fk6p17.typeform.com/to/d2P3Z44V"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit h-fit text-3xl flex justify-center items-center gap-2"
                    onClick={handleWaitListClick}
                  >
                    <Button variant={ isInHeroSection ? "secondary" : "primary"} size="lg">
                      {t('joinWaitlist')}
                    </Button>
                  </a>
                </div>
            </div>
        </nav>
    </motion.div>
  );
}
