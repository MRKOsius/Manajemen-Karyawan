import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import DashboardChart from "./components/DashboardChart";

export default async function Home() {
  const totalKaryawan = await prisma.karyawan.count({ where: { isActive: true } });
  const totalDepartemen = await prisma.departemen.count({ where: { isActive: true } });
  
  const totalAbsensi = await prisma.absensi.count();
  const totalGaji = await prisma.gajiRiwayat.count();
  const session = await getSession();
  
  // Data rekrutan terbaru
  const karyawanBaru = await prisma.karyawan.findMany({
    take: 5,
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { departemen: true, jabatan: true }
  });

  const departemenMentah = await prisma.departemen.findMany({
      where: { isActive: true },
      include: {
          _count: {
              select: { karyawan: { where: { isActive: true } } }
          }
      }
  });

  // Urutkan dari yang paling banyak ke paling sedikit
  const grafikDistribusi = departemenMentah
      .map(dept => ({
          name: dept.nama,
          total: dept._count.karyawan
      }))
      .sort((a, b) => b.total - a.total);

  return (
    <section className="px-10 py-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-[18px] font-semibold text-ink-primary">Dashboard (Halo, {String(session?.role)}!)</h1>
      </div>

      {/* Stat Cards Level 1 */}
      <div className={`grid gap-4 grid-cols-1 mb-8 ${session?.role === 'SUPER_ADMIN' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
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
          <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-muted mb-2">Rekam Jaga (Absensi)</p>
          {totalAbsensi > 0 ? (
            <>
              <p className="font-mono text-[24px] font-semibold text-ink-primary mt-1">
                {totalAbsensi} <span className="font-sans text-sm font-normal text-ink-secondary">taps</span>
              </p>
              <p className="font-sans text-[12px] text-success mt-2">Data log masuk/keluar</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted mt-2">
              Belum ada data · <Link href="/absensi" className="text-accent underline text-sm">Pantau</Link>
            </p>
          )}
        </div>

        {session?.role === 'SUPER_ADMIN' && (
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
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Grafik Recharts Utama (Lebar 2 Kolom) */}
          <div className="lg:col-span-2 bg-surface border border-border-default rounded-[8px] p-6 flex flex-col justify-between">
              <div>
                  <h2 className="text-[14px] font-medium text-ink-primary">Rasio Karyawan Per Divisi</h2>
                  <p className="text-[12px] text-ink-muted mt-1">Distribusi riil jumlah karyawan aktif berdasarkan departemen.</p>
              </div>
              <div className="mt-8 flex-1 min-h-[250px]">
                 <DashboardChart data={grafikDistribusi} />
              </div>
          </div>

          {/* Konten Area Baru: Talenta Terbaru (Lebar 1 Kolom layaknya Sidebar/Activity Feed) */}
          <div className="lg:col-span-1 bg-surface border border-border-default rounded-[8px] flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default flex items-center justify-between bg-canvas/30">
            <h2 className="text-[14px] font-medium text-ink-primary">Karyawan Baru</h2>
            <Link href="/karyawan" className="text-[12px] font-medium text-accent hover:underline">
                Lihat Semua →
            </Link>
        </div>
        
        {karyawanBaru.length > 0 ? (
            <div className="divide-y divide-border-default flex-1 overflow-y-auto max-h-[300px] sm:max-h-full">
                {karyawanBaru.map((karyawan) => {
                    const joinDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(karyawan.createdAt);
                    
                    return (
                        <div key={karyawan.id} className="px-5 py-4 flex items-center gap-4 hover:bg-elevated transition-colors">
                            <div className="w-10 h-10 rounded-full bg-canvas border border-border-default overflow-hidden shrink-0 flex items-center justify-center">
                                {karyawan.avatar ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={karyawan.avatar} alt={`Foto ${karyawan.nama}`} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[12px] font-medium text-ink-secondary">{karyawan.nama.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                   <p className="text-[13px] font-medium text-ink-primary truncate mr-2">{karyawan.nama}</p>
                                   <span className="text-[10px] font-mono text-ink-muted whitespace-nowrap">{joinDate}</span>
                                </div>
                                <p className="text-[12px] text-ink-secondary truncate">
                                    {karyawan.jabatan?.nama || "Posisi Belum Diset"}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center mb-3">
                    <span className="text-ink-muted text-lg">✦</span>
                </div>
                <p className="text-[13px] font-medium text-ink-primary mb-1">Kosong</p>
                <p className="text-[12px] text-ink-secondary mb-4">Profil rekrutmen akan rilis di sini.</p>
                <Link 
                    href="/karyawan/tambah"
                    className="bg-canvas border border-border-strong text-ink-primary text-[12px] font-medium px-4 py-2 hover:bg-elevated transition-colors rounded-[6px]"
                >
                    + Daftarkan
                </Link>
            </div>
        )}
      </div>
    </div>

    </section>
  );
}
