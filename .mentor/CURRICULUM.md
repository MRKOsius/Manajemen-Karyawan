# 📚 Kurikulum: Next.js Fullstack Website

> Dokumen ini berisi kurikulum lengkap pembelajaran Next.js fullstack.
> Setiap modul memiliki: tujuan, materi, latihan, dan kriteria selesai.

---

## 🎯 Project Akhir
**Sistem Manajemen Karyawan** — Sebuah web app fullstack untuk mengelola data karyawan:
- Dashboard utama dengan statistik
- Multi-page navigation (Home, Karyawan, Jabatan, Departemen, Absensi, Gaji)
- Backend API untuk data management (CRUD)
- Database (MongoDB) untuk menyimpan data karyawan
- Admin panel untuk mengelola konten
- Live deployment di Vercel

---

## Fase 1: Setup & Dasar-Dasar Next.js

### 1.1 Instalasi Project
**Tujuan:** Student bisa membuat project Next.js baru dan menjalankannya.
- Apa itu Next.js dan kenapa kita pakai
- Instalasi menggunakan `create-next-app`
- Menjalankan development server
- **Kriteria selesai:** Dev server berjalan di localhost:3000

### 1.2 Memahami Struktur Folder
**Tujuan:** Student memahami fungsi setiap file & folder.
- `app/` — halaman dan routing
- `public/` — file statis (gambar, dll)
- `package.json` — dependencies
- `next.config.js` — konfigurasi
- `tsconfig.json` — TypeScript config
- **Kriteria selesai:** Student bisa menjelaskan fungsi masing-masing folder

### 1.3 Halaman Pertama
**Tujuan:** Student bisa mengedit dan membuat halaman.
- Apa itu `page.tsx`
- JSX/TSX basics
- Menampilkan teks, heading, paragraf
- **Kriteria selesai:** Halaman menampilkan konten custom

### 1.4 React Component Dasar
**Tujuan:** Student memahami konsep component.
- Apa itu component
- Membuat component terpisah
- Props — mengirim data ke component
- Children — component di dalam component
- **Kriteria selesai:** Minimal 3 component terpisah yang saling terhubung

### 1.5 Styling dengan Tailwind CSS
**Tujuan:** Student bisa men-styling component menggunakan Tailwind CSS.
- Apa itu Tailwind CSS (utility-first CSS framework)
- Cara kerja class utility (flex, p-4, text-lg, dll)
- Responsive design dengan prefix (sm:, md:, lg:)
- Dark mode & theming
- Custom configuration (`tailwind.config.ts`)
- **Kriteria selesai:** Component ter-style dengan Tailwind CSS

### 1.6 Landing Page
**Tujuan:** Membuat landing page yang menarik dengan Tailwind CSS.
- Header/Navbar component
- Hero section dengan gradient background (Tailwind gradients)
- Feature cards section dengan hover effects
- Footer component
- **Kriteria selesai:** Landing page responsif yang menarik secara visual

---

## Fase 2: Routing & Layout

### 2.1 File-based Routing
**Tujuan:** Memahami cara kerja routing di Next.js.
- Konsep App Router
- Membuat route baru dengan folder
- Route groups `(group)`
- **Kriteria selesai:** Minimal 4 route (/, /about, /projects, /contact)

### 2.2 Layout System
**Tujuan:** Membuat shared layout antar halaman.
- Root layout (`app/layout.tsx`)
- Nested layouts
- Template vs Layout
- **Kriteria selesai:** Layout dengan navbar & footer yang konsisten

### 2.3 Navigation
**Tujuan:** Navigasi antar halaman tanpa reload.
- `<Link>` component
- `usePathname()` untuk active state
- Programmatic navigation
- **Kriteria selesai:** Navbar dengan link aktif yang berfungsi

### 2.4 Dynamic Routes
**Tujuan:** Membuat halaman dengan parameter dinamis.
- `[slug]` routes
- `params` object
- `generateStaticParams`
- **Kriteria selesai:** Halaman project detail dengan dynamic route

### 2.5 Loading & Error Handling
**Tujuan:** Handling state loading dan error.
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- Suspense boundaries
- **Kriteria selesai:** Semua state (loading, error, 404) ter-handle

### 2.6 Multi-Page Website
**Tujuan:** Menggabungkan semua konsep routing.
- Halaman About dengan konten
- Halaman Projects (list)
- Halaman Contact (form UI)
- **Kriteria selesai:** Website multi-halaman yang lengkap

---

## Fase 3: Fullstack — API & Database

### 3.1 API Routes
**Tujuan:** Membuat backend API di Next.js.
- Route Handlers (`route.ts`)
- HTTP Methods (GET, POST, PUT, DELETE)
- Request & Response handling
- **Kriteria selesai:** API endpoint yang bisa ditest

### 3.2 Server Actions & Form Handling
**Tujuan:** Mengirim data dari frontend ke backend.
- `"use server"` directive
- Form dengan Server Actions
- Validation
- **Kriteria selesai:** Form yang berfungsi dengan Server Actions

### 3.3 Setup Database
**Tujuan:** Menghubungkan Next.js dengan MongoDB.
- Setup MongoDB Atlas
- Install & config Mongoose/MongoDB driver
- Connection helper
- Environment variables (`.env.local`)
- **Kriteria selesai:** Koneksi database berhasil

### 3.4 CRUD Operations
**Tujuan:** Operasi database basic.
- Create — menyimpan data baru
- Read — mengambil data
- Update — mengubah data
- Delete — menghapus data
- **Kriteria selesai:** Semua operasi CRUD berfungsi

### 3.5 Contact Form → Database
**Tujuan:** Form kontak yang menyimpan ke database.
- Schema/Model untuk pesan kontak
- Server Action untuk submit form
- Validasi input
- Success/Error feedback
- **Kriteria selesai:** Pesan dari form tersimpan di database

### 3.6 Data Fetching & Display
**Tujuan:** Menampilkan data dari database di halaman.
- Server Components untuk fetch data
- Menampilkan list projects dari database
- Detail project dari database
- **Kriteria selesai:** Halaman projects menampilkan data real dari DB

---

## Fase 4: Fitur Lanjutan

### 4.1 Autentikasi
**Tujuan:** Sistem login sederhana.
- Login page
- Session management (cookies/JWT)
- Logout
- **Kriteria selesai:** Admin bisa login dan logout

### 4.2 Admin Dashboard
**Tujuan:** Panel untuk mengelola konten.
- Dashboard layout
- List & manage projects
- List & manage contact messages
- Add/Edit/Delete projects
- **Kriteria selesai:** Admin bisa CRUD projects dari dashboard

### 4.3 Image Optimization
**Tujuan:** Menggunakan `next/image` untuk optimasi.
- `<Image>` component
- Responsive images
- Placeholder & blur
- **Kriteria selesai:** Semua gambar menggunakan `next/image`

### 4.4 SEO & Metadata
**Tujuan:** Optimasi untuk search engine.
- `metadata` export
- Dynamic metadata
- Open Graph tags
- `sitemap.ts` & `robots.ts`
- **Kriteria selesai:** Semua halaman memiliki metadata yang tepat

### 4.5 Middleware & Route Protection
**Tujuan:** Melindungi route admin.
- `middleware.ts`
- Redirect unauthorized users
- Protected API routes
- **Kriteria selesai:** Route admin hanya bisa diakses setelah login

---

## Fase 5: Polish & Deployment

### 5.1 Animasi & UI Polish
**Tujuan:** Membuat website terasa premium.
- CSS transitions & animations
- Hover effects
- Scroll animations
- Micro-interactions
- **Kriteria selesai:** Website terasa smooth dan premium

### 5.2 Responsive Design
**Tujuan:** Website terlihat bagus di semua device.
- Mobile-first approach
- Media queries
- Responsive navigation (hamburger menu)
- **Kriteria selesai:** Website responsif dari mobile hingga desktop

### 5.3 Performance Optimization
**Tujuan:** Website loading cepat.
- Lighthouse audit
- Code splitting
- Font optimization
- **Kriteria selesai:** Lighthouse score > 90

### 5.4 Deploy ke Vercel
**Tujuan:** Website live di internet.
- Push ke GitHub
- Connect ke Vercel
- Environment variables di Vercel
- Custom domain (opsional)
- **Kriteria selesai:** Website accessible via URL publik

### 5.5 Review Final
**Tujuan:** Recap semua yang sudah dipelajari.
- Review arsitektur project
- Best practices
- Next steps & resources lanjutan
- **Kriteria selesai:** Student paham keseluruhan flow Next.js fullstack
