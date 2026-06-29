import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import SubmitButton from "../components/SubmitButton"; // Kita pakai tombol pintar di sini sekalian!

export const metadata: Metadata = {
    title: 'Data Gaji | HRIS Admin',
    description: 'Manajemen payroll dan riwayat gaji.'
}

async function bayarGaji(formData: FormData) {
    "use server";
    const karyawanId = formData.get("karyawanId") as string;
    // ❌ namaKaryawan DIHAPUS DARI SINI
    const nominal = Number(formData.get("nominal"));
    
    const date = new Date();
    const bulanSekarang = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    
    await prisma.gajiRiwayat.create({
        data: {
            karyawanId, 
            // ❌ namaKaryawan DIHAPUS DARI SINI
            bulan: bulanSekarang,
            nominal,
            status: "Ditransfer"
        }
    });

    revalidatePath("/gaji");
}

export default async function GajiPage() {
    const dataKaryawan = await prisma.karyawan.findMany({
        orderBy: { nama: 'asc' }
    });

    // ✅ PENTING: Tambahkan 'include: { karyawan: true }' untuk menarik nama aslinya
    const riwayatGaji = await prisma.gajiRiwayat.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            karyawan: true
        }
    });

    return (
        <section className="px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-hris-light">Dasbor Payroll</h1>
                <p className="text-hris-muted text-sm mt-1">Eksekusi pembayaran gaji bulanan karyawan.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Kolom Kiri: Daftar Eksekusi */}
                <div>
                    <h2 className="text-lg font-bold text-hris-light border-b border-hris-border pb-2 mb-4">Pending Pembayaran</h2>
                    {dataKaryawan.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {dataKaryawan.map((k: any) => (
                                <div key={k.id} className="bg-hris-surface border border-hris-border p-4 rounded-sm flex items-center justify-between hover:border-hris-accent transition-colors">
                                    <div>
                                        <p className="font-bold text-hris-light text-sm">{k.nama}</p>
                                        <p className="font-mono text-xs text-hris-muted">Gaji: Rp {k.gaji.toLocaleString('id-ID')}</p>
                                    </div>
                                    <form action={bayarGaji}>
                                        <input type="hidden" name="karyawanId" value={k.id} />
                                        <input type="hidden" name="nominal" value={k.gaji} />
                                        {/* ❌ Input hidden namaKaryawan DIHAPUS */}
                                        <SubmitButton text="BAYAR" />
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-hris-muted text-sm italic">Belum ada karyawan terdaftar.</p>
                    )}
                </div>

                {/* Kolom Kanan: Histori Transaksi */}
                <div>
                    <h2 className="text-lg font-bold text-hris-light border-b border-hris-border pb-2 mb-4">Log Transaksi (Berhasil)</h2>
                    {riwayatGaji.length > 0 ? (
                        <div className="border border-hris-border overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-hris-surface text-hris-muted text-xs font-mono uppercase">
                                        <th className="px-4 py-3">Penerima</th>
                                        <th className="px-4 py-3">Periode</th>
                                        <th className="px-4 py-3 text-right">Ditransfer</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-hris-border">
                                    {riwayatGaji.map((gaji: any) => (
                                        <tr key={gaji.id} className="hover:bg-hris-surface transition-colors">
                                            {/* ✅ Panggil nama menggunakan gaji.karyawan?.nama (Hasil Relasi) */}
                                            <td className="px-4 py-3 font-medium text-hris-light">{gaji.karyawan?.nama}</td>
                                            <td className="px-4 py-3 text-hris-muted text-xs">{gaji.bulan}</td>
                                            <td className="px-4 py-3 text-right font-mono text-xs text-hris-accent">
                                                Rp {gaji.nominal.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="border border-dashed border-hris-border p-10 text-center">
                            <p className="text-hris-muted text-sm border">Log riwayat penggajian masih kosong.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
