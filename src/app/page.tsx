import MenuCard from "./components/MenuCard";
import prisma from "@/lib/prisma";

// === DESIGN BRIEF ===
// Dashboard utama — bukan landing page, ini command center
// Layout: heading + grid modul akses
// Tidak pakai hero section besar (ini internal tool, bukan marketing)

export default async function Home() {
  const totalKaryawan = await prisma.karyawan.count();

  return (
    <section className="px-6 py-8">

      {/* Page header — ringkas dan langsung */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-hris-muted text-sm mt-1">
          Pilih modul untuk mengelola data sumber daya manusia.
        </p>
      </div>

      {/* Kotak Statistik Data */}
      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="bg-hris-primary border border-hris-border p-5 rounded-sm">
          <p className="text-hris-muted font-mono text-xs uppercase tracking-wider mb-2">Total Karyawan</p>
          <h2 className="text-3xl font-bold text-hris-light">
             {totalKaryawan} <span className="text-sm font-normal text-hris-muted">orang</span>
          </h2>
        </div>
        
        {/* Sisanya dibiarkan kosong bergaya 'Soon' / Placeholder */}
        <div className="bg-hris-primary border border-hris-border p-5 rounded-sm opacity-50">
          <p className="text-hris-muted font-mono text-xs uppercase tracking-wider mb-2">Total Divisi</p>
          <h2 className="text-3xl font-bold text-hris-muted">-</h2>
        </div>
      </div>

      {/* Grid modul — 2 kolom desktop, 1 kolom mobile */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MenuCard
          title="Karyawan"
          description="Profil, kontak, dan status aktif karyawan."
          href="/karyawan"
        />
        <MenuCard
          title="Jabatan"
          description="Level posisi dan struktur organisasi."
          href="/jabatan"
        />
        <MenuCard
          title="Departemen"
          description="Divisi, unit kerja, dan pengelompokan tim."
          href="/departemen"
        />
        <MenuCard
          title="Gaji"
          description="Payroll, komponen gaji, dan slip bulanan."
          href="/gaji"
        />
      </div>

    </section>
  );
}
