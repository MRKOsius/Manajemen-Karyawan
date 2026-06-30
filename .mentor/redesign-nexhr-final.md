# Redesign NexHR — Spec Final

Digabung dari dua sumber: temuan langsung di kode repo (`globals.css`, `page.tsx`) dan spesifikasi token/komponen dari brief desain yang diupload. Bagian naratif/justifikasi yang tidak actionable dari brief asli sudah dibuang — yang tersisa di sini hanya token, aturan, dan alasan teknis yang bisa dicek.

Perubahan arah dari dokumen redesign saya sebelumnya: **tema berubah dari dark mode ke light mode** mengikuti brief. Ini perubahan besar, bukan revisi kecil — pastikan ini memang yang Anda mau sebelum implementasi, karena ini mengganti hampir seluruh token warna termasuk yang dipakai shadcn.

---

## 1. Color Tokens

```css
:root {
  /* Canvas */
  --bg-canvas:    #FAFAF9;  /* warm off-white, bukan cool gray Tailwind default */
  --bg-surface:   #FFFFFF;  /* card, sidebar, modal */
  --bg-elevated:  #F5F4F0;  /* hover row, zebra stripe, input bg */
  --bg-sunken:    #ECEAE4;  /* disabled, read-only field */

  /* Ink */
  --ink-primary:   #1C1917;  /* warm near-black, stone-950 */
  --ink-secondary: #78716C;  /* body text, deskripsi */
  --ink-muted:     #A8A29E;  /* metadata, timestamp, placeholder */
  --ink-disabled:  #D6D3D1;

  /* Accent — satu warna non-neutral, dipakai hemat */
  --accent:       #B45309;  /* amber-700 */
  --accent-hover: #92400E;
  --accent-light: #FEF3C7;
  --accent-text:  #92400E;  /* kontras 4.5:1 di atas accent-light */

  /* Semantic */
  --success:    #15803D;
  --success-bg: #DCFCE7;
  --danger:     #B91C1C;
  --danger-bg:  #FEE2E2;

  /* Border */
  --border-default: #E7E5E0;
  --border-strong:  #D6D3D1;
  --border-focus:   #B45309;
}
```

**Aturan pakai, bukan saran:**
- `--accent` muncul maksimal 3 tempat per halaman: indikator nav aktif, satu tombol primary, focus ring. Link sekunder (misalnya "Lihat Semua →" di dashboard) pakai `--ink-secondary` dengan underline saat hover, bukan accent.
- Status selalu teks + warna, tidak pernah warna saja — relevan langsung untuk badge yang sudah ada di kode (`.badge-active`, `.badge-inactive`, `.badge-danger`).
- Tidak ada raw hex di komponen — semua lewat CSS variable.

### Yang harus diganti dari `globals.css` yang ada sekarang

Token `--sidebar` di baris 60-67 saat ini hardcode terang (`oklch(0.985 0 0)`) sementara sisanya gelap — itu sudah sesuai arah light mode baru ini, tapi map ulang ke token kustom supaya tidak drift:

```css
--sidebar: var(--bg-surface);
--sidebar-foreground: var(--ink-primary);
--sidebar-border: var(--border-default);
--sidebar-accent: var(--bg-elevated);
--sidebar-accent-foreground: var(--accent);
```

Seluruh blok `.dark { ... }` (baris 288-334) di file CSS yang ada perlu dihapus atau dijadikan opsional eksplisit kalau Anda tidak menyediakan toggle dark/light — jangan biarkan dua tema setengah jadi nyangkut di kode.

---

## 2. Typography

```ts
fontFamily: {
  serif: ['"Instrument Serif"', 'Georgia', 'serif'],  // hanya di login & heading sangat terbatas
  sans: ['"Inter"', 'system-ui', 'sans-serif'],         // semua UI
  mono: ['"JetBrains Mono"', 'monospace'],              // semua angka: gaji, ID, timestamp
}
```

| Elemen | Style |
|---|---|
| Page title (login) | `font-serif`, 32px, weight 400 — hanya di halaman login |
| Section heading | `font-sans`, 18px, weight 600 |
| Subsection / form group label | `font-sans`, 11px, weight 500, uppercase, tracking 0.08em |
| Table header | `font-sans`, 11px, weight 500, uppercase, `--ink-muted` |
| Table row primer | `font-sans`, 14px, weight 500, `--ink-primary` |
| Table row sekunder (baris ke-2) | `font-sans`, 12px, `--ink-muted` |
| Form label | `font-sans`, 14px, weight 500, `--ink-secondary` |
| Angka (gaji/ID/timestamp) | `font-mono`, 13px — selalu, di manapun ada angka |

Spacing: base unit 4px, kelipatan 4 saja (4/8/12/16/20/24/32/48px). Tidak ada nilai arbitrary seperti `13px` atau `2.3rem`.

---

## 3. Sidebar — Sudah Sesuai, Tidak Perlu Diubah

**Koreksi dari versi sebelumnya**: saya sempat klaim sidebar tidak punya state aktif/hover sama sekali. Itu salah — setelah membaca `Sidebar.tsx` langsung, state-nya sudah diimplementasikan via Tailwind class di komponen (bukan di `globals.css`, makanya tidak terlihat saat saya hanya baca CSS):

```tsx
className={`... ${isActive
    ? "bg-elevated text-ink-primary font-medium border-l-2 border-accent rounded-l-none"
    : "text-ink-secondary hover:bg-elevated hover:text-ink-primary"
}`}
```

Ini persis sesuai pola yang diminta: border-left tipis + background subtle untuk item aktif, bukan pill rounded atau fill solid. Tidak ada yang perlu diubah di sini.

---

## 4. Pola Tabel: Document Row

Setiap baris tabel menampilkan dua lapis data, bukan satu baris flat per kolom:

```
Ahmad Rizki         Developer    ● Aktif   2 thn 3 bln
ahmad.rizki@co.id   Engineering            12 Mar 2023
```

```tsx
<p className="text-sm font-medium text-ink-primary">Ahmad Rizki</p>
<p className="text-xs font-mono text-ink-muted">
  ahmad.rizki@co.id · Engineering · 12 Mar 2023
</p>
```

Ini langsung berlaku untuk tabel di `/karyawan` — baris metadata (email, departemen, tanggal gabung) sebaiknya selalu ada, tidak pernah dikosongkan, karena itulah yang membuat tabel scannable tanpa harus expand row.

**Soal avatar**: tabel karyawan (`karyawan/page.tsx` baris 131-137) **sudah** pakai pola ini dengan benar — fallback ke inisial 2 huruf saat `karyawan.avatar` kosong, bukan generator pihak ketiga. Yang masih bermasalah hanya `src/app/page.tsx` (dashboard) baris 142-148, yang masih hardcode DiceBear (`api.dicebear.com/9.x/avataaars`). Perbaikannya: samakan dashboard dengan pola yang sudah dipakai di tabel karyawan, bukan membuat pola baru.

---

## 5. Stat Card — Dibalik dari Pola Umum

Bukan: angka besar di tengah, label kecil di bawah (pola generic SaaS).
Pakai: label kecil di atas (uppercase, mono, muted), angka di bawah lebih kecil dari biasa.

```tsx
<div className="stat-card">
  <span className="label">TOTAL KARYAWAN</span>
  <p className="value font-mono">
    {value} <span className="unit">{unit}</span>
  </p>
  {trend && <span className={`trend ${trend.direction}`}>{trend.label}</span>}
</div>
```

Angka stat **bukan** `<h2>`/`<h3>` — pakai `<p>` dengan ukuran tepat, karena ini bukan heading konten halaman.

**Tidak ada ikon dekoratif di stat card.** Ini koreksi dari saran saya sebelumnya yang merekomendasikan menambah ikon `lucide-react` di tiap kartu — itu salah, karena menambah elemen visual yang berebut perhatian dengan accent yang sudah dibatasi "maksimal 3 tempat per halaman". Kalau kartu butuh dibedakan secara cepat, biarkan label teks yang melakukan itu, bukan ikon.

**Empty state stat card** — kode yang ada di `page.tsx` (baris 56-59, dst) sudah benar arahnya (tampilkan link aksi, bukan angka 0), pertahankan pola itu.

---

## 6. Form

- Label selalu statis di atas field — bukan floating label (floating label menyembunyikan konteks saat field sudah terisi).
- Input pakai border-bottom saja, bukan box border penuh — kesan dokumen yang sedang diisi.
- Field dikelompokkan per konteks dengan label grup uppercase (mis. "INFORMASI DASAR", "POSISI & STRUKTUR"), bukan dijejer rata tanpa pembagian.
- Error pakai `role="alert"`, dan pesannya harus spesifik: "Email sudah digunakan karyawan lain" — bukan "Input tidak valid".

Ini perlu disambungkan ke validasi Zod yang sudah ada di backend repo — pastikan pesan error dari Zod schema yang sampai ke UI memang sespesifik itu, bukan pesan generik default.

---

## 7. States

**Loading**: skeleton yang merepresentasikan struktur nyata konten (5 baris tabel, tiap baris 2 lapis sesuai document row pattern), bukan shimmer generik yang menutup seluruh layout. Skeleton yang ada sekarang di `globals.css` (baris 258-285) baru animasi shimmer dasar — perlu dibentuk ulang per-komponen, bukan satu skeleton block generik.

**Empty**: konteks + aksi spesifik, bukan "Tidak ada data":
```
title: "Belum ada karyawan terdaftar"
body: "Mulai dengan menambahkan karyawan pertama ke sistem HRIS."
action: "Tambah Karyawan Pertama"
```

**Error**: pesan spesifik + tombol recovery jelas (Coba Lagi / Hubungi Bantuan), bukan stack trace bocor ke layar. `error.tsx` yang sudah ada di repo perlu dicek apakah sudah mengikuti pola ini.

**Konfirmasi hapus**: sebutkan nama item, bukan "Apakah Anda yakin?":
```
"Hapus Ahmad Rizki?"
"Semua data Ahmad Rizki akan dihapus permanen, termasuk riwayat jabatan dan catatan gaji. Tindakan ini tidak dapat dibatalkan."
[Batalkan]  [Hapus Ahmad Rizki]
```

**Toast sukses**: sebut nama objek + aksi — "Ahmad Rizki berhasil ditambahkan", bukan "Berhasil!".

---

## 8. Copy — Bahasa Navigasi & Tombol

```
✅ Karyawan       ❌ Manajemen Karyawan
✅ Jabatan        ❌ Data Jabatan
✅ Tambah Karyawan ❌ Tambah / Create / + New
✅ Simpan Perubahan ❌ Update / Submit
```

Tombol aksi harus spesifik menyebut objeknya, bukan label generik.

---

## 9. Aksesibilitas — Wajib

```tsx
// Label selalu terhubung, bukan hanya placeholder
<label htmlFor="email-karyawan">Email</label>
<input id="email-karyawan" type="email" />

// Tombol ikon: aria-label sebutkan objek spesifik
<button aria-label="Hapus karyawan Ahmad Rizki"><TrashIcon aria-hidden /></button>

// Badge status: teks + warna, selalu
<span className="badge-active"><span aria-hidden>●</span><span>Aktif</span></span>

// Tabel: scope di tiap header
<th scope="col">Nama Karyawan</th>

// Focus ring tidak boleh disembunyikan
:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }

// Loading state
<div aria-busy="true" aria-label="Memuat data karyawan...">
```

Kontras minimum 4.5:1 untuk body text, 3:1 untuk teks besar — cek tiap kombinasi warna sebelum commit, terutama badge kecil 11px yang kontrasnya gampang gagal.

---

## 10. Responsif

Desktop-first — admin HR umumnya bekerja dari desktop, bukan HP.

```
1280px+ : layout penuh, sidebar 240px
1024px  : sidebar collapse ke 60px icon-only, tooltip muncul saat hover, state disimpan localStorage
768px   : sidebar hidden, toggle hamburger
<768px  : tidak dioptimalkan penuh, tapi tidak boleh ada horizontal overflow
```

---

## 11. Larangan — Ringkas

| Dilarang | Gantinya |
|---|---|
| Angka stat sebagai `<h2>`/`<h3>` | `<p>` dengan `font-mono` |
| `rounded-2xl`, `shadow-lg` di card | `rounded-lg` (8px), `shadow-sm` hanya untuk modal/dropdown |
| Gradient di sidebar/header | Solid color dari token |
| Ikon dekoratif besar di stat card | Tidak ada ikon, atau maksimal 14px informatif |
| Avatar generator pihak ketiga (DiceBear dkk) untuk data riil | Inisial nama dalam lingkaran solid |
| Floating label | Label statis di atas field |
| Warna status tanpa teks | Teks + warna, selalu |
| "Berhasil!" sebagai toast | Nama objek + aksi spesifik |
| Tombol "→" generik tanpa konteks | Teks aksi spesifik |

---

## 12. Verifikasi — Sudah Dicek Langsung, Bukan Asumsi

Saya sudah baca `Sidebar.tsx`, `EmptyState.tsx`, `ActionDropdown.tsx`, `karyawan/page.tsx`, `karyawan/tambah/KaryawanForm.tsx`, `error.tsx`, dan `loading.tsx` secara langsung. Hasilnya: banyak rekomendasi di dokumen ini **sudah diimplementasikan dengan benar** di repo, jadi beberapa poin di atas perlu dikoreksi.

### Sudah benar, tidak perlu diubah

- **Sidebar active state** (bagian 3) — sudah ada di `Sidebar.tsx` baris 43-47, persis: `border-l-2 border-accent` + `bg-elevated` + `font-medium` untuk item aktif, hover state untuk item non-aktif. Asumsi saya sebelumnya bahwa sidebar "tidak punya CSS untuk state aktif" itu **salah** — yang tidak ada cuma di `globals.css`, tapi state-nya sudah diimplementasi via Tailwind class langsung di komponen.
- **Avatar inisial di tabel karyawan** (bagian 4) — `karyawan/page.tsx` baris 131-137 sudah fallback ke inisial nama 2 huruf kalau `karyawan.avatar` kosong, bukan DiceBear. Masalah avatar generator pihak ketiga **hanya ada di dashboard** (`page.tsx` baris 142-148, halaman utama `/`), bukan di tabel karyawan. Perbaikan harus diarahkan spesifik ke file itu saja.
- **Document row pattern** (bagian 4) — sudah jalan di tabel karyawan: nama di baris atas, email+departemen di baris bawah dengan `font-mono text-ink-muted`.
- **Empty state** (bagian 7) — `EmptyState.tsx` sudah generik dan reusable, dipanggil dengan title/body/action kontekstual sesuai pola yang diminta, bukan "Tidak ada data".
- **Loading skeleton** (bagian 7) — `loading.tsx` sudah merepresentasikan struktur asli (5 baris, 2 lapis per baris meniru document row, `aria-busy` + `aria-label`). Klaim saya sebelumnya bahwa skeleton "menutup seluruh layout dengan shimmer generik" itu **salah** — sudah berbentuk skeleton per-komponen.
- **Konfirmasi hapus & toast** (bagian 7) — `ActionDropdown.tsx` baris 88-90 sudah menyebut nama entity di judul dialog ("Hapus {entityName}?") dan toast sukses (`${entityName} berhasil dihapus`), aksi sudah di dropdown `⋯` bukan tombol inline, persis sesuai spec.
- **Form: label statis + grouping** (bagian 6) — `KaryawanForm.tsx` sudah pakai label statis di atas field (bukan floating label) dan grouping per konteks dengan heading uppercase ("Informasi Dasar", "Posisi & Struktur").

### Masih perlu diperbaiki (gap nyata)

- **Avatar dashboard** — hanya `src/app/page.tsx` baris 142-148 yang masih pakai DiceBear. Ganti ke pola inisial yang sudah dipakai di `karyawan/page.tsx`, supaya konsisten di seluruh aplikasi, bukan cuma di satu halaman.
- **Error message tidak punya `role="alert"`** — di `KaryawanForm.tsx` baris 38, 43, 60, 70, pesan error Zod (`state?.error?.nama[0]`, dst) ditampilkan tanpa `role="alert"`, jadi screen reader tidak otomatis membacanya. Tambahkan `role="alert"` ke tiap `<p>` error.
- **`error.tsx` belum sespesifik spec** — pesan saat ini generik dan agak puitis ("Rantai koneksi terputus atau database sedang mengatur ulang struktur memori") padahal `error.digest` sudah ditangkap tapi tidak dipakai untuk membedakan jenis error. Tidak ada secondary action ("Hubungi Bantuan") seperti yang diminta di bagian 7 — hanya ada tombol retry.
- **Token `--sidebar` di `globals.css`** — masih perlu disinkronkan ke token kustom sesuai bagian 1, karena bug-nya ada di level CSS variable, terlepas dari implementasi komponen yang sudah benar.
- **Light mode migration** — belum dicek di file lain (`departemen/`, `gaji/`, `jabatan/`, `absensi/`, `login/`) apakah konsisten pakai token yang sama. Karena migrasi dark→light mengubah token dasar, semua halaman ini perlu diperiksa satu per satu untuk memastikan tidak ada hardcoded dark-mode value yang tertinggal.

Kesimpulan: codebase ini jauh lebih matang dari asumsi awal saya — sebagian besar pola di brief v2 sudah diimplementasikan dengan benar oleh developer aslinya. Pekerjaan yang tersisa lebih sempit dari yang saya kira: ganti avatar dashboard, tambah `role="alert"`, perbaiki copy `error.tsx`, sinkronkan token sidebar, dan audit halaman lain untuk migrasi tema.
