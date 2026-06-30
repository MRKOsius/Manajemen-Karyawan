import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// 1. Tentukan rute-rute mana saja yang HARUS login untuk bisa masuk
// Kita pakai awalan supaya rute seperti /karyawan/tambah juga ikut aman.
const protectedPrefixes = ['/karyawan', '/departemen', '/jabatan', '/absensi', '/gaji', '/admin']; 
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

  // Kasus C: Filter RBAC (Hak Akses Tingkat Lanjut)
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  if (path.startsWith('/gaji') && !isSuperAdmin) {
    // Memblokir paksa akses seluruh modul finansial Gaji ke halaman utama
    return NextResponse.redirect(new URL('/', req.nextUrl)); 
  }

  if (path.startsWith('/admin') && !isSuperAdmin) {
    // Memblokir paksa akses modul Kelola User ke halaman utama
    return NextResponse.redirect(new URL('/', req.nextUrl)); 
  }

  // Jika mencoba meretas untuk memodifikasi struktur data (Karyawan, Departemen, Jabatan, Admin)
  const structuralBases = ['/karyawan', '/departemen', '/jabatan', '/admin'];
  if (!isSuperAdmin) {
    for (const base of structuralBases) {
      if (path.startsWith(base + "/")) { 
          // Jika URL memiliki anak jalur miring (cth: /karyawan/tambah, /jabatan/nonaktif, dll), tendang kembali ke daftar tabel
          return NextResponse.redirect(new URL(base, req.nextUrl));
      }
      if (path === base && req.method !== 'GET') {
          // Blokir akses request mutasi (POST/PUT/DELETE via Server Action) pada basis target
          return NextResponse.redirect(new URL(base, req.nextUrl));
      }
    }
  }

  // Izinkan lewat jika aman
  return NextResponse.next();
}

// 5. Konfigurasi agar "satpam" tidak mengecek file statis seperti gambar biar tidak boros resource
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
