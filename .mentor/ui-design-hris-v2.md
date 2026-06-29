---
name: ui-design-hris
description: >
  Design system untuk HRIS Admin — Manajemen Karyawan. Aktifkan saat ada kata:
  "buat halaman", "refine UI", "redesign", "komponen", "layout", "tampilan".
  Baca seluruh dokumen ini sebelum menulis satu baris kode.
role: Senior UI/UX Designer
version: 2.0 — Zero AI Slop
---

# HRIS Admin — UI Design Brief
## *Dibuat oleh seseorang yang pernah duduk di kursi HRD*

---

## 0. Brief Synthesis

```
// === DESIGN BRIEF ===
// Produk    : HRIS Admin — sistem manajemen karyawan
//             (karyawan, jabatan, departemen, payroll)
// Konteks   : Proyek portofolio — harus impressive pada pandangan
//             pertama recruiter yang me-review GitHub/portfolio
// Audiens   : Admin HR yang bekerja dengan sistem ini setiap hari
// Kepribadian: Kepala HRD senior — 15 tahun pengalaman, mejanya rapi,
//              ada kalender fisik di samping laptop, setiap dokumen
//              punya tempatnya. Hangat tapi tegas. Manusiawi tapi terstruktur.
// Satu kata : Terstruktur
// Signature : "Document row" — setiap baris tabel punya dua lapis
//             informasi seperti kartu arsip yang didigitalisasi
// Referensi : Kepadatan informasi Figma, bukan estetikanya
// Anti-ref  : Bukan Linear (terlalu dingin), bukan SaaS generic
//             (gradient biru), bukan Notion (terlalu editorial)
```

### Mengapa keputusan ini tepat untuk portofolio

Recruiter yang me-review portofolio developer melihat puluhan admin dashboard
yang semuanya terlihat sama: sidebar gelap, stat card besar, grid modul seragam.

Sistem ini harus terasa seperti dibuat oleh developer yang *pernah benar-benar
duduk di posisi HR* — bukan developer yang mengira-ngira kebutuhan HR dari luar.
Detail seperti "document row" di tabel, timestamp bergabung yang selalu visible,
dan copy yang menggunakan bahasa HR yang tepat — ini yang recruiter notice.

---

## 1. Color System

### Mengapa Amber, Bukan Biru

Biru adalah warna kepercayaan — dipakai bank, asuransi, dan 90% SaaS di dunia.
Amber adalah warna keputusan — ada di dokumen yang butuh perhatian, di cap
stempel PENTING, di lampu kuning sebelum berhenti. Di dunia HR yang penuh
keputusan tentang manusia, amber lebih jujur dari biru corporate.

Dan untuk portofolio: amber membedakan dari 95% admin dashboard yang ada di GitHub.

### Token

```css
:root {
  /* ── Canvas ─────────────────────────────────────── */
  --bg-canvas:    #FAFAF9;
  /* Warm off-white — bukan cool gray (#F9FAFB Tailwind yang terlalu biru)
     Perbedaan kecil tapi terasa: ini terasa seperti kertas, bukan layar */

  --bg-surface:   #FFFFFF;
  /* Card, sidebar, modal */

  --bg-elevated:  #F5F4F0;
  /* Hover row tabel, zebra stripe, input background */

  --bg-sunken:    #ECEAE4;
  /* Disabled state, read-only field */

  /* ── Ink ─────────────────────────────────────────── */
  --ink-primary:  #1C1917;
  /* Warm near-black (stone-950) — bukan #000 atau cool gray.
     Di layar, ini terasa lebih manusiawi dari pure black */

  --ink-secondary: #78716C;
  /* stone-500 — body text, deskripsi */

  --ink-muted:    #A8A29E;
  /* stone-400 — metadata, timestamp, placeholder */

  --ink-disabled: #D6D3D1;
  /* stone-300 — disabled elements */

  /* ── Accent — DIPAKAI SANGAT HEMAT ───────────────── */
  --accent:       #B45309;
  /* amber-700 — satu-satunya warna non-neutral.
     Muncul di: active sidebar indicator, tombol primary,
     focus ring, badge penting. Tidak lebih. */

  --accent-hover: #92400E;
  /* amber-800 — hover state dari accent */

  --accent-light: #FEF3C7;
  /* amber-50 — background badge, highlight subtle */

  --accent-text:  #92400E;
  /* Teks amber di atas accent-light — kontras 4.5:1 ✓ */

  /* ── Semantic ────────────────────────────────────── */
  --success:      #15803D;   /* green-700 */
  --success-bg:   #DCFCE7;   /* green-100 */
  --warning:      #B45309;   /* amber-700 — sama dengan accent */
  --warning-bg:   #FEF3C7;   /* amber-50 */
  --danger:       #B91C1C;   /* red-700 */
  --danger-bg:    #FEE2E2;   /* red-100 */

  /* ── Border ──────────────────────────────────────── */
  --border-default: #E7E5E0;
  /* Warm gray — bukan cool Tailwind gray (#E5E7EB).
     Selisihnya subtle tapi membuat seluruh sistem terasa hangat */

  --border-strong:  #D6D3D1;  /* Divider lebih tegas, table header */
  --border-focus:   #B45309;  /* Focus ring — sama dengan accent */
}
```

### Aturan Penggunaan

- `--accent` muncul **maksimal 3 tempat per halaman**: active nav, satu tombol
  primary, focus ring. Jika lebih dari itu, kurangi.
- Semua teks harus pakai CSS variable — tidak ada raw hex di komponen.
- Status SELALU teks + warna. Tidak pernah hanya warna.
- Kontras minimum: 4.5:1 body, 3:1 large text. Cek sebelum commit.

---

## 2. Typography

### Keputusan Font

```ts
// tailwind.config.ts
fontFamily: {
  serif: ['"Instrument Serif"', 'Georgia', 'serif'],
  // Untuk: page title di login, satu headline per halaman (jika ada)
  // Mengapa Instrument Serif, bukan Playfair/DM Serif/Georgia?
  // Instrument Serif lebih unexpected untuk admin tool — karakternya
  // ada di antara editorial dan formal, tidak jatuh ke salah satunya.
  // Dipakai SANGAT hemat: hanya di 1-2 tempat per sistem.

  sans: ['"Inter"', 'system-ui', 'sans-serif'],
  // Untuk: semua UI, label, body, navigasi, tabel
  // Tidak ada yang lebih baik untuk density tinggi di layar kecil.

  mono: ['"JetBrains Mono"', 'monospace'],
  // Untuk: semua angka (gaji, ID karyawan, timestamp angka),
  // status kode, data tabular
  // Angka dalam mono font memberikan kerataan kolom yang
  // tidak bisa dicapai proportional font.
},
```

### Type Scale

```
Page title (login headline):
  font-serif, 32px, weight 400, line-height 1.2
  — Hanya di halaman login. Tidak di dashboard atau tabel.

Section heading (nama halaman):
  font-sans, 18px, weight 600, line-height 1.3
  — "Karyawan", "Dashboard", "Jabatan"

Subsection label:
  font-sans, 11px, weight 500, UPPERCASE, letter-spacing 0.08em
  — Label grup di form, header kategori

Table header:
  font-sans, 11px, weight 500, UPPERCASE, letter-spacing 0.06em
  color: --ink-muted

Table row — primary:
  font-sans, 14px, weight 500, color --ink-primary

Table row — secondary (document row line 2):
  font-sans, 12px, weight 400, color --ink-muted

Body / form label:
  font-sans, 14px, weight 500, color --ink-secondary

Input value:
  font-sans, 14px, weight 400, color --ink-primary

Angka / ID / timestamp:
  font-mono, 13px, weight 400
  — Semua angka, kapanpun, di manapun.

Badge / status:
  font-sans, 11px, weight 500
```

---

## 3. Layout Architecture

### Keputusan: Sidebar Putih, Bukan Sidebar Gelap

Versi sebelumnya menggunakan sidebar gelap `#0F1623`. Ini diubah.

**Mengapa sidebar putih?**

Sidebar gelap adalah pilihan default setiap admin tool modern.
Linear, Vercel, Supabase, Railway — semuanya sidebar gelap. Untuk portofolio,
ini berarti langsung tenggelam dalam kesamaan.

Sidebar putih dengan border kanan tipis terasa seperti **dokumen kerja**,
bukan aplikasi SaaS. Ini konsisten dengan kepribadian "Kepala HRD senior"
yang kita pilih — mejanya rapi, dokumennya tersusun, tidak ada ornamen.

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)           │ MAIN CONTENT                    │
│ bg: --bg-surface          │ bg: --bg-canvas                 │
│ border-right: 1px         │                                 │
│ --border-default          │ ┌─ Page Header ───────────────┐ │
│                           │ │ Karyawan     [+ Tambah]     │ │
│ ┌──────────────────────┐  │ └─────────────────────────────┘ │
│ │ HRIS                 │  │                                 │
│ │ font-serif 18px      │  │ ┌─ Content ───────────────────┐ │
│ └──────────────────────┘  │ │                             │ │
│                           │ │  [Search]  [Filter]         │ │
│ ─ 32px gap ─────────────  │ │                             │ │
│                           │ │  [Tabel Data]               │ │
│ ▌ Karyawan    ← active    │ │                             │ │
│   Jabatan                 │ └─────────────────────────────┘ │
│   Departemen              │                                 │
│   Gaji                    │                                 │
│                           │                                 │
│ ─ auto push to bottom ──  │                                 │
│                           │                                 │
│   Bantuan                 │                                 │
│                           │                                 │
│ ─────────────────────────  │                                 │
│   [Avatar] Rayyan         │                                 │
└───────────────────────────┴─────────────────────────────────┘
```

**Active sidebar indicator:**
```css
/* Bukan background fill — bukan rounded pill */
.nav-item.active {
  border-left: 2px solid var(--accent);  /* amber */
  background: var(--bg-elevated);        /* sangat subtle */
  color: var(--ink-primary);
  font-weight: 500;
}
.nav-item:not(.active) {
  color: var(--ink-secondary);
  font-weight: 400;
}
.nav-item:hover:not(.active) {
  background: var(--bg-elevated);
  color: var(--ink-primary);
}
```

### Spacing Grid

Base unit: 4px. Semua nilai spacing adalah kelipatan 4.

```
4px   — gap antar elemen dalam satu komponen
8px   — padding dalam chip/badge
12px  — gap antar field dalam satu grup form
16px  — padding cell tabel, gap antar komponen
20px  — gap antar grup form
24px  — padding horizontal sidebar dan content
32px  — padding vertikal page header
48px  — gap antar section besar
```

Tidak ada nilai arbitrary. `13px`, `2.3rem`, `7px` tidak eksis.

---

## 4. Signature Element: Document Row

Ini yang membedakan sistem ini dari admin dashboard lain.

Setiap baris di tabel tidak menampilkan satu informasi per kolom — tapi
menampilkan **dua lapis informasi** yang membuat tabel terasa seperti
arsip dokumen yang didigitalisasi.

```
┌─────────────────────────────────────────────────────────┐
│ NAMA                JABATAN      STATUS    BERGABUNG     │  ← header tabel
│ ─────────────────────────────────────────────────────── │
│ Ahmad Rizki         Developer    ● Aktif   2 thn 3 bln  │  ← line 1: data
│ ahmad.rizki@co.id   Engineering            12 Mar 2023  │  ← line 2: meta
│ ─────────────────────────────────────────────────────── │
│ Siti Rahma          Designer     ● Aktif   1 thn 8 bln  │
│ siti.rahma@co.id    Product                20 Agt 2024  │
└─────────────────────────────────────────────────────────┘
```

**Anatomii document row:**

```tsx
// Line 1: data primer
<p className="text-sm font-medium text-ink-primary">Ahmad Rizki</p>

// Line 2: metadata — selalu ada, tidak pernah dikosongkan
<p className="text-xs font-mono text-ink-muted">
  ahmad.rizki@co.id · Engineering · 12 Mar 2023
</p>
```

**Mengapa ini bukan AI slop:**
Pattern ini muncul dari pemahaman bahwa di dunia HR nyata, nama karyawan
tidak pernah berdiri sendiri. Selalu ada email, departemen, tanggal — dan
semuanya relevan dalam konteks yang sama. Ini bukan keputusan estetika,
ini keputusan yang datang dari memahami workflows HR.

---

## 5. Komponen — Keputusan yang Non-Obvious

### 5.1 Stat Card — Dibalik dari Konvensi

Konvensi umum: angka besar di tengah, label kecil di bawah.
Keputusan di sini: **label di atas, angka dalam mono di bawah, lebih kecil dari yang biasanya.**

```
┌──────────────────────────┐
│ TOTAL KARYAWAN           │  ← label: 11px uppercase mono, --ink-muted
│                          │
│ 42 orang                 │  ← angka: 24px font-mono, --ink-primary
│ +3 bulan ini ↑           │  ← trend: 12px, --success atau --danger
└──────────────────────────┘
```

```tsx
// Angka BUKAN heading HTML
// Bukan <h2> atau <h3>
// Gunakan <p> atau <span> dengan ukuran yang tepat

<div className="stat-card">
  <span className="label">TOTAL KARYAWAN</span>
  <p className="value font-mono">
    {value} <span className="unit">{unit}</span>
  </p>
  {trend && (
    <span className={`trend ${trend.direction}`}>
      {trend.label}
    </span>
  )}
</div>
```

**Empty state stat card — bukan "0" atau "–":**
```tsx
// Saat data kosong, jangan tampilkan angka
// Tampilkan ajakan aksi
{isEmpty ? (
  <p className="empty-hint">
    Belum ada data ·{' '}
    <a href="/karyawan/tambah">Tambah sekarang</a>
  </p>
) : (
  <p className="value font-mono">{value} {unit}</p>
)}
```

---

### 5.2 Login Page

Copy "Kelola Kapital Manusia Terpadu." dipertahankan — ini satu-satunya
copy di sistem yang benar-benar berkarakter. Jangan ubah.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  bg: --bg-canvas                                         │
│  Subtle dot grid pattern: radial-gradient titik 1px      │
│  color: --border-default, spacing 24px × 24px            │
│                                                          │
│         ┌────────────────────────────────┐               │
│         │ bg: --bg-surface               │               │
│         │ border: 1px --border-default   │               │
│         │ border-radius: 8px             │               │
│         │ padding: 40px                  │               │
│         │                                │               │
│         │  HRIS                          │               │
│         │  [font-serif, 14px, --accent]  │               │
│         │                                │               │
│         │  Kelola Kapital                │               │
│         │  Manusia Terpadu.              │               │
│         │  [font-serif, 28px, --ink-primary]│            │
│         │                                │               │
│         │  ─────────────────────────     │               │
│         │                                │               │
│         │  Email atau Username           │               │
│         │  [_________________________]   │               │
│         │                                │               │
│         │  Kata Sandi                    │               │
│         │  [_____________________] [👁]  │               │
│         │                                │               │
│         │  [    Akses Dashboard    ]     │               │
│         │  bg: --accent, text: white     │               │
│         │  hover: --accent-hover         │               │
│         │                                │               │
│         │  HRIS Admin v1.0               │               │
│         │  [11px, --ink-muted]           │               │
│         └────────────────────────────────┘               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Dot grid pattern CSS:**
```css
.login-bg {
  background-color: var(--bg-canvas);
  background-image: radial-gradient(
    circle,
    var(--border-default) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

Ini bukan dekorasi — ini memberikan kedalaman pada background tanpa
mengganggu fokus pada card. Terasa seperti kertas grafik, konsisten
dengan kepribadian "terstruktur".

---

### 5.3 Tabel

```tsx
// Header: uppercase, tracking, mono, muted
// Baris: document row pattern (2 baris)
// Hover: --bg-elevated (bukan shadow)
// Aksi: dropdown ⋯ — BUKAN deretan tombol

// Status badge — wajib teks + warna
<Badge variant="active">
  <span aria-hidden>●</span> Aktif
</Badge>

<Badge variant="inactive">
  <span aria-hidden>○</span> Nonaktif
</Badge>
```

**Kolom yang wajib ada di tabel Karyawan:**
Nama (+ email + dept), Jabatan, Status, Lama Bergabung, Aksi (⋯)

**Yang tidak boleh ada:**
- Kolom ID yang panjang — tampilkan hanya 4 karakter terakhir jika perlu
- Kolom "Dibuat pada" yang sama dengan "Bergabung" — pilih satu
- Tombol Edit dan Hapus inline — pindah ke dropdown ⋯

---

### 5.4 Form

```tsx
// Label selalu di atas — BUKAN floating label
// Floating label menyembunyikan konteks saat field sudah terisi

// Input: border bawah saja, bukan box border
// Ini memberikan kesan dokumen yang sedang diisi, bukan form digital

<div className="field">
  <label htmlFor="nama">
    Nama Lengkap
    <span aria-label="wajib diisi" className="required">*</span>
  </label>
  <input
    id="nama"
    type="text"
    placeholder="Masukkan nama lengkap"
    // border-bottom: 1px solid --border-default
    // focus: border-bottom-color: --accent
  />
  {error && (
    <p className="error-msg" role="alert">
      {error} {/* Harus spesifik — lihat bagian Copy */}
    </p>
  )}
</div>
```

**Grouping field:**
Field dikelompokkan per konteks dengan label grup uppercase:

```
INFORMASI DASAR          ← label grup: 11px uppercase, --ink-muted
  Nama Lengkap
  Email             No. Telepon

POSISI & STRUKTUR        ← label grup
  Jabatan           Departemen
  Tanggal Bergabung Status
```

Bukan semua field dijejer tanpa pembagian.

---

## 6. States — Tidak Ada yang Boleh Dilewati

### Loading

```tsx
// Skeleton, bukan spinner untuk konten besar
// Skeleton merepresentasikan struktur NYATA dari konten

// Tabel skeleton: 5 baris, tiap baris 2 lapis (document row pattern)
function TableSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat data karyawan...">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="table-row-skeleton">
          <div className="skeleton-line w-40 h-3.5" />  {/* nama */}
          <div className="skeleton-line w-32 h-3 mt-1.5 opacity-60" />  {/* email */}
        </div>
      ))}
    </div>
  )
}
```

### Empty

```tsx
// Bukan: "Tidak ada data"
// Harus: konteks + aksi spesifik

const emptyStates = {
  karyawan: {
    title: "Belum ada karyawan terdaftar",
    body: "Mulai dengan menambahkan karyawan pertama ke sistem HRIS.",
    action: "Tambah Karyawan Pertama",
  },
  jabatan: {
    title: "Belum ada jabatan yang dibuat",
    body: "Buat struktur jabatan sebelum mendaftarkan karyawan.",
    action: "Buat Jabatan",
  },
  searchResult: {
    title: `Tidak ditemukan`,
    body: (query: string) => `Tidak ada karyawan yang cocok dengan "${query}"`,
    action: "Hapus pencarian",
  },
}
```

### Error

```tsx
// Error harus memberikan jalan keluar
<ErrorState
  title="Gagal memuat data karyawan"
  body="Koneksi ke server terputus. Coba periksa koneksi internet kamu."
  primaryAction={{ label: "Coba Lagi", onClick: refetch }}
  secondaryAction={{ label: "Hubungi Bantuan", href: "/bantuan" }}
/>
```

### Success Toast

```tsx
// Posisi: kanan bawah
// Auto-dismiss: 4 detik
// Pesan KONSISTEN dengan label tombol yang dipencet

const toastMessages = {
  tambahKaryawan: (nama: string) => `${nama} berhasil ditambahkan`,
  simpanPerubahan: "Perubahan berhasil disimpan",
  hapusKaryawan:  (nama: string) => `${nama} berhasil dihapus`,
  // BUKAN: "Berhasil!" atau "Data tersimpan" atau "OK"
}
```

---

## 7. Copy Guidelines — Bahasa yang Tepat

### Prinsip

Tulis dari sisi pengguna HR, bukan dari sisi sistem.
Pengguna HR berhadapan dengan manusia — bahasanya harus mencerminkan itu.

### Navigasi

```
✅ Karyawan       ❌ Manajemen Karyawan
✅ Jabatan        ❌ Data Jabatan
✅ Departemen     ❌ Struktur Departemen
✅ Gaji           ❌ Sistem Penggajian
✅ Bantuan        ❌ Help Center / FAQ
```

### Tombol Aksi — Spesifik

```
✅ Tambah Karyawan          ❌ Tambah / Create / + New
✅ Simpan Perubahan         ❌ Update / Submit / Simpan
✅ Hapus Karyawan           ❌ Delete / Hapus
✅ Akses Dashboard          ❌ Login / Masuk / Submit
✅ Ekspor ke Excel          ❌ Export / Unduh Data
```

### Konfirmasi Hapus — Sebutkan Nama

```
Dialog title: "Hapus Ahmad Rizki?"

Body:
"Semua data Ahmad Rizki akan dihapus secara permanen, termasuk
riwayat jabatan dan catatan gaji. Tindakan ini tidak dapat dibatalkan."

Tombol: [Batalkan]  [Hapus Ahmad Rizki]
        ↑ kiri       ↑ kanan, warna --danger
```

Bukan "Apakah Anda yakin?" — ini tidak memberikan informasi apapun.

### Error Messages — Spesifik dan Actionable

```
✅ "Email sudah digunakan karyawan lain"
✅ "Nama minimal 3 karakter — saat ini 2 karakter"
✅ "Tanggal bergabung tidak boleh setelah hari ini"
✅ "Pilih setidaknya satu departemen"

❌ "Input tidak valid"
❌ "Terjadi kesalahan"
❌ "Error 400"
❌ "Formulir tidak lengkap"
```

---

## 8. Aksesibilitas — Wajib, Bukan Opsional

```tsx
// 1. Semua input HARUS punya label terhubung
<label htmlFor="email-karyawan">Email</label>
<input id="email-karyawan" type="email" />
// BUKAN hanya placeholder

// 2. Semua tombol ikon HARUS punya aria-label yang menyebut objeknya
<button aria-label="Hapus karyawan Ahmad Rizki">
  <TrashIcon aria-hidden />
</button>
// BUKAN aria-label="Hapus" saja

// 3. Status badge HARUS punya teks
<span className="badge-active">
  <span aria-hidden>●</span>
  <span>Aktif</span>
</span>

// 4. Tabel HARUS punya scope
<th scope="col">Nama Karyawan</th>
<th scope="col">Status</th>

// 5. Focus ring TIDAK BOLEH disembunyikan
:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
// Tidak ada outline: none di production

// 6. Error messages harus role="alert" supaya screen reader membacanya
<p role="alert" className="error-msg">{error}</p>

// 7. Loading state harus aria-busy
<div aria-busy="true" aria-label="Memuat data karyawan...">
  <TableSkeleton />
</div>
```

---

## 9. Responsif

Sistem ini **desktop-first**. Admin HR tidak bekerja dari HP.

```
1280px+ : Layout penuh — sidebar 240px + content
1024px  : Sidebar collapse ke 60px icon-only
          Tooltip label muncul saat hover icon
          State disimpan di localStorage
768px   : Sidebar hidden, toggle via hamburger
          Content full-width
< 768px : Tidak dioptimalkan tapi tidak boleh broken
          Tidak ada horizontal overflow
```

---

## 10. Yang Dilarang — Tanpa Pengecualian

Tidak ada negosiasi untuk daftar ini.

| Dilarang | Kenapa | Gantinya |
|---|---|---|
| Angka stat sebagai `<h2>` atau `<h3>` | Ini bukan heading konten | `<p>` dengan `font-mono` ukuran tepat |
| `rounded-2xl` di card | Default Tailwind, bukan keputusan | `rounded-lg` (8px) dari design system |
| `shadow-lg` di card | Noise visual | `shadow-sm` hanya modal dan dropdown |
| Gradient di hero, sidebar, atau header | Tidak punya identitas | Solid color dari token |
| Grid 4 kolom seragam untuk semua modul | Abaikan hierarki informasi | 2 kolom, atau list dengan proporsi berbeda |
| Ikon besar dekoratif di stat card | Ornamen tanpa informasi | Tidak ada ikon, atau ikon 14px informatif |
| Placeholder sebagai satu-satunya label | Hilang saat diisi, tidak accessible | Label di atas field selalu |
| "Berhasil!" sebagai toast | Tidak bilang apa yang berhasil | Nama objek + aksi: "Ahmad berhasil disimpan" |
| Floating label | Menyembunyikan konteks saat terisi | Label statis di atas field |
| Warna status tanpa teks | Tidak accessible | Teks + warna, selalu |
| Lorem ipsum atau angka dummy "0" tanpa konteks | Sembunyikan masalah layout | Empty state dengan aksi |
| Sidebar gelap dengan accent neon | AI admin aesthetic #1 | Sidebar putih dengan accent amber hemat |
| Tombol "→" generik | Tidak informatif | Teks spesifik per aksi |

---

## 11. Checklist Final — Tidak Boleh Skip

```
IDENTITAS
[ ] Design brief ada sebagai komentar di layout utama
[ ] Semua color token di globals.css — tidak ada raw hex di komponen
[ ] Font loaded via next/font — tidak ada FOUT

VISUAL
[ ] Tidak ada satu pun item dari tabel "Yang Dilarang"
[ ] Spacing semua dari 4px grid — cek dengan devtools
[ ] Angka di tabel dan stat menggunakan font-mono
[ ] Sidebar active state: border-left 2px amber, bukan background fill
[ ] Document row pattern terpasang di semua tabel
[ ] --accent muncul maksimal 3 tempat per halaman

STATES
[ ] Loading: skeleton yang merepresentasikan struktur nyata
[ ] Empty: teks kontekstual + tombol aksi spesifik
[ ] Error: pesan spesifik + tombol recovery
[ ] Success: toast dengan nama objek + aksi

AKSESIBILITAS
[ ] Semua input punya label dengan htmlFor
[ ] Semua tombol ikon punya aria-label yang menyebut objeknya
[ ] Status badge selalu punya teks + warna
[ ] Tabel punya scope di semua header
[ ] Focus ring visible di semua elemen interaktif
[ ] Loading state punya aria-busy + aria-label

COPY
[ ] Tidak ada "Get Started", "Submit", "Update", "Delete"
[ ] Error message spesifik dan actionable
[ ] Konfirmasi hapus menyebutkan nama item
[ ] Toast konsisten dengan label tombol

RESPONSIF
[ ] 1280px: layout penuh
[ ] 1024px: sidebar collapse ke 60px
[ ] 768px: sidebar tersembunyi
[ ] Tidak ada horizontal overflow di semua breakpoint
```

---

*HRIS Admin — UI Design Brief v2.0*
*Senior UI/UX Designer · Zero AI Slop · Juni 2026*

> "Sistem yang baik tidak terasa seperti sistem.
>  Pengguna hanya merasakan pekerjaannya selesai."
