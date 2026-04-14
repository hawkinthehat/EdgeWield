import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function isTrueFlag(value: string | undefined) {
  return (value ?? '').trim().toLowerCase() === 'true';
}

export function middleware(request: NextRequest) {
  const bypassEnabled = isTrueFlag(process.env.NEXT_PUBLIC_ENABLE_PRO_BYPASS);

  // If bypass is on, never let users get stuck on the pricing gate.
  if (bypassEnabled && request.nextUrl.pathname.startsWith('/pricing')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pricing/:path*'],
};
