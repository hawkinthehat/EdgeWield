import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import UpgradeButton from '@/components/upgrade-button';
import Sidebar from '@/components/sidebar';
import AuthUI from '@/components/auth-ui';
import EdgeFeed from '@/components/edge-feed';
import WelcomeGuide from '@/components/welcome-guide';
import KellyTool from '@/components/kelly-tool';
import ActivityLog from '@/components/activity-log';
import { useActivity } from '@/hooks/use-activity';
import CFODash from '@/components/cfo-dash';
import LiveSweat from '@/components/live-sweat';
import ReferralCenter from '@/components/referral-center';

const GUIDE_KEY = 'ew-guide-seen';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-edge-slate/40 border border-edge-border rounded-2xl p-5">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-slate-500 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen bg-edge-navy text-white">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-16 md:pt-10 overflow-y-auto">
        <div className="space-y-6 max-w-4xl">
          <div className="h-10 w-48 bg-edge-slate/40 rounded-xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-edge-slate/40 border border-edge-border rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-edge-slate/40 border border-edge-border rounded-2xl animate-pulse" />
        </div>
      </main>
    </div>
  );
}

function ProTerminal({ userBankroll, userId }: { userBankroll?: number; userId?: string }) {
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem(GUIDE_KEY));
  const { history } = useActivity(userId ?? null);

  const cfoStats = {
    totalProfit: history.reduce((s, a) => s + (a.profit_amount ?? 0), 0),
    roi: history.length > 0
      ? history.reduce((s, a) => s + (a.roi_percent ?? 0), 0) / history.length
      : 0,
    trades: history.length,
  };

  const dismissGuide = () => {
    localStorage.setItem(GUIDE_KEY, '1');
    setShowGuide(false);
  };

  return (
    <div className="flex min-h-screen bg-edge-navy text-white">
      {showGuide && <WelcomeGuide onDismiss={dismissGuide} />}
      <Sidebar userBankroll={userBankroll} />
      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-16 md:pt-10 overflow-y-auto">
        <div className="max-w-4xl space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edge-emerald/10 border border-edge-emerald/20 text-edge-emerald text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap size={10} fill="currentColor" /> Pro Terminal
            </div>
            <h1 className="text-4xl font-black text-white">
              Edge <span className="text-edge-emerald">Terminal</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Live arb feed. Select an edge to load the unit calculator.</p>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Status" value="Pro Active" sub="Full access unlocked" />
            <StatCard label="Markets" value="3 Live" sub="Moneyline · Spread · O/U" />
            <StatCard label="Refresh" value="90s Sync" sub="Real-time market scan" />
          </div>

          {/* CFO Performance Dashboard */}
          <CFODash stats={cfoStats} activityData={history} />

          {/* Kelly Optimizer */}
          <KellyTool bankroll={userBankroll} />

          {/* Live Edge Feed — tap any odds tile to open the Wield Calculator */}
          <EdgeFeed />

          {/* Live Sweat Terminal */}
          <LiveSweat />

          {/* Mission History */}
          <ActivityLog history={history} />

          {/* Growth Protocol — referral program */}
          <ReferralCenter />
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useUser();

  if (loading) return <LoadingState />;

  if (!user) {
    return (
      <div className="flex min-h-screen bg-edge-navy text-white">
        <Sidebar />
        <main className="flex-1 md:ml-72 flex items-center justify-center p-6 md:p-10 pt-16 md:pt-10">
          <AuthUI />
        </main>
      </div>
    );
  }

  if (!user.is_pro) {
    return (
      <div className="flex min-h-screen bg-edge-navy text-white">
        <Sidebar />
        <main className="flex-1 md:ml-72 flex items-center justify-center p-6 md:p-10 pt-16 md:pt-10">
          <div className="p-12 bg-edge-slate/20 border-2 border-dashed border-edge-border rounded-[3rem] text-center max-w-md w-full">
            <Lock size={40} className="text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Locked Analytics</h3>
            <p className="text-slate-500 mb-8">
              Upgrade to Pro to see live market gaps and lock in your profit.
            </p>
            <UpgradeButton userId={user.id} email={user.email} />
          </div>
        </main>
      </div>
    );
  }

  return <ProTerminal userId={user.id} />;
}
