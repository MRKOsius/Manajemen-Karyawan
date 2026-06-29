# 🎓 Panduan Mentor: Memahami & Menerapkan Session (Sesi)

Halo! Di dokumen ini, kita akan belajar bersama tentang **Session**, apa itu, mengapa kita membutuhkannya, dan bagaimana cara menerapkannya selangkah demi selangkah di project Next.js kamu. Semua proses pembelajaran kita akan selalu saya perbarui di file `session-guide.md` ini agar kamu punya catatan belajar yang rapi.

## 📌 Apa itu Session?

Secara sederhana, **Session** (Sesi) adalah cara kita mengingat siapa yang sedang mengakses aplikasi kita. 

Bayangkan aplikasi web (HTTP) itu seperti seorang pelayan restoran yang punya penyakit amnesia (Stateless). Setiap kali kamu (browser) meminta sesuatu dari server, server langsung melupakanmu setelah memberikan respon. Kalau kamu pindah halaman dari Beranda ke Profil, server akan berpikir "Ini siapa ya?".

Nah, **Session** itu ibarat **kartu identitas atau tiket** yang diberikan server saat kamu pertama kali datang & menunjukkan KTP (Login). 

Secara teknis, begini alurnya:
1. **Login:** User memasukkan email & password. Server memvalidasi kebenaran datanya.
2. **Buat Session:** Jika data benar, server membuat sebuah "Tiket" khusus (biasanya menggunakan teknik yang bernama **JWT - JSON Web Token**).
3. **Simpan di Cookie:** Tiket ini dikirim kembali ke Browser user dan disimpan di brankas kecil milik browser yang bernama **Cookie**.
4. **Pindah Halaman / Akses Data:** Setiap kali user pindah halaman, Browser secara *otomatis* akan menempelkan "Tiket" (cookie) tadi dan mengirimkannya ke server bersamaan dengan permintaannya. Server lalu mengecek tiket tersebut. Jika tiketnya sah, server langsung tahu, "Oh, ini si A, saya akan berikan data Karyawan untuknya."
5. **Logout:** Tiket dihancurkan & dihapus dari Cookie browser.

---

## 🗺️ Roadmap Penerapan Session di Project Ini (Kurikulum Mentoring)

Agar proses belajar terstruktur, kita akan membaginya ke dalam 5 langkah. Kita akan menyelesaikan ini **satu per satu**, tidak perlu terburu-buru. Setelah kita menyelesaikan satu tugas, saya akan mencentang daftarnya di sini.

- [x] **Langkah 1: Membuat Persiapan (Kunci Token & Fungsi Utility)**
  Kita telah menginstal `jose` (library untuk membuat dan membaca JWT/Tiket dengan aman) dan membuat file `lib/session.ts` untuk menampung fungsi bantuan (*helper*) memproses session.
- [x] **Langkah 2: Proses Login (Server Action)**
  Kita telah menyambungkan form login `/login` ke proses Autentikasi modern kita menggunakan JWT via `createSession`.
- [x] **Langkah 3: Mengamankan Halaman dengan "Satpam" (Proxy)**
  Kita telah memanfaatkan fitur `proxy.ts` (pengganti middleware di versi terbaru) untuk menjaga halaman agar tidak bisa diakses tanpa session.
- [x] **Langkah 4: Menampilkan Data User Server & Client**
  Kita berhasil membaca "Tiket" (Session) via fungsi `getSession()` dan memunculkannya ke halaman Dashboard!
- [x] **Langkah 5: Fitur Logout**
  Desain V2 mewah telah terpasang, mengaitkan tombol Keluar ke Server Action untuk menghabisi Cookie Session secara sah.

---

## 🏆 KELULUSAN MENTORING SESSION!

Selamat! Kamu telah menyelesaikan kelima langkah pembuatan Custom Session dari NOL menggunakan `Next.js 16` dan `jose (JWT)`. 

Mulai dari proses login, verifikasi cookie di proxy, mencetak data di halaman yang dirender server, sampai memusnahkannya lewat fitur logout bergaya enterprise. Project-mu sekarang resmi memiliki sistem Autentikasi dan Identitas tingkat tinggi! 🎓
