"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import MouseFollow from '~/components/landingPage/animations/MouseFollow';
import { Button } from '~/components/landingPage/ui';
import ContactModal from './ContactModal';
import { useTranslations } from 'next-intl';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const t = useTranslations('footer');
  const [contactOpen, setContactOpen] = useState(false);

  function openContact() {
    setContactOpen(true);
  }

  function closeContact() {
    setContactOpen(false);
  }

  return (
    <footer className='fixed bottom-0 left-0 flex h-[100svh] w-full flex-col overflow-hidden text-white'>
      <MouseFollow className="absolute inset-0 -z-20 pointer-events-none" strength={0.06}>
        <Image
          src="/static/images/green farm.jpeg"
          alt="Green Farm"
          fill
          priority
          loading="eager"
          className="object-cover scale-110"
        />
      </MouseFollow>
      <div className='pointer-events-auto z-10 flex h-full w-full flex-col items-center justify-center bg-green-700/50 backdrop-blur-sm'>
        <div className='flex h-full w-full flex-col items-center justify-center p-2'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='flex h-fit w-fit flex-col items-center justify-center'>
              <p className='mx-auto max-w-4xl px-2 text-center font-impact text-responsive-9xl'>
                {t('readyTitle')}
              </p>
              <div className='flex w-full items-center justify-center p-4 md:p-8'>
                <div className="flex h-fit w-full max-w-sm items-center justify-center gap-2 text-lg md:text-3xl">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={openContact}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openContact();
                      }
                    }}
                    className="w-full"
                  >
                    <Button className='w-full' variant="ghost" size="md">
                      {t('getInTouch')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-full items-end justify-end'>
            <div className='pointer-events-auto flex w-full flex-col items-center justify-center border-t border-white/50 p-4'>
              <div className='p-4 text-base font-medium md:text-xl'>
                <ul className='flex flex-wrap items-end justify-center gap-x-6 gap-y-3 md:gap-16'>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.about')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.features')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.pricing')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.blog')}</Link></li>
                </ul>
              </div>
              <div className='pointer-events-auto flex items-end justify-center gap-16 p-4'>
                  <div className='pointer-events-auto flex h-full items-center justify-end'>
                      <div className='flex h-full flex-row items-end justify-end gap-4'>
                          <Link href="https://www.facebook.com/share/1Ha2driwun/?mibextid=wwXIfr" target="_blank" className='w-10 h-10 cursor-expand rounded-full border border-white hover:bg-green-600 flex items-center justify-center transition-colors'>
                            <Facebook size={20} />
                          </Link>
                          <Link href="https://x.com/jani_verse" target="_blank" className='w-10 h-10 cursor-expand rounded-full border border-white hover:bg-green-600 flex items-center justify-center transition-colors'>
                            <Twitter size={20} />
                          </Link>
                          <Link href="https://www.linkedin.com/company/jani-ai/" target="_blank" className='w-10 h-10 cursor-expand rounded-full border border-white hover:bg-green-600 flex items-center justify-center transition-colors'>
                            <Linkedin size={20} />
                          </Link>
                          {/* <Link href="#" className='w-10 h-10 cursor-expand rounded-full border border-white hover:bg-green-600 flex items-center justify-center transition-colors'>
                            <Instagram size={20} />
                          </Link> */}
                        </div>
                    </div>
              </div>
            </div>
          </div>
        </div>
        <ContactModal open={contactOpen} onClose={closeContact} />
      </div>
    </footer>
  );
}
