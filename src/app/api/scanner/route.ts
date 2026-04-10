import { NextResponse } from 'next/server';
import { getScannerData } from '@/lib/scanner';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const bets = await getScannerData();
    return NextResponse.json({ bets }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown scanner error';
    console.error('scanner_fetch_failed', message);
    return NextResponse.json({ bets: [], error: 'Failed to fetch scanner data' }, { status: 500 });
  }
}
