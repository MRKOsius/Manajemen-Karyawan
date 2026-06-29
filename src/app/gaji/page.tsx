import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import SubmitButton from "../components/SubmitButton"; 
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Gaji & Remunerasi | HRIS Admin',
    description: 'Manajemen payroll dan riwayat gaji.'
}

async function bayarGaji(formData: FormData) {
    "use server";
    const karyawanId = formData.get("karyawanId") as string;
    const nominal = Number(formData.get("nominal"));
    
    const date = new Date();
    const bulanSekarang = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
    
    await prisma.gajiRiwayat.create({
        data: {
            karyawanId, 
            bulan: bulanSekarang,
            nominal,
            status: "Ditransfer"
        }
    });

    revalidatePath("/gaji");
}

export default async function GajiPage() {
    const dataKaryawan = await prisma.karyawan.findMany({
        where: { isActive: true },
        orderBy: { nama: 'asc' },
        include: { departemen: true }
    });

    const riwayatGaji = await prisma.gajiRiwayat.findMany({
        orderBy: { createdAt: 'desc' },
        include: { karyawan: true }
    });

    return (
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[18px] font-semibold text-ink-primary">Gaji & Remunerasi</h1>
                    <p className="font-mono text-[13px] text-ink-muted mt-1">Manajemen distribusi dan histori pencatatan keuangan karyawan</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                
                {/* Kolom Kiri: Daftar Eksekusi */}
                <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-default">
                        <h2 className="text-[14px] font-medium text-ink-primary">Pending Pembayaran</h2>
                    </div>

                    {dataKaryawan.length > 0 ? (
                        <div className="flex flex-col divide-y divide-border-default max-h-[600px] overflow-y-auto">
                            {dataKaryawan.map((k) => (
                                <div key={k.id} className="px-6 py-5 flex items-center justify-between hover:bg-elevated transition-colors">
                                    <div>
                                        <p className="text-[14px] font-medium text-ink-primary">{k.nama}</p>
                                        <p className="text-[12px] font-mono text-ink-secondary mt-1">
                                            {k.departemen?.nama || "Tanpa Divisi"} · Rp {k.gaji.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <form action={bayarGaji} className="shrink-0 ml-4">
                                        <input type="hidden" name="karyawanId" value={k.id} />
                                        <input type="hidden" name="nominal" value={k.gaji} />
                                        <SubmitButton text="Transfer" />
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8">
                            <EmptyState 
                                title="Data Karyawan Kosong" 
                                body="Anda harus mendaftarkan karyawan terlebih dahulu sebelum mengeksekusi payroll."
                                action="Ke Menu Karyawan"
                                actionHref="/karyawan"
                            />
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Histori Transaksi */}
                <div className="bg-surface border border-border-default rounded-[8px] flex flex-col max-h-[660px]">
                    <div className="px-6 py-4 border-b border-border-default shrink-0">
                        <h2 className="text-[14px] font-medium text-ink-primary">Log Transaksi Berhasil</h2>
                    </div>

                    {riwayatGaji.length > 0 ? (
                        <div className="overflow-y-auto w-full flex-1">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="sticky top-0 z-10 shadow-sm border-b border-border-strong">
                                    <tr>
                                        <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted bg-canvas w-full">Data Transaksi</th>
                                        <th className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted bg-canvas">Nominal (IDR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riwayatGaji.map((gaji) => {
                                        const tglTf = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(gaji.createdAt);
                                        return (
                                        <tr key={gaji.id}>
                                            <td className="px-6 py-4 border-b border-border-default hover:bg-elevated transition-colors">
                                                <p className="text-[14px] font-medium text-ink-primary">{gaji.karyawan?.nama}</p>
                                                <p className="text-[12px] font-mono text-ink-muted mt-0.5">
                                                    Periode {gaji.bulan} · {tglTf}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right border-b border-border-default hover:bg-elevated transition-colors">
                                               <div className="flex flex-col items-end">
                                                   <span className="badge-active mb-1 text-[10px] w-fit">Ditransfer</span>
                                                   <span className="text-[13px] font-mono font-medium text-success">
                                                     +{gaji.nominal.toLocaleString('id-ID')}
                                                   </span>
                                               </div>
                                            </td>
                                        </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="border border-dashed border-border-default rounded-[8px] p-10 text-center bg-canvas">
                                <p className="text-[13px] text-ink-secondary">Log riwayat penggajian masih bersih.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
