import React, { useMemo } from "react";
import type { KellyScore } from "../../lib/engine/kelly";

export interface CFODashProps {
  bankroll: number;
  accepted: KellyScore[];
  rejectedCount: number;
  stale: boolean;
  onSync?: () => void;
}

const fmtCredits = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

const fmtPct = (value: number) => `${(value * 100).toFixed(2)}%`;

const CFODash: React.FC<CFODashProps> = ({
  bankroll,
  accepted,
  rejectedCount,
  stale,
  onSync
}) => {
  const kpis = useMemo(() => {
    const deployed = accepted.reduce((sum, row) => sum + row.recommendedStake, 0);
    const totalExpectedValue = accepted.reduce(
      (sum, row) => sum + row.expectedValue,
      0
    );
    const realizedRisk = bankroll > 0 ? deployed / bankroll : 0;
    const avgEdge = accepted.length
      ? accepted.reduce((sum, row) => sum + row.edge, 0) / accepted.length
      : 0;
    return {
      deployed,
      totalExpectedValue,
      realizedRisk,
      avgEdge
    };
  }, [accepted, bankroll]);

  return (
    <section aria-label="CFO dashboard">
      <header
        style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}
      >
        <div>
          <h3 style={{ margin: 0 }}>CFO Risk Console</h3>
          <small style={{ opacity: 0.8 }}>
            {stale
              ? "heartbeat stale (90s+) - sync required"
              : "heartbeat healthy"}
          </small>
        </div>
        <button
          type="button"
          onClick={onSync}
          disabled={!onSync}
          aria-label="Sync heartbeat"
        >
          Sync
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "0.75rem",
          marginTop: "0.75rem"
        }}
      >
        <div>
          <strong>Bankroll</strong>
          <div>{fmtCredits(bankroll)} credits</div>
        </div>
        <div>
          <strong>Deployed</strong>
          <div>{fmtCredits(kpis.deployed)} credits</div>
        </div>
        <div>
          <strong>Risk Used</strong>
          <div>{fmtPct(kpis.realizedRisk)}</div>
        </div>
        <div>
          <strong>Expected Value</strong>
          <div>{fmtCredits(kpis.totalExpectedValue)} credits</div>
        </div>
        <div>
          <strong>Avg Edge</strong>
          <div>{fmtPct(kpis.avgEdge)}</div>
        </div>
        <div>
          <strong>Rejected Props</strong>
          <div>{rejectedCount}</div>
        </div>
      </div>
    </section>
  );
};

export default CFODash;
