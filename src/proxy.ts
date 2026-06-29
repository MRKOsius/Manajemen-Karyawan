import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  // Ambil token cookies 
  const isLoggedIn = request.cookies.get('isLoggedIn')
  
  // Deteksi URL saat ini
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === "/login"
  
  // RESTRUKTUR LOGIKA:
  // 1. Jika User mencoba masuk BUKAN ke halaman login (/login), TAPI belum punya cookie:
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 2. Jika User SUDAH punya cookie TAPI nekat kembali ke halaman (/login):
  if (isLoggedIn && isLoginPage) {
     return NextResponse.redirect(new URL('/', request.url))
  }
  
  // 3. Biarkan saja selain 2 kondisi di atas
  return NextResponse.next()
}
 
// Batasi middleware ini HANYA untuk path yang berhubungan dengan UI kita.
// Hindari melarang akses ke folder /_next (asset, css, gambar), 
// karena nanti halaman login jadinya berantakan tanpa css.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
