'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Landmark, Loader2, Target } from 'lucide-react';
import { finalizeOnboarding } from '@/app/actions/onboarding';

type RiskProfile = 'Conservative' | 'Standard' | 'Aggressive';

type FormDataState = {
  bankroll: number;
  risk: RiskProfile;
  books: string[];
};

export type OnboardingCompleteData = FormDataState & {
  unit_size_percentage: number;
  onboarding_completed: true;
};

const riskMap: Record<RiskProfile, number> = {
  Conservative: 0.005,
  Standard: 0.01,
  Aggressive: 0.02,
};

export default function TerminalConfigurationOnboarding({
  onComplete,
}: {
  onComplete: (data: OnboardingCompleteData) => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    bankroll: 1000,
    risk: 'Standard',
    books: [],
  });

  const unitPercent = useMemo(() => riskMap[formData.risk], [formData.risk]);
  const unitSize = useMemo(() => formData.bankroll * unitPercent, [formData.bankroll, unitPercent]);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await finalizeOnboarding({
        bankroll: formData.bankroll,
        risk: formData.risk,
      });

      if (result?.success === false) {
        throw new Error(result.message ?? 'Onboarding failed');
      }

      onComplete({
        ...formData,
        unit_size_percentage: unitPercent,
        onboarding_completed: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onboarding failed';
      if (message.includes('NEXT_REDIRECT')) {
        onComplete({
          ...formData,
          unit_size_percentage: unitPercent,
          onboarding_completed: true,
        });
        return;
      }
      setError('Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-1.5 w-full bg-slate-100">
          <div
            className={`h-full bg-blue-600 transition-all duration-500 ${
              step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
            }`}
          />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Landmark className="text-blue-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Initialize Your Bankroll</h2>
              <p className="mb-8 text-slate-500">
                What is the total amount you have allocated for sports trading? EdgeWield Terminal
                works best with real data.
              </p>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  value={formData.bankroll}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, bankroll: Number(event.target.value) }))
                  }
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-10 pr-4 font-mono text-2xl font-bold transition-all focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={nextStep}
                disabled={!Number.isFinite(formData.bankroll) || formData.bankroll <= 0}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <Target className="text-emerald-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Define Your Risk Profile</h2>
              <p className="mb-6 text-slate-500">
                EdgeWield Pro auto-calculates your unit size based on this setting.
              </p>

              <div className="space-y-3">
                {(['Conservative', 'Standard', 'Aggressive'] as RiskProfile[]).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setFormData((prev) => ({ ...prev, risk }))}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                      formData.risk === risk
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{risk}</span>
                      <span className="font-mono text-xs text-slate-500">
                        {risk === 'Conservative' ? '0.5%' : risk === 'Standard' ? '1.0%' : '2.0%'} /
                        Unit
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={nextStep}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white"
              >
                Calculate My Strategy <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Shield Active</h2>
              <p className="mb-8 text-sm text-slate-500">
                Your initial unit size is set to{' '}
                <span className="font-bold text-slate-900">${unitSize.toFixed(2)}</span>.
              </p>

              <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Total Portfolio:</span>
                  <span className="font-mono font-bold">${formData.bankroll}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk Profile:</span>
                  <span className="font-bold uppercase tracking-widest text-blue-600">
                    {formData.risk}
                  </span>
                </div>
              </div>

              {error && <p className="mb-4 text-sm font-semibold text-red-600">{error}</p>}

              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Enter Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
