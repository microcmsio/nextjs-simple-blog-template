import { NextRequest, NextResponse } from 'next/server';

const cachePolicies = {
  noCache: 'no-store, must-revalidate',
  publicIsr: 'public, s-maxage=60, stale-while-revalidate=300',
};

export function middleware(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cachePolicy = searchParams.has('dk') ? cachePolicies.noCache : cachePolicies.publicIsr;

  const response = NextResponse.next();

  response.headers.set('CDN-Cache-Control', cachePolicy);

  return response;
}

export const config = {
  matcher: '/articles/:path*',
};
