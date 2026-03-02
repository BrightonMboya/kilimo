"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
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
    <footer className='fixed flex flex-col bottom-0 left-0 w-screen h-screen text-white overflow-hidden'>
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
      <div className='w-full h-full flex flex-col justify-center items-center bg-green-700/50 backdrop-blur-sm z-10 pointer-events-auto'>
        <div className='w-full h-full p-2 flex flex-col justify-center items-center'>
          <div className='flex h-full justify-center items-center w-full'>
            <div className='w-fit h-fit flex flex-col justify-center items-center'>
              <p className='text-center max-w-4xl mx-auto font-impact text-responsive-9xl'>
                {t('readyTitle')}
              </p>
              <div className='p-8 w-full flex justify-center items-center'>
                <div className="w-1/2 h-fit text-3xl flex justify-center items-center gap-2">
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
                    <Button className='w-full' variant="ghost" size="lg">
                      {t('getInTouch')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex items-end justify-end'>
            <div className='w-full border-t border-white/50  flex flex-col p-4 justify-center items-center pointer-events-auto'>
              <div className='font-medium text-xl p-4'>
                <ul className='flex justify-center items-end gap-16'>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.about')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.features')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.pricing')}</Link></li>
                  <li><Link href="#" className='relative inline-block after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full'>{t('links.blog')}</Link></li>
                </ul>
              </div>
              <div className='flex justify-center items-end p-4 gap-16 pointer-events-auto'>
                  <div className='h-full flex items-center justify-end pointer-events-auto'>
                      <div className='flex flex-row items-end h-full justify-end  gap-4'>
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
