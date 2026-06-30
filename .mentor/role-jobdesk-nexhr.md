# Dokumen Role & Job Desk — NexHR

Dokumen ini mencakup tiga lapis: kondisi RBAC saat ini di kode (faktual), spek RBAC yang diusulkan (target), dan job desk masing-masing role berdasarkan spek itu. Modul yang dicakup mengikuti entitas yang benar-benar ada di `prisma/schema.prisma`: Karyawan, Jabatan, Departemen, Gaji, Absensi, dan Akun User.

---

## 1. Kondisi Saat Ini di Kode (Baseline)

Hanya ada satu aturan RBAC yang benar-benar dieksekusi, di `src/proxy.ts` baris 36-39: rute `/gaji` hanya bisa diakses `SUPER_ADMIN`. Di luar itu, `HR_STAFF` punya akses yang identik dengan `SUPER_ADMIN` di semua modul lain — termasuk hapus data karyawan, ubah struktur departemen, dan ubah jabatan. Ini baseline yang jadi titik berangkat spek di bawah, bukan kondisi akhir yang direkomendasikan.

---

## 2. Matriks Akses yang Diusulkan

Skala aksi: **Lihat** (read-only), **Kelola** (tambah/edit), **Hapus** (hapus permanen atau nonaktifkan).

| Modul | SUPER_ADMIN | HR_STAFF |
|---|---|---|
| Dashboard (ringkasan) | Lihat semua kartu termasuk Gaji | Lihat semua kecuali kartu Gaji |
| Karyawan — data dasar | Lihat, Kelola, Hapus permanen | Lihat, Kelola, Nonaktifkan (bukan hapus permanen) |
| Jabatan | Lihat, Kelola, Hapus | Lihat saja |
| Departemen | Lihat, Kelola, Hapus | Lihat saja |
| Absensi | Lihat, Kelola, Koreksi | Lihat, Kelola, Koreksi |
| Gaji | Lihat, Kelola, Hapus | Tidak ada akses |
| Akun User (Admin) | Lihat, Kelola, Hapus, Ubah role | Tidak ada akses |
| Ekspor data (Excel) | Semua modul | Karyawan & Absensi saja |

**Alasan tiap baris, bukan sekadar tabel kosong:**

- **Jabatan & Departemen dibatasi jadi read-only untuk `HR_STAFF`** karena keduanya struktur organisasi yang dipakai bersama lintas karyawan — kalau staff operasional bisa mengubahnya sembarangan, satu kesalahan input bisa mempengaruhi banyak data karyawan sekaligus (relasi `jabatanId`/`departemenID` di schema bersifat wajib, bukan opsional).
- **Karyawan dibedakan "hapus permanen" vs "nonaktifkan"** karena kode yang sudah ada (`hapusKaryawan` di `karyawan/page.tsx`) sebenarnya sudah soft-delete (`isActive: false`), bukan hapus permanen — jadi ini bukan fitur baru, cuma soal siapa yang boleh memicu hapus permanen kalau fitur itu nanti ditambahkan.
- **Absensi dibuka penuh untuk kedua role** karena ini kerja harian rutin (presensi masuk/keluar), bukan keputusan struktural — tidak masuk akal kalau staff harus minta izin admin tiap kali catat absensi.
- **Akun User (kelola role admin lain) eksklusif `SUPER_ADMIN`** — ini belum ada fitur-nya sama sekali di kode sekarang, tapi prinsipnya: siapa pun yang bisa menentukan siapa jadi `SUPER_ADMIN` harus jadi `SUPER_ADMIN` sendiri, supaya tidak ada staff biasa yang bisa menaikkan levelnya sendiri.

---

## 3. Job Desk per Role

### SUPER_ADMIN — setara HR Manager / Kepala HRD

**Tanggung jawab utama:**
- Mengelola struktur organisasi: membuat, mengubah, atau menonaktifkan Jabatan dan Departemen.
- Mengelola seluruh siklus penggajian: input gaji bulanan, riwayat pembayaran, status lunas/tertunda.
- Memutuskan penghapusan data karyawan secara permanen (bukan sekadar nonaktifkan) — biasanya untuk pembersihan data lama atau kesalahan input, bukan untuk operasional rutin.
- Mengelola akun pengguna sistem: membuat akun baru untuk staff HR, menentukan role (`SUPER_ADMIN` atau `HR_STAFF`), menonaktifkan akun yang sudah tidak aktif.
- Mengawasi laporan lintas modul (ekspor data gabungan, bukan per-modul saja).

**Yang tidak perlu dikerjakan role ini:**
- Input data absensi harian — itu bisa didelegasikan penuh ke `HR_STAFF`.
- Input data karyawan satu-per-satu — bisa didelegasikan, `SUPER_ADMIN` cukup mengawasi dan turun tangan untuk kasus khusus (hapus permanen, audit).

### HR_STAFF — setara HR Admin / Staff Operasional

**Tanggung jawab utama:**
- Input dan pembaruan data karyawan sehari-hari: karyawan baru, perubahan data pribadi, perubahan status aktif/nonaktif.
- Mengelola presensi: mencatat dan mengoreksi data masuk/keluar karyawan.
- Melihat struktur Jabatan dan Departemen untuk keperluan assignment karyawan baru — tapi tidak mengubah strukturnya sendiri.
- Mengekspor data karyawan dan absensi untuk laporan rutin (mingguan/bulanan) ke atasan.

**Yang tidak bisa/tidak perlu dikerjakan role ini:**
- Mengakses atau melihat data gaji dalam bentuk apa pun — ini murni domain `SUPER_ADMIN`.
- Mengubah struktur Jabatan/Departemen — kalau staff menemukan kebutuhan perubahan struktur (misal departemen baru), itu permintaan yang diteruskan ke `SUPER_ADMIN`, bukan dieksekusi sendiri.
- Menghapus data karyawan secara permanen — staff hanya bisa menonaktifkan, sebagai pengaman terhadap kesalahan input yang tidak bisa dibatalkan.

---

## 4. Status Implementasi vs Spek

Supaya jelas mana yang sudah ada di kode dan mana yang baru rencana:

| Item di spek | Status di kode sekarang |
|---|---|
| `/gaji` hanya `SUPER_ADMIN` | **Sudah ada** (`proxy.ts`) |
| Kartu Gaji disembunyikan dari `HR_STAFF` di dashboard | **Sudah ada** (`page.tsx`) |
| Menu Gaji disembunyikan dari sidebar untuk `HR_STAFF` | **Sudah ada** (`Sidebar.tsx`) |
| Jabatan/Departemen read-only untuk `HR_STAFF` | **Belum ada** — saat ini `HR_STAFF` bisa kelola penuh |
| Hapus permanen karyawan eksklusif `SUPER_ADMIN` | **Belum relevan** — fitur hapus permanen sendiri belum ada, yang ada baru nonaktifkan (soft delete), dan itu pun belum dibedakan per role |
| Kelola akun user (Admin) | **Belum ada fitur sama sekali** — tidak ada halaman untuk membuat/mengelola akun di kode |
| Ekspor data dibatasi per modul per role | **Belum ada** — endpoint ekspor (`/api/export`) yang ada saat ini tidak terlihat dibatasi role apa pun |

---

## 5. Catatan untuk Brief Portofolio

Kalau dokumen ini dipakai sebagai dasar klaim "RBAC enterprise" di README atau case study, urutan yang jujur adalah: implementasikan dulu baris-baris "Belum ada" di atas (minimal Jabatan/Departemen read-only, karena itu paling mudah dan paling penting secara logika bisnis), baru klaim RBAC-nya sebagai fitur yang benar-benar berfungsi penuh — bukan sekadar satu pengecekan rute.
