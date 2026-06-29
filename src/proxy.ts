import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// 1. Tentukan rute-rute mana saja yang HARUS login untuk bisa masuk
// Kita pakai awalan supaya rute seperti /karyawan/tambah juga ikut aman.
const protectedPrefixes = ['/karyawan', '/departemen', '/jabatan', '/absensi', '/gaji']; 
const publicRoutes = ['/login'];

export async function proxy(req: NextRequest) {
  // Ambil rute jalan yang sedang dikunjungi user
  const path = req.nextUrl.pathname;
  
  // Cek apakah halaman ini termasuk rahasia
  const isProtectedRoute = path === '/' || protectedPrefixes.some(p => path.startsWith(p));
  const isPublicRoute = publicRoutes.includes(path);

  // 2. Ambil "Tiket" (Cookie) dari browser user
  const sessionCookie = req.cookies.get('session')?.value;
  
  // 3. Baca keaslian tiket menggunakan fungsi utilitas kita
  const session = await decrypt(sessionCookie);

  // 4. Logika Pengusiran (Redirect)
  
  // Kasus A: Jika mau masuk area rahasia, TAPI tidak punya session (belum terdaftar)
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl)); // Tendang ke login
  }

  // Kasus B: Jika iseng buka /login, TAPI tiketnya masih ada alias sudah login
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl)); // Lemparkan ke dalam Dashboard
  }

  // Kasus C: Filter RBAC (Restriksi Halaman Gaji)
  if (path.startsWith('/gaji') && session?.role !== "SUPER_ADMIN") {
    // Jika user biasa mencoba menyusup ke halaman Finansial Gaji, kembalikan ke Beranda!
    return NextResponse.redirect(new URL('/', req.nextUrl)); 
  }

  // Izinkan lewat jika aman
  return NextResponse.next();
}

// 5. Konfigurasi agar "satpam" tidak mengecek file statis seperti gambar biar tidak boros resource
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
