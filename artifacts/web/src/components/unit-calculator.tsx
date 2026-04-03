import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import UnitsCalc from './units-calc';
import { supabase } from '@/lib/supabase';

interface BetData {
  game: string;
  bookie: string;
  odds: number;
  hedgeOdds: number;
  hedgeBookie: string;
  profitPct: number;
}

export default function UnitCalculator({
  bet,
  onClose,
}: {
  bet: BetData;
  onClose: () => void;
}) {
  const [stakeA, setStakeA] = useState(100);
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  // Derive hedge stake + profit to pass to the log function
  const hedgeStake = parseFloat(((stakeA * bet.odds) / bet.hedgeOdds).toFixed(2));
  const profit = parseFloat((stakeA * bet.odds - (stakeA + hedgeStake)).toFixed(2));

  const handleLogBet = async () => {
    if (!supabase) {
      toast.error('Supabase not connected — add your project keys to enable logging.');
      return;
    }

    setLogging(true);

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      toast.error('Sign in to log bets to your CFO Dashboard.');
      setLogging(false);
      return;
    }

    const { error } = await supabase.from('user_activity').insert({
      user_id: userId,
      event_name: bet.game,
      profit_amount: profit,
      roi_percent: bet.profitPct,
      executed_at: new Date().toISOString(),
    });

    setLogging(false);

    if (error) {
      toast.error('Failed to log bet. Try again.');
      return;
    }

    setLogged(true);
    toast.success('Bet logged to CFO Dashboard!', {
      description: `${bet.game} · +$${profit} profit`,
      duration: 5000,
    });

    setTimeout(onClose, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-edge-navy/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="w-full max-w-lg bg-edge-slate border border-edge-border rounded-[2rem] overflow-hidden shadow-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-edge-border">
            <div>
              <span className="text-[10px] font-black bg-edge-emerald text-edge-navy px-2 py-0.5 rounded uppercase tracking-tighter">
                Wield Calculator
              </span>
              <h3 className="text-lg font-black text-white mt-2 leading-tight">{bet.game}</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                {bet.bookie} ({bet.odds}) &amp; {bet.hedgeBookie} ({bet.hedgeOdds})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-edge-border transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Calculator */}
          <div className="p-6">
            <UnitsCalc
              oddsA={bet.odds}
              oddsB={bet.hedgeOdds}
              bookieA={bet.bookie}
              bookieB={bet.hedgeBookie}
            />
          </div>

          {/* Log to CFO Dashboard */}
          <div className="px-6 pb-6">
            <button
              onClick={handleLogBet}
              disabled={logging || logged}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: logged ? '#059669' : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#020617',
              }}
            >
              {logged ? (
                <>
                  <CheckCircle size={16} />
                  Logged to CFO Dashboard
                </>
              ) : logging ? (
                'Logging...'
              ) : (
                'Log Bet to CFO Dashboard'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
