import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";

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
                nama,
                jabatanId,
                departemenID: departemenId,
                gaji,
            }
        });

        redirect("/karyawan")
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/karyawan" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Karyawan / Tambah Karyawan
                </Link>
                <h1 className="text-[20px] font-semibold text-ink-primary mt-4">Tambah Karyawan Baru</h1>
            </div>

            <form action={simpanData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    {/* Block 1 */}
                    <div className="mb-10">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Dasar</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Lengkap</label>
                                <input id="nama" type="text" name="nama" required className="hris-input" placeholder="Masukkan nama lengkap" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="gaji" className="text-[13px] font-medium text-ink-primary mb-1">Gaji Dasar (IDR)</label>
                                <input id="gaji" type="number" name="gaji" required className="hris-input" placeholder="Masukkan nominal gaji" />
                            </div>
                        </div>
                    </div>

                    {/* Block 2 */}
                    <div>
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Posisi & Struktur</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="jabatanId" className="text-[13px] font-medium text-ink-primary mb-1">Jabatan</label>
                                <select id="jabatanId" name="jabatanId" defaultValue="" required className="hris-input">
                                    <option value="" disabled>Pilih Jabatan</option>
                                    {pilihanJabatan.map((jbtn) => (
                                        <option key={jbtn.id} value={jbtn.id}>{jbtn.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="departemenId" className="text-[13px] font-medium text-ink-primary mb-1">Departemen</label>
                                <select id="departemenId" name="departemenId" defaultValue="" required className="hris-input">
                                    <option value="" disabled>Pilih Departemen</option>
                                    {pilihanDepartemen.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                    <Link 
                        href="/karyawan"
                        className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                    >
                        Batalkan
                    </Link>
                    <SubmitButton text="Simpan Karyawan" />
                </div>
            </form>
        </section>
    )
}