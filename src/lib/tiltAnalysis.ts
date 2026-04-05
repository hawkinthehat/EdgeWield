export interface TiltAnalysis {
  isTilted: boolean
  severity: 'Low' | 'Medium' | 'High'
  reason: string | null
  cooldownMinutes: number
}

export type TiltBet = {
  status?: string | null
  wager_amount?: number | string | null
  created_at?: string | Date | null
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function isLostStatus(status: string | null | undefined): boolean {
  return (status ?? '').toLowerCase() === 'lost'
}

export const analyzeUserTilt = (recentBets: TiltBet[]): TiltAnalysis => {
  if (recentBets.length < 3) {
    return {
      isTilted: false,
      severity: 'Low',
      reason: null,
      cooldownMinutes: 0,
    }
  }

  // Assumes recent bets are newest first.
  const lastThree = recentBets.slice(0, 3)
  const allLost = lastThree.every((bet) => isLostStatus(bet.status))

  const newestWager = toNumber(lastThree[0]?.wager_amount)
  const previousWager = toNumber(lastThree[1]?.wager_amount)

  // 1. Loss Chasing: Is the newest wager > 2x the previous lost wager?
  const isChasing = allLost && previousWager > 0 && newestWager >= previousWager * 2

  // 2. Unit Spiking: Is this bet > 3x their average unit size?
  const avgUnit =
    recentBets.reduce((acc, bet) => acc + toNumber(bet.wager_amount), 0) / recentBets.length
  const isSpiking = avgUnit > 0 && newestWager > avgUnit * 3

  // 3. Velocity: Were 3 bets placed in under 10 minutes? (Emotional betting)
  const firstTs = new Date(lastThree[0]?.created_at ?? '').getTime()
  const thirdTs = new Date(lastThree[2]?.created_at ?? '').getTime()
  const hasValidTimes = Number.isFinite(firstTs) && Number.isFinite(thirdTs)
  const timeDiffMinutes = hasValidTimes ? Math.abs(firstTs - thirdTs) / 60000 : Number.POSITIVE_INFINITY
  const isHighVelocity = timeDiffMinutes < 10

  if (isChasing || isSpiking || (allLost && isHighVelocity)) {
    return {
      isTilted: true,
      severity: isChasing ? 'High' : 'Medium',
      reason: isChasing ? 'Loss Chasing Detected' : 'Irregular Volatility',
      cooldownMinutes: isChasing ? 120 : 30,
    }
  }

  return { isTilted: false, severity: 'Low', reason: null, cooldownMinutes: 0 }
}
