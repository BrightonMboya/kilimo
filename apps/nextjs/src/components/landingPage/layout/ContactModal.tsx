"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '~/components/landingPage/ui/Modal';
import { Button } from '~/components/landingPage/ui';
import Image from 'next/image';
import { api } from '~/trpc/react';

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendContact = api.contact.send.useMutation({
    onSuccess: () => {
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        onClose();
      }, 5600);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendContact.mutate({ name, email, message });
  }
// why-jani-bg.jpg
  return (
    <Modal open={open} onClose={onClose}>
      <div className="z-9999 flex h-full w-full flex-col gap-3 text-black md:flex-row md:gap-4">
        <div className='relative h-40 w-full overflow-hidden rounded-lg bg-amber-300 md:h-full md:w-1/2'>
          <Image
            src="/static/images/why-jani-bg.jpg"
            alt="Contact bg"
            fill
            loading="eager"
            className="object-center scale-110 z-10"
          />
        </div>
        <div className='flex h-full w-full flex-col justify-around gap-3 p-2 md:w-1/2 md:gap-4'>
          <div className='flex w-full flex-col items-center justify-center gap-3 md:gap-4'>
            <h2 className="text-4xl font-semibold text-green-800 md:text-7xl">{t('getInTouch')}</h2>
          </div>
          <div className='flex flex-col justify-start items-center'>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
              <div className='flex justify-center items-center gap-3'>
                <input
                  required
                  placeholder={t('placeholder.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <input
                required
                type="email"
                placeholder={t('placeholder.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
              <textarea
                required
                placeholder={t('placeholder.message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-36 w-full rounded-md border px-4 py-2 md:h-60"
              />

            </form>
          </div>
            <div className="w-full flex justify-center items-center">
              <Button 
                onClick={handleSubmit} 
                className='w-full md:w-1/2' 
                type="submit" 
                variant="primary"  // already has rounded-lg + green
                size="md" 
                disabled={sendContact.isPending}
              >
                {sendContact.isPending ? t('sending') : t('sendMessage')}
              </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
}
