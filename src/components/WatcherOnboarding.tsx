'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Landmark, Target } from 'lucide-react';

type RiskProfile = 'Conservative' | 'Standard' | 'Aggressive';

type OnboardingData = {
  bankroll: number;
  risk: RiskProfile;
  books: string[];
};

export default function WatcherOnboarding({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    bankroll: 1000,
    risk: 'Standard',
    books: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);

  const unitMultiplier = formData.risk === 'Conservative' ? 0.005 : formData.risk === 'Standard' ? 0.01 : 0.02;
  const unitSize = formData.bankroll * unitMultiplier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex h-1.5 w-full bg-slate-100">
          <div
            className={`h-full bg-blue-600 transition-all duration-500 ${
              step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
            }`}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Landmark className="text-blue-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Initialize Your Bankroll</h2>
                <p className="mb-8 text-slate-500">
                  What is the total amount you have allocated for sports trading? Be honest—Watcher works best
                  with real data.
                </p>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.bankroll}
                    onChange={(e) => setFormData({ ...formData, bankroll: Number(e.target.value) || 0 })}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-10 pr-4 text-2xl font-bold font-mono transition-all focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Target className="text-emerald-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Define Your Risk Profile</h2>
                <p className="mb-6 text-slate-500">Watcher will auto-calculate your "Unit Size" based on this setting.</p>

                <div className="space-y-3">
                  {(['Conservative', 'Standard', 'Aggressive'] as const).map((risk) => (
                    <button
                      type="button"
                      key={risk}
                      onClick={() => setFormData({ ...formData, risk })}
                      className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                        formData.risk === risk
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{risk}</span>
                        <span className="text-xs font-mono text-slate-500">
                          {risk === 'Conservative' ? '0.5%' : risk === 'Standard' ? '1.0%' : '2.0%'} / Unit
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white"
                >
                  Calculate My Strategy <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Shield Active</h2>
                <p className="mb-8 text-sm text-slate-500">
                  Your initial unit size is set to{' '}
                  <span className="font-bold text-slate-900">${unitSize.toFixed(2)}</span>. Watcher is now monitoring
                  your market data.
                </p>

                <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Total Portfolio:</span>
                    <span className="font-mono font-bold">${formData.bankroll}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk Profile:</span>
                    <span className="font-bold uppercase tracking-widest text-blue-600">{formData.risk}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onComplete(formData)}
                  className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700"
                >
                  Enter Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
