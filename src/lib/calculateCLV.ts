export function calculateCLV(entryOdds: number, closingOdds: number): string {
  const validEntry = Number.isFinite(entryOdds) && entryOdds !== 0
  const validClosing = Number.isFinite(closingOdds) && closingOdds !== 0

  if (!validEntry || !validClosing) {
    return '0.00'
  }

  const entryProb =
    entryOdds > 0 ? 100 / (entryOdds + 100) : Math.abs(entryOdds) / (Math.abs(entryOdds) + 100)
  const closingProb =
    closingOdds > 0
      ? 100 / (closingOdds + 100)
      : Math.abs(closingOdds) / (Math.abs(closingOdds) + 100)

  // Positive CLV means the entry price beat the close.
  return ((closingProb - entryProb) * 100).toFixed(2)
}
