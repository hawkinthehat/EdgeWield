import OddsList from '@/components/OddsList';
import { Activity, Shield, Zap, BarChart3 } from 'lucide-react';

export default function TerminalPage() {
  const shellStyle = {
    minHeight: '100vh',
    background: '#050505',
    color: '#e2e8f0',
  } as const;

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.72)',
    backdropFilter: 'blur(10px)',
  } as const;

  const glowPanel = {
    borderRadius: '2rem',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.00))',
    padding: '2rem',
  } as const;

  return (
    <main style={shellStyle} className="selection:bg-edge-emerald selection:text-black">
      <nav style={navStyle}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
            >
              <Zap size={18} className="fill-black text-black" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter" style={{ color: '#ffffff' }}>
              EDGEWIELD
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div
              className="hidden items-center gap-2 rounded-full px-3 py-1 md:flex"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#10b981' }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Feed Active</span>
            </div>
            <button
              className="text-xs font-black uppercase tracking-widest transition-colors"
              style={{ color: '#e2e8f0' }}
            >
              Account
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12">
          <h2 className="mb-2 text-4xl font-black italic tracking-tight text-white">TERMINAL_ALPHA</h2>
          <p className="max-w-2xl font-medium text-slate-500">
            Real-time market inefficiency detector. Scanning global sportsbooks every 90 seconds for +EV opportunities.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: '#10b981' }}
              >
                <Activity size={14} /> Live Market Odds
              </h3>
            </div>

            <OddsList />
          </section>

          <aside className="space-y-8">
            <div style={glowPanel}>
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Session Performance</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-400">Total CLV Beat</p>
                  <p className="text-3xl font-black italic" style={{ color: '#10b981' }}>
                    +4.12%
                  </p>
                </div>
                <div className="h-[2px] w-full bg-white/5" />
                <div>
                  <p className="text-sm font-bold text-slate-400">Active Arbs</p>
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} style={{ color: '#10b981' }} />
                    <p className="text-3xl font-black italic text-white">12</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-[2rem] p-8"
              style={{ border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.10)' }}
            >
              <Shield className="mb-4" style={{ color: '#10b981' }} size={24} />
              <h4 className="mb-2 text-sm font-black uppercase text-white">Sharpshooter Pro</h4>
              <p className="text-xs font-medium leading-relaxed text-slate-400">
                Your account is currently in &quot;Stealth Mode&quot; to avoid bookie limitations.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
