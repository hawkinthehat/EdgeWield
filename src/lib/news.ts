export interface InjuryUpdate {
  id: string;
  player: string;
  team: string;
  status: "OUT" | "QUESTIONABLE" | "GTD";
  details: string;
  time: string;
}

export async function getInjuryPulse(): Promise<InjuryUpdate[]> {
  // In the future, this will fetch from an API like Rotowire or ESPN.
  // For now, this mock data keeps the Injury Pulse panel populated.
  return [
    {
      id: "1",
      player: "Lamar Jackson",
      team: "BAL",
      status: "QUESTIONABLE",
      details: "Ankle soreness; limited in practice.",
      time: "2m ago",
    },
    {
      id: "2",
      player: "Kevin Durant",
      team: "PHX",
      status: "OUT",
      details: "Left calf strain. Expected return in 2 weeks.",
      time: "14m ago",
    },
    {
      id: "3",
      player: "Tyreek Hill",
      team: "MIA",
      status: "GTD",
      details: "Warmups will determine status (Wrist).",
      time: "25m ago",
    },
  ];
}
