import { NextRequest, NextResponse } from 'next/server'

function decodeJWT(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch { return null }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname === '/login') return NextResponse.next()

  const token = request.cookies.get('clinicmind_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = decodeJWT(token)

  // STRICT: only superadmin
  if (!user || user.role !== 'superadmin') {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('clinicmind_token')
    return res
  }

  // Redirect root to overview
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
