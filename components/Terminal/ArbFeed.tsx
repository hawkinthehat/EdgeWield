"use client";

import React from "react";
import type { KellyScore } from "../../lib/engine/kelly";

export interface ArbFeedProps {
  opportunities: KellyScore[];
  loading?: boolean;
  staleHeartbeat?: boolean;
  heartbeatAgeMs?: number;
}

const formatPct = (value: number) => `${(value * 100).toFixed(2)}%`;
const formatCredits = (value: number) =>
  `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} cr`;

export function ArbFeed({
  opportunities,
  loading = false,
  staleHeartbeat = false,
  heartbeatAgeMs
}: ArbFeedProps) {
  if (loading) {
    return <div data-testid="arb-feed-loading">Loading scanner feed...</div>;
  }

  return (
    <section data-testid="arb-feed">
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Scanner Feed</h3>
        <small>
          Heartbeat:{" "}
          {staleHeartbeat
            ? "STALE"
            : heartbeatAgeMs !== undefined
              ? `${Math.max(0, Math.round(heartbeatAgeMs / 1000))}s ago`
              : "n/a"}
        </small>
      </header>

      {opportunities.length === 0 ? (
        <p>No accepted opportunities.</p>
      ) : (
        <table width="100%">
          <thead>
            <tr>
              <th align="left">Symbol</th>
              <th align="left">Market</th>
              <th align="left">Side</th>
              <th align="right">Edge</th>
              <th align="right">Kelly</th>
              <th align="right">Stake</th>
              <th align="right">EV</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((item) => (
              <tr key={item.id}>
                <td>{item.symbol}</td>
                <td>{item.market}</td>
                <td>{item.side}</td>
                <td align="right">{formatPct(item.edge)}</td>
                <td align="right">{formatPct(item.appliedKellyFraction)}</td>
                <td align="right">{formatCredits(item.recommendedStake)}</td>
                <td align="right">{formatCredits(item.expectedValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ArbFeed;
