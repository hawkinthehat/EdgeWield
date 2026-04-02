export interface ActivityRow {
  executed_at: string;
  event_name: string;
  profit_amount: number | null;
  roi_percent: number | null;
}

export function downloadActivityCSV(data: ActivityRow[]): void {
  if (data.length === 0) return;

  const headers = ["Date", "Event", "Profit ($)", "ROI (%)", "Status"];

  const rows = data.map((row) => [
    new Date(row.executed_at).toLocaleDateString("en-US"),
    `"${(row.event_name ?? "").replace(/"/g, '""')}"`, // escape inner quotes
    row.profit_amount ?? 0,
    row.roi_percent ?? 0,
    "SETTLED",
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `EdgeWield_Audit_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // clean up the object URL after download
}
