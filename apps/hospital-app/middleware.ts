import { NextRequest, NextResponse } from 'next/server'

function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('clinicmind_token')?.value
  const { pathname } = request.nextUrl

  if (!token) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  const user = decodeJWT(token)
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  // Doctor verification gate
  if (user.role === 'doctor' && !user.isVerified) {
    if (pathname.startsWith('/dashboard/doctor') && pathname !== '/dashboard/doctor/pending') {
      return NextResponse.redirect(new URL('/dashboard/doctor/pending', request.url))
    }
  }

  // Role-based route protection
  if (user.role === 'staff' && pathname.startsWith('/dashboard/doctors')) {
    return NextResponse.redirect(new URL('/dashboard/staff/queue', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
