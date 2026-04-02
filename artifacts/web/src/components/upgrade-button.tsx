import { Zap } from 'lucide-react'
import { useCheckout } from '@/hooks/use-checkout'

export default function UpgradeButton({ userId, email }: { userId: string; email: string }) {
  const { startCheckout, isLoading } = useCheckout()

  return (
    <button
      onClick={() => startCheckout(email, userId)}
      disabled={isLoading}
      className="w-full bg-edge-emerald text-edge-navy p-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
    >
      <Zap size={20} fill="currentColor" />
      {isLoading ? 'Redirecting to Stripe...' : 'WIELD THE PRO EDGE'}
    </button>
  )
}
