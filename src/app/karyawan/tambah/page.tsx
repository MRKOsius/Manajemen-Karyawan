import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function TambahKaryawanPage() {
    const pilihanJabatan = await prisma.jabatan.findMany();
    const pilihanDepartemen = await prisma.departemen.findMany();

    async function simpanData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const jabatanId = formData.get("jabatanId") as string;
        const departemenId = formData.get("departemenId") as string;
        const gaji = Number(formData.get("gaji"));

        await prisma.karyawan.create({
            data: {
                nama: nama,
                jabatanId: jabatanId,
                departemenID: departemenId,
                gaji: gaji,
            }
        });

        redirect("/karyawan")
    }

    return (
        <section className="px-6 py-8">
            <div className="mb-8">
                <Link href="/karyawan" className="text-hris-muted hover:text-hris-light transition text-sm font-mono flex items-center gap-2 mb-4">
                    ← KEMBALI KE DAFTAR
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-hris-light">Tambah Karyawan</h1>
                <p className="text-hris-muted text-sm mt-1">Daftarkan data diri dan penempatan karyawan baru.</p>
            </div>

            <form action={simpanData} className="max-w-xl bg-hris-surface border border-hris-border p-6 rounded-sm flex flex-col gap-6">

                <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider text-hris-muted">Nama Lengkap</label>
                    <input type="text" name="nama" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent transition-colors" placeholder="Misal: Budi Santoso" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs uppercase tracking-wider text-hris-muted">Jabatan</label>
                        <select name="jabatanId" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent transition-colors">
                            <option value="">-- Pilih Jabatan --</option>
                            {pilihanJabatan.map((jbtn) => (
                                <option key={jbtn.id} value={jbtn.id}>
                                    {jbtn.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        {/* PASTIKAN name INI SESUAI DENGAN VAR. formData ANDA (departemenID / departemenId) */}
                        <label className="text-xs uppercase tracking-wider text-hris-muted">Departemen (Divisi)</label>
                        <select name="departemenId" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent transition-colors">
                            <option value="">-- Pilih Departemen --</option>
                            {pilihanDepartemen.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.nama}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider text-hris-muted">Gaji (Rp)</label>
                    <input type="number" name="gaji" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent transition-colors" placeholder="Misal: 5000000" />
                </div>

                <div className="mt-2 pt-4 border-t border-hris-border">
                    <button type="submit" className="w-full bg-hris-light text-hris-primary py-2 text-sm font-bold active:scale-[0.98] transition-transform">
                        SIMPAN KARYAWAN
                    </button>
                </div>
            </form>
        </section>
    )

}