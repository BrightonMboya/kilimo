"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '~/components/landingPage/ui/Modal';
import { Button } from '~/components/landingPage/ui';
import Image from 'next/image';

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Email send failed');
      }

      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        onClose();
      }, 5600);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }
// why-jani-bg.jpg
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex h-full w-full flex-row gap-4 text-black z-9999">
        <div className='relative bg-amber-300 w-1/2 h-full rounded-lg overflow-hidden'>
          <Image
            src="/static/images/why-jani-bg.jpg"
            alt="Contact bg"
            fill
            loading="eager"
            className="object-center scale-110 z-10"
          />
        </div>
        <div className='w-1/2 h-full flex flex-col justify-around p-2 gap-4'>
          <div className='w-full flex gap-4 flex-col justify-center items-center'>
            <h2 className="text-8xl font-semibold text-green-800">{t('getInTouch')}</h2>
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
                className="w-full h-60 px-4 py-2 border rounded-md"
              />

            </form>
          </div>
            <div className="w-full flex justify-center items-center">
              <Button onClick={handleSubmit} className='w-1/2 bg-green-700 hover:bg-green-500' type="submit" variant="black" size="md" disabled={submitting}>
                {submitting ? t('sending') : t('sendMessage')}
              </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
}
