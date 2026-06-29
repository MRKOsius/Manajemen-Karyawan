# NexHR — Enterprise HRIS Dashboard

Sebuah purwarupa Sistem Informasi Manajemen Sumber Daya Manusia (HRIS) kelas premium yang dibangun di atas kerangka kerja mutakhir **Next.js 16 (App Router)**. Proyek ini mendemonstrasikan keahlian arsitektur tingkat lanjut dengan mengintegrasikan sistem basis data persisten, lapisan proteksi otorisasi, dan validasi sisi serambi (*server-side*).

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Framework](https://img.shields.io/badge/Next.js-16.2.9-black)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-blue)

## 🌟 Sorotan Fitur Pendekatan Enterprise

Berbeda dengan proyek *Dashboard* kasual, repositori ini ditopang oleh fondasi keamanan dan pilar keandalan tingkat komersil:

- **Auth Middleware (`proxy.ts`)**: Melindungi celah akses anonim menggunakan deteksi *Session Cookies* berkecepatan pinggir jaringan (*Edge speed*).
- **Injeksi Soft-Delete Orto-Grafis**: Algoritma `.delete()` yang telah berevolusi menjadi penyembunyian transparan `isActive: false` (Menjaga relasi Integritas Repositori Riwayat Gaji & Keuangan tetap suci selamanya).
- **Zod Data Shield**: Skema *Server Actions* dilapisi Zod untuk meregulasi ketat integritas Data Masukan (*Input*) sehingga Gaji Negatif dan Nama Kosong memicu pantulan validasi (*Client state Toast*).
- **Tailwind v4 @theme Engine**: Pemetaan warna modular *(Ink & Surface)* absolut tanpa kebosanan *Tailwind Config* lawas, dirancang seratus persen kebal gesekan ketika disuntikkan **Shadcn/ui** dan **Lucide React**.

## 🛠️ Tech Stack & Alat Mesin

*   **Core**: Next.js 16 (Turbopack), React 19
*   **Database ORM**: Prisma Client v6
*   **Database Cloud**: Neon Serverless PostgreSQL
*   **Formulir & Mutasi**: React `useFormState` + Zod
*   **Aestetik UI**: Sistem *Glassmorphism* + Tailwind CSS v4 + Shadcn Primitives

## 🖥️ Uji Coba Prasarana (Local Development)

Proyek ini sangat ringan untuk dipelopori ke komputer lokal. 

1. Klon Repositori ini dan masuk ke wilayah utamanya:
   ```bash
   git clone https://github.com/MRKOsius/Manajemen-Karyawan.git
   cd Manajemen-Karyawan
   ```

2. Bangkitkan peladen paket dependencies (Hanya butuh NPM standar):
   ```bash
   npm install
   ```

3. Sinkronisasikan Model Skema Prisma ke *Cloud* Anda sendiri (Ubah `.env` menjadi kunci Rahasia Database Postgres Anda dahulu!):
   ```bash
   npx prisma db push
   ```

4. Jalankan mesing *Turbopack* yang gahar ini:
   ```bash
   npm run dev
   ```

Buka `http://localhost:3000` dan nikmati interaksi mulusnya!

---
*Proyek ini dirancang sebagai bentuk Kulminasi dan Pengujian Analisis Web Level Profesional.*
