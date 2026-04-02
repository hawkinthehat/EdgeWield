import { useState } from 'react';
import { ShieldCheck, Zap, BarChart3, ChevronRight, Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import Logo from '@/components/logo';
import { useCheckout } from '@/hooks/use-checkout';

const navLinks = [
  { label: "Today's Picks", href: '/picks' },
  { label: 'Edge Scanner', href: '/scanner' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/about' },
];

export default function LandingPage() {
  const { startCheckout, isLoading } = useCheckout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-edge-navy selection:bg-edge-emerald/30 overflow-x-hidden">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-edge-navy/90 backdrop-blur-md border-b border-edge-border/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                <button className="text-slate-400 font-bold text-sm hover:text-white transition-colors">
                  {l.label}
                </button>
              </Link>
            ))}
            <button
              onClick={() => startCheckout()}
              disabled={isLoading}
              className="bg-edge-emerald text-edge-navy px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-edge-emerald/20 hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-wait"
            >
              {isLoading ? 'Loading…' : 'Start Your Shield'}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-edge-navy border-t border-edge-border px-6 pb-6 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left py-3 px-3 rounded-xl text-slate-400 font-bold text-sm hover:text-white hover:bg-edge-slate/30 transition-colors">
                  {l.label}
                </button>
              </Link>
            ))}
            <div className="pt-2">
              <button
                onClick={() => { setMenuOpen(false); startCheckout(); }}
                disabled={isLoading}
                className="w-full bg-edge-emerald text-edge-navy py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isLoading ? 'Loading…' : 'Start Your Shield'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto pt-24 pb-20 text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-edge-emerald/10 border border-edge-emerald/20 text-edge-emerald text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
          <Zap size={14} /> Beta Phase 1.0 Now Live
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
          THE EDGE EXISTS. <br />
          <span className="text-edge-emerald italic">WIELD IT.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Stop gambling on gut feelings. EdgeWield is the surgical companion for your bankroll—providing the mathematical layer needed to lock in profit.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => startCheckout()}
            disabled={isLoading}
            className="bg-white text-edge-navy px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 hover:bg-edge-emerald hover:text-edge-navy transition-all group disabled:opacity-60 disabled:cursor-wait"
          >
            {isLoading ? "Redirecting..." : "Unlock Pro Access"}
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-32">
        <Feature
          icon={<ShieldCheck className="text-edge-emerald" size={28} />}
          title="Bankroll Shield"
          desc="Automated unit sizing based on your actual balance. We calculate the risk; you execute the move."
        />
        <Feature
          icon={<Zap className="text-edge-emerald" size={28} />}
          title="Hedge Scanning"
          desc="Our bot monitors live odds across your active bookies to find 0% vig and locked-profit opportunities."
        />
        <Feature
          icon={<BarChart3 className="text-edge-emerald" size={28} />}
          title="The Sweat Grid"
          desc="Real-time win probability and hedge calculators that turn stressful games into clinical outcomes."
        />
      </section>

      {/* SOCIAL PROOF FOOTER */}
      <footer className="text-center py-10 border-t border-edge-border/30 text-slate-600 text-[10px] uppercase tracking-[0.5em] font-bold">
        EdgeWield Terminal // Est. 2026 // Built for the Professional
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-10 bg-edge-slate/30 border border-edge-border rounded-[2.5rem] hover:border-edge-emerald/50 transition-all">
      <div className="mb-6 p-4 bg-edge-navy rounded-2xl w-fit shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
