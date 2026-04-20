import { NextResponse } from 'next/server'

// Simplified middleware - auth is handled client-side in each protected page
// This avoids Netlify edge function cookie-setting issues with Supabase
export async function middleware(request) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
