export interface TiltAnalysis {
  isTilted: boolean
  severity: 'Low' | 'Medium' | 'High'
  reason: string | null
  cooldownMinutes: number
}

export type TriageLogicPrompt = {
  type: string
  question: string
  validate?: (input: string, actual: string) => boolean
  answer?: string
}

export const clinicalCategories = {
  PHYSIO: [
    'Rate pulse rhythm (Arrhythmic/Steady)',
    'Identify muscle tension sector (Cervical/Thoracic/Lumbar)',
    'Detect breath depth (Clavicular/Diaphragmatic)',
  ],
  LOGIC: [
    'Calculate: (Current Min * 2) - 5',
    'Sequence: 1, 1, 2, 3, 5, [?]',
    'Find the prime number: 11, 15, 21',
  ],
  OBSERVE: [
    'Identify the furthest sound frequency',
    'Locate 3 unique textures in proximity',
    'Count visible light sources',
  ],
} as const

export function getFreshTriage(): [string, string, string] {
  // Randomly pulls one from each category for every session.
  const q1 = clinicalCategories.PHYSIO[Math.floor(Math.random() * 3)]
  const q2 = clinicalCategories.LOGIC[Math.floor(Math.random() * 3)]
  const q3 = clinicalCategories.OBSERVE[Math.floor(Math.random() * 3)]
  return [q1, q2, q3]
}

export const triageLogicPool: TriageLogicPrompt[] = [
  ...clinicalCategories.PHYSIO.map((question) => ({ type: 'PHYSIO', question })),
  ...clinicalCategories.LOGIC.map((question) => ({ type: 'LOGIC', question })),
  ...clinicalCategories.OBSERVE.map((question) => ({ type: 'OBSERVE', question })),
]

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
