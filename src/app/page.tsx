import AuthUI from '@/components/AuthUI';
import PriceComparison from '@/components/PriceComparison';
import Pricing from '@/components/Pricing';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-edge-navy text-white">
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-edge-emerald">
            Beta Phase 1.0 Now Live
          </p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter md:text-6xl">
            The Edge Exists. Wield It.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400">
            Stop gambling on gut feelings. EdgeWield adds the mathematical layer to your bankroll with live market
            scanning, hedge execution, and operational discipline.
          </p>
        </div>
        <AuthUI />
      </section>

      <Pricing />
      <PriceComparison />
    </main>
  );
}
