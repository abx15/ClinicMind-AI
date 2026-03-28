import { NextRequest, NextResponse } from 'next/server'

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch { return null }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('clinicmind_token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', request.url))

  const user = decodeJWT(token)
  if (!user || user.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
