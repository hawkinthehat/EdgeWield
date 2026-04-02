import { useState } from 'react'
import { signInWithEmail } from '@/lib/auth'
import { ShieldCheck, Mail, Loader2 } from 'lucide-react'

export default function AuthUI() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithEmail(email)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md w-full bg-edge-slate/20 border border-edge-border p-10 rounded-[3rem] backdrop-blur-xl">
      <div className="text-center mb-10">
        <div className="bg-edge-emerald/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-edge-emerald/20">
          <ShieldCheck className="text-edge-emerald" size={32} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Secure Entry</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
          EdgeWield Terminal Access
        </p>
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-edge-navy border border-edge-border p-4 pl-12 rounded-2xl focus:border-edge-emerald outline-none font-bold transition-all text-white placeholder:text-slate-600"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-bold text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-edge-navy p-4 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-edge-emerald transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Request Access Link'}
          </button>

          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            No password. Secure magic link sent to your email.
          </p>
        </form>
      ) : (
        <div className="text-center p-8 bg-edge-emerald/10 border border-edge-emerald/20 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-edge-emerald/20 flex items-center justify-center mx-auto">
            <Mail size={22} className="text-edge-emerald" />
          </div>
          <p className="text-edge-emerald font-black text-lg">Check your inbox.</p>
          <p className="text-xs text-slate-400 italic">
            A secure magic link has been dispatched to{' '}
            <span className="text-white font-bold">{email}</span>
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="text-[10px] text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest mt-2"
          >
            Use a different email
          </button>
        </div>
      )}
    </div>
  )
}
