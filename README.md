# NexHR — Enterprise HRIS Dashboard

NexHR adalah Sistem Informasi Manajemen Sumber Daya Manusia (HRIS) yang dirancang untuk membantu perusahaan menengah hingga besar dalam mengelola data karyawan, struktur posisi organisasi, departemen, serta data kehadiran harian secara tersentralisasi.

Fokus utama aplikasi ini adalah kejelasan informasi dan keamanan data operasional perusahaan. NexHR memisahkan akses pengguna (Role-Based Access Control) secara ketat untuk memastikan bahwa staf operasional HR dapat melakukan tugas hariannya, sementara kendali penuh terhadap informasi sensitif dan pengaturan sistem hanya dapat dilakukan oleh Super Admin.

## Fitur Utama Aplikasi

- **Manajemen Karyawan (Terpusat)**: Mengelola profil, status aktif, divisi, dan wewenang (jabatan) setiap karyawan dari satu antarmuka terpadu.
- **Struktur Organisasi**: Mengelola referensi Jabatan dan unit Departemen untuk menyokong kebutuhan hierarki manajerial perusahaan.
- **Sistem Absensi**: Buku catatan digital untuk merekam riwayat kehadiran harian karyawan.
- **Otoritas Berlapis (RBAC)**: Pemisahan wewenang yang tegas antara HR Staff (mendapat akses terbatas hanya untuk modul operasional harian) dan Super Admin (kontrol penuh atas modul finansial, gaji karyawan, dan konfigurasi sistem admin).
- **Arsip Aman (Soft-Delete)**: Data karyawan yang dihapus tidak benar-benar hilang dari database, melainkan dipindahkan dengan aman ke ruang arsip khusus. Pengelola berwenang memiliki opsi untuk memulihkan data tersebut atau memusnahkannya secara permanen.
- **Ekspor Laporan**: Fitur pengunduhan laporan data secara dinamis dalam bentuk berkas CSV yang dienkapsulasi sesuai batas wewenang pengguna (misalnya, data kolom gaji pokok diblokir ketika yang mengunduh adalah Staf biasa).

## Tautan Aplikasi Resmi

Aplikasi ini dapat diakses dan diujicoba secara langsung melalui tautan produksi berikut:
**[Buka Server Publik NexHR](https://manajemen-karyawan-phi.vercel.app/)**
