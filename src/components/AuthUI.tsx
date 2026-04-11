'use client';

import { useState } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import { signInWithEmail } from '@/lib/auth';

export default function AuthUI() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await signInWithEmail(email);
    if (!error) {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <section className="w-full max-w-md rounded-[3rem] border border-edge-border bg-edge-slate/20 p-10 backdrop-blur-xl">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-edge-emerald/20 bg-edge-emerald/10">
          <ShieldCheck className="text-edge-emerald" size={32} />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Secure Entry</h2>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">EdgeWield Pro Access</p>
      </div>

      {!sent ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              placeholder="operator@email.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-edge-border bg-edge-navy p-4 pl-12 font-bold text-white outline-none transition-all focus:border-edge-emerald"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white p-4 font-black uppercase tracking-tighter text-edge-navy transition-all hover:bg-edge-emerald disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Request Access Link'}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-edge-emerald/20 bg-edge-emerald/10 p-6 text-center">
          <p className="font-bold text-edge-emerald">Check your inbox.</p>
          <p className="mt-2 text-xs italic text-slate-400">A secure sign-in link has been sent to your email.</p>
        </div>
      )}
    </section>
  );
}
