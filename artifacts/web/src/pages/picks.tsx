import { motion } from "framer-motion";
import { TrendingUp, Lock, Star } from "lucide-react";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Link } from "wouter";
import { useCheckout } from "@/hooks/use-checkout";

type Pick = {
  sport: string;
  game: string;
  pick: string;
  line: string;
  confidence: number;
  analysis: string;
  premium: boolean;
};

const todaysPicks: Pick[] = [
  {
    sport: "NFL",
    game: "Chiefs vs Ravens",
    pick: "Chiefs -3.5",
    line: "-110",
    confidence: 78,
    analysis: "Chiefs are 8-2 ATS at home in primetime. Ravens missing two starting CBs. Sharp money moved this line from -2 to -3.5 overnight.",
    premium: false,
  },
  {
    sport: "NBA",
    game: "Celtics vs Heat",
    pick: "Over 218.5",
    line: "-108",
    confidence: 72,
    analysis: "Both teams rank top-5 in offensive efficiency this month. Heat playing on a back-to-back, which historically inflates scoring pace.",
    premium: false,
  },
  {
    sport: "MLB",
    game: "Dodgers vs Padres",
    pick: "Dodgers ML",
    line: "-135",
    confidence: 81,
    analysis: "Premium Pick — unlock to view full analysis.",
    premium: true,
  },
  {
    sport: "NHL",
    game: "Bruins vs Rangers",
    pick: "Under 5.5",
    line: "-115",
    confidence: 69,
    analysis: "Premium Pick — unlock to view full analysis.",
    premium: true,
  },
  {
    sport: "NCAA",
    game: "Alabama vs Georgia",
    pick: "Georgia +7",
    line: "-112",
    confidence: 74,
    analysis: "Premium Pick — unlock to view full analysis.",
    premium: true,
  },
];

const confidenceColor = (c: number) => {
  if (c >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
  if (c >= 70) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  return "text-orange-400 bg-orange-400/10 border-orange-400/20";
};

export default function Picks() {
  const { startCheckout, isLoading } = useCheckout();
  return (
    <div className="min-h-[80vh] pb-24">
      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-3">
                Today's <span className="text-primary text-glow">Picks</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {" — "}
                {todaysPicks.length} picks available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +31% ROI last 90 days
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Picks List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5">
        {todaysPicks.map((pick, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`glass-panel rounded-2xl border ${pick.premium ? "border-primary/20" : "border-white/5"} overflow-hidden`}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      {pick.sport}
                    </span>
                    {pick.premium && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">{pick.game}</p>
                  <h3 className="text-2xl font-display font-bold text-white">{pick.pick}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {pick.premium ? (
                      <span className="flex items-center gap-2 text-muted-foreground italic">
                        <Lock className="w-4 h-4 text-primary shrink-0" />
                        Unlock full analysis with a Premium subscription.
                      </span>
                    ) : (
                      pick.analysis
                    )}
                  </p>
                </div>

                {/* Right */}
                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Line</p>
                    <p className="text-xl font-bold text-white font-display">{pick.line}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-bold ${confidenceColor(pick.confidence)}`}>
                    {pick.confidence}% confidence
                  </div>
                </div>
              </div>
            </div>

            {pick.premium && (
              <div className="border-t border-primary/10 bg-primary/5 px-6 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  This pick includes full line movement, sharp-money breakdown, and prop correlations.
                </p>
                <ButtonPremium size="sm" className="shrink-0" onClick={() => startCheckout()} disabled={isLoading}>
                  {isLoading ? "Redirecting..." : "Unlock Premium"}
                </ButtonPremium>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-16 text-center">
        <div className="glass-panel rounded-3xl p-12 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Want all 5 picks + in-depth analysis?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Go Premium and unlock every pick, every day — plus live line alerts and bankroll tools.
            </p>
            <ButtonPremium size="lg" onClick={() => startCheckout()} disabled={isLoading}>
              {isLoading ? "Redirecting..." : "Get Premium Access"}
            </ButtonPremium>
          </div>
        </div>
      </section>
    </div>
  );
}
