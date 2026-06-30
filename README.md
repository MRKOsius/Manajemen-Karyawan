# NexHR — Enterprise HRIS Dashboard (V2)

Sebuah Sistem Informasi Manajemen Sumber Daya Manusia (HRIS) kelas premium yang dibangun di atas kerangka kerja mutakhir **Next.js 16 (App Router)**. Proyek ini mendemonstrasikan keahlian arsitektur *Fullstack* tingkat lanjut dengan mengintegrasikan sistem basis data persisten, lapisan proteksi otorisasi, arsitektur UI/UX kaku (Figma V2), dan validasi sisi peladen (*server-side*).

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Framework](https://img.shields.io/badge/Next.js-16.2.9-black)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-blue)

## 🌟 Sorotan Fitur Enterprise (Ekspansi V2)

Berbeda dengan proyek *Dashboard* kasual, repositori ini ditopang oleh fondasi keamanan dan pilar keandalan tingkat komersil:

- **Protokol RBAC (Role-Based Access Control)**: Mengklasifikasikan sesi pengguna ke dalam kasta `SUPER_ADMIN` dan `HR_STAFF`. Rute krusial seperti Penggajian dan Visualisasi Rahasia di-*ghosting* secara paksa dari pengguna level bawah.
- **Visualisasi Recharts**: Dasbor yang hidup dengan grafik balok dinamis (*Client-rendered*) yang mengkalkulasi beban populasi setiap departemen secara seketika (*Real-time Data Fetching*).
- **Mesin Presensi (Absensi)**: Tabel log kehadiran dengan indikator lencana (*badge*) absolut, didukung oleh formulir *Server Action* kilat yang divalidasi keandalannya.
- **Resolusi "Bad UI" & Adaptasi Arsitektur V2**: Seluruh jejak desain "*SaaS/Dribbble Slop*" (seperti shadow berlebih, rounded borders raksasa, dan teks puitis) telah dihilangkan total. Mengadopsi tata ruang asimetris kelas *Enterprise* (Grid 70:30) dipadukan dengan desain *Document Row Pattern* yang kaku dan padat data.
- **Jaring Pengaman Global (Error Boundaries)**: Halaman `error.tsx` dan `not-found.tsx` ter-kustomisasi penuh mencegah bocornya kode *Stack Trace* merah ke layar pengguna jika Database Neon PostgreSQL lumpuh terbakar badai.
- **Middleware Pengusir (`proxy.ts`)**: Melindungi celah akses anonim di ambang jari lintas batas menggunakan *JWT Session Cookies* (terenkripsi `jose`) berfrekuensi peladen.

## 🛠️ Tech Stack & Alat Mesin

*   **Platform**: Next.js 16 (App Router) + React 19
*   **Keamanan**: BcryptJS (Hashing) + Jose (JWT Encryption) + Zod (Validation Schema)
*   **Database ORM**: Prisma Client v6
*   **Database Cloud**: Neon Serverless PostgreSQL
*   **Estetika UI**: Tailwind CSS v4 + Recharts + Lucide React + Shadcn Primitives (Minified)

## 🖥️ Uji Coba Prasarana (Local Development)

Proyek ini sangat ringan untuk dipelopori ke komputer lokal. 

1. Klon Repositori ini dan lompat ke wilayah utamanya:
   ```bash
   git clone https://github.com/MRKOsius/Manajemen-Karyawan.git
   cd Manajemen-Karyawan
   ```

2. Bangkitkan peladen paket dependencies:
   ```bash
   npm install
   ```

3. Modifikasi `.env` menjadi kunci rahasia Database Postgres milik Anda, lalu operasikan *Push* Skema Prisma:
   ```bash
   npx prisma db push
   ```

4. *(Opsional tapi Esensial)* Ubah Role akun Anda menjadi `SUPER_ADMIN` di Prisma Studio:
   ```bash
   npx prisma studio
   ```

5. Jalankan mesin raksasa *Turbopack* ini:
   ```bash
   npm run dev
   ```

Buka `https://manajemen-karyawan-phi.vercel.app/` dan nikmati interaksi mulusnya!
