import Link from 'next/link';
import { CheckCircle2, Settings2, ShieldCheck } from 'lucide-react';
import WatcherOnboarding from '@/components/WatcherOnboarding';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-14 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">New setup</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            EdgeWield Watcher Experience
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            The new homepage is now focused on a gray/blue Watcher flow: configure bankroll, set risk,
            and enter your dashboard in one streamlined setup.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Open Dashboard
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Adjust Settings
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tight text-slate-900">What changed</h2>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Gray background + blue accents</p>
                  <p className="text-sm text-slate-600">
                    The updated shell uses slate/gray surfaces with blue highlight actions for key controls.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <Settings2 className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Dedicated setup flow</p>
                  <p className="text-sm text-slate-600">
                    Configure bankroll, risk profile, and active books through the new onboarding form.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Direct dashboard entry</p>
                  <p className="text-sm text-slate-600">
                    Once setup completes, the flow routes directly into the terminal dashboard.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <WatcherOnboarding />
          </div>
        </section>
      </div>
    </div>
  );
}
