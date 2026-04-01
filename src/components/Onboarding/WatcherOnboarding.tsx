'use client'

import { FormEvent, useState } from 'react'
import { finalizeOnboarding } from '@/app/actions/onboarding'

const riskOptions = ['Conservative', 'Standard', 'Aggressive'] as const

export default function WatcherOnboarding() {
  const [bankroll, setBankroll] = useState(1000)
  const [risk, setRisk] = useState<(typeof riskOptions)[number]>('Standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await finalizeOnboarding({ bankroll, risk })
      // Redirect is handled by the server action.
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onboarding failed. Please try again.'
      setError(message)
      alert('Onboarding failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleComplete} className="space-y-4 rounded-2xl border border-slate-800 p-6">
      <div>
        <label htmlFor="bankroll" className="block text-sm font-semibold text-white">
          Total bankroll
        </label>
        <input
          id="bankroll"
          type="number"
          min={1}
          step={1}
          value={bankroll}
          onChange={(event) => setBankroll(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="risk" className="block text-sm font-semibold text-white">
          Risk profile
        </label>
        <select
          id="risk"
          value={risk}
          onChange={(event) => setRisk(event.target.value as (typeof riskOptions)[number])}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        >
          {riskOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-edge-emerald px-4 py-2 font-bold text-edge-navy disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Complete onboarding'}
      </button>
    </form>
  )
}
