import Link from "next/link";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  const totalKaryawan = await prisma.karyawan.count();
  const totalDepartemen = await prisma.departemen.count();
  const totalGaji = await prisma.gajiRiwayat.count();
  
  // Data rekrutan terbaru
  const karyawanBaru = await prisma.karyawan.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { departemen: true, jabatan: true }
  });

  

  return (
    <section className="px-10 py-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-[18px] font-semibold text-ink-primary">Dashboard</h1>
      </div>

      {/* Stat Cards Level 1 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        <div className="bg-surface border border-border-default rounded-[8px] px-6 py-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted mb-2">Total Karyawan</p>
          {totalKaryawan > 0 ? (
            <>
              <p className="font-mono text-[24px] font-semibold text-ink-primary mt-1">
                {totalKaryawan} <span className="font-sans text-sm font-normal text-ink-secondary">orang</span>
              </p>
              <p className="font-sans text-[12px] text-success mt-2">+3 bulan ini</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted mt-2">
              Belum ada data · <Link href="/karyawan/tambah" className="text-accent underline text-sm">Tambah</Link>
            </p>
          )}
        </div>

        <div className="bg-surface border border-border-default rounded-[8px] px-6 py-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted mb-2">Total Departemen</p>
          {totalDepartemen > 0 ? (
            <>
              <p className="font-mono text-[24px] font-semibold text-ink-primary mt-1">
                {totalDepartemen} <span className="font-sans text-sm font-normal text-ink-secondary">divisi</span>
              </p>
              <p className="font-sans text-[12px] text-success mt-2">Struktur aktif</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted mt-2">
              Belum ada data · <Link href="/departemen/tambah" className="text-accent underline text-sm">Tambah</Link>
            </p>
          )}
        </div>

        <div className="bg-surface border border-border-default rounded-[8px] px-6 py-5">
           <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted mb-2">Riwayat Gaji</p>
          {totalGaji > 0 ? (
            <>
              <p className="font-mono text-[24px] font-semibold text-ink-primary mt-1">
                {totalGaji} <span className="font-sans text-sm font-normal text-ink-secondary">catatan</span>
              </p>
              <p className="font-sans text-[12px] text-success mt-2">Bulan ini dibayarkan</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted mt-2">
              Belum ada data · <Link href="/gaji" className="text-accent underline text-sm">Kelola</Link>
            </p>
          )}
        </div>
      </div>

      {/* Konten Area Baru: Talenta Terbaru */}
      <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-ink-primary">Talenta Terbaru (Recent Hires)</h2>
            <Link href="/karyawan" className="text-[12px] font-medium text-accent hover:underline">
                Lihat Semua Rekaman →
            </Link>
        </div>
        
        {karyawanBaru.length > 0 ? (
            <div className="divide-y divide-border-default">
                {karyawanBaru.map((karyawan) => {
                    const joinDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(karyawan.createdAt);
                    
                    return (
                        <div key={karyawan.id} className="px-6 py-4 flex items-center justify-between hover:bg-elevated transition-colors">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={`https://api.dicebear.com/9.x/avataaars/png?seed=${karyawan.id}`}
                                    alt={`Avatar ${karyawan.nama}`}
                                    width={40}
                                    height={40}
                                    className="rounded-full bg-canvas border border-border-default object-cover"
                                />
                                <div>
                                    <p className="text-[14px] font-medium text-ink-primary">{karyawan.nama}</p>
                                    <p className="text-[12px] font-mono text-ink-secondary mt-0.5">
                                        {karyawan.jabatan?.nama || "Posisi Belum Diset"} · {karyawan.departemen?.nama || "Divisi Induk"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="inline-block badge-active bg-canvas border border-border-default mb-1">Terintegrasi</span>
                                <p className="text-[11px] font-mono text-ink-muted">{joinDate}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="p-10 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center mb-3">
                    <span className="text-ink-muted text-lg">✦</span>
                </div>
                <p className="text-[14px] font-medium text-ink-primary mb-1">Rekam jejak kosong</p>
                <p className="text-[13px] text-ink-secondary mb-4 max-w-xs">Data rekrutmen terbaru akan bermunculan di sini begitu Anda mendaftarkannya.</p>
                <Link 
                    href="/karyawan/tambah"
                    className="bg-canvas border border-border-strong text-ink-primary text-[12px] font-medium px-4 py-2 hover:bg-elevated transition-colors rounded-[6px]"
                >
                    + Daftarkan Karyawan
                </Link>
            </div>
        )}
      </div>

    </section>
  );
}
