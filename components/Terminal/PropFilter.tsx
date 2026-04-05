import React from "react";
import type { KellyScore } from "../../lib/engine/kelly";

export interface FilterState {
  minEdge: number;
  side: "all" | "long" | "short";
  market: string;
  onlyAccepted: boolean;
}

interface PropFilterProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  optionsFromFeed?: KellyScore[];
}

const collectMarkets = (scores: KellyScore[]): string[] => {
  return Array.from(new Set(scores.map((score) => score.market))).sort();
};

export default function PropFilter({
  value,
  onChange,
  optionsFromFeed = []
}: PropFilterProps) {
  const markets = collectMarkets(optionsFromFeed);

  return (
    <section
      style={{
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: 12,
        background: "#030712",
        color: "#e5e7eb",
        display: "grid",
        gap: 8
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14 }}>Prop Filter</h3>
      <label style={{ display: "grid", gap: 4 }}>
        <span style={{ fontSize: 12 }}>Min edge</span>
        <input
          type="number"
          step="0.001"
          value={value.minEdge}
          onChange={(event) =>
            onChange({
              ...value,
              minEdge: Number(event.target.value)
            })
          }
        />
      </label>

      <label style={{ display: "grid", gap: 4 }}>
        <span style={{ fontSize: 12 }}>Side</span>
        <select
          value={value.side}
          onChange={(event) =>
            onChange({
              ...value,
              side: event.target.value as FilterState["side"]
            })
          }
        >
          <option value="all">All</option>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 4 }}>
        <span style={{ fontSize: 12 }}>Market</span>
        <select
          value={value.market}
          onChange={(event) =>
            onChange({
              ...value,
              market: event.target.value
            })
          }
        >
          <option value="">All</option>
          {markets.map((market) => (
            <option key={market} value={market}>
              {market}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
        <input
          type="checkbox"
          checked={value.onlyAccepted}
          onChange={(event) =>
            onChange({
              ...value,
              onlyAccepted: event.target.checked
            })
          }
        />
        Accepted positions only
      </label>
    </section>
  );
}
