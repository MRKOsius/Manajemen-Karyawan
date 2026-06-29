import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Kunci rahasia untuk menandatangani "Tiket" (JWT). 
// Idealnya, kunci ini dimasukkan ke dalam file .env 
// (contoh: SESSION_SECRET=rahasia-negara-123)
const secretKey = process.env.SESSION_SECRET || 'rahasia-develop-jangan-dipakai-di-production';
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * 1. Fungsi Enkripsi: Mengubah data asli (seperti User ID/Role) menjadi TIKET (JWT) acak
 */
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Sesi berlaku selama 7 hari
    .sign(encodedKey);
}

/**
 * 2. Fungsi Dekripsi: Membaca tiket dari bentuk acak kembali menjadi data asli.
 * Jika tiket palsu atau kadaluarsa, fungsi ini akan menghasilkan error (kita kembalikan null).
 */
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * 3. Fungsi Membuat Session: Dicetuskan saat user sukses LOGIN
 */
export async function createSession(userId: string, role: string) {
  // Tentukan tiket kadaluarsa dalam 7 hari
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  // Bungkus data user menjadi tiket terenkripsi
  const sessionToken = await encrypt({ userId, role, expiresAt });

  // Panggil brankas cookie Next.js
  const cookieStore = await cookies();
  
  // Taruh tiket ke dalam cookie bernama 'session'
  cookieStore.set('session', sessionToken, {
    httpOnly: true, // Tiket aman, tak bisa dicuri lewat script javascript (XSS)
    secure: process.env.NODE_ENV === 'production', // Harus pakai https saat production
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}
