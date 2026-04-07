'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';
import { joinWaitlist } from '@/lib/waitlist';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => email.trim().length > 0 && !isSubmitting, [email, isSubmitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      await joinWaitlist(email.trim().toLowerCase());
      setStatus('success');
      setMessage('You are in. Watch your inbox for alpha access.');
      setEmail('');
    } catch (error) {
      console.error('Waitlist join failed:', error);
      setStatus('error');
      setMessage('Unable to join right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mb-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email for Alpha access"
          className="bg-transparent border-none focus:ring-0 px-6 py-3 text-sm flex-grow font-medium"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-edge-emerald text-black font-black uppercase text-xs px-8 py-4 rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
        >
          {isSubmitting ? 'Submitting...' : 'Join Waitlist'} <Zap size={14} />
        </button>
      </form>
      {message ? (
        <p
          className={`mt-3 text-xs font-bold uppercase tracking-wider ${
            status === 'success' ? 'text-edge-emerald' : 'text-red-400'
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
