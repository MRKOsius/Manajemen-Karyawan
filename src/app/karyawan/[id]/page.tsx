import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";

export default async function DetailKaryawan({ params }: { params: { id: string } }) {
    const { id } = await params;

    // 1. Menarik data Karyawan spesifik
    const karyawan = await prisma.karyawan.findUnique({
        where: { id: id }
    });

    if (!karyawan) return <div className="p-10 text-center text-hris-muted mt-10">Karyawan tidak ditemukan.</div>;

    // 2. Menarik master data untuk mengisi Dropdown
    const pilihanJabatan = await prisma.jabatan.findMany();
    const pilihanDepartemen = await prisma.departemen.findMany();

    // 3. Server Action untuk Edit/Update ke Format Relasi Baru
    async function updateData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const jabatanId = formData.get("jabatanId") as string;
        const departemenID = formData.get("departemenID") as string;
        const gaji = Number(formData.get("gaji"));

        await prisma.karyawan.update({
            where: { id: id },
            data: {
                nama: nama,
                jabatanId: jabatanId,
                departemenID: departemenID,
                gaji: gaji
            }
        });

        redirect("/karyawan");
    }

    return (
        <section className="px-6 py-8 flex flex-col items-center">
            
            <div className="w-full max-w-2xl text-left mb-6">
                <Link href="/karyawan" className="text-sm font-mono text-hris-info hover:underline flex items-center gap-2">
                    ← Kembali ke Tabel
                </Link>
            </div>

            <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
                <Image 
                    src={`https://i.pravatar.cc/150?u=${karyawan.id}`}
                    alt={`Foto ${karyawan.nama}`}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-hris-border shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-4" 
                />
                <h1 className="text-2xl font-bold text-hris-light tracking-tight">Edit Karyawan</h1>
                <p className="text-hris-muted text-sm font-mono mt-1">UUID: {karyawan.id}</p>
            </div>

            <form action={updateData} className="w-full max-w-2xl bg-hris-surface p-8 border border-hris-border rounded-sm shadow-xl">
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Nama Lengkap</label>
                        <input 
                            name="nama" 
                            type="text" 
                            defaultValue={karyawan.nama} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Jabatan</label>
                            <select 
                                name="jabatanId" 
                                defaultValue={karyawan.jabatanId} // << Otomatis menyeleksi jabatan lama
                                required 
                                className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all"
                            >
                                <option value="" disabled>-- Pilih Jabatan --</option>
                                {pilihanJabatan.map((jbtn) => (
                                    <option key={jbtn.id} value={jbtn.id}>{jbtn.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Departemen</label>
                            <select 
                                name="departemenID" 
                                defaultValue={karyawan.departemenID} // << Otomatis menyeleksi divisi lama
                                required 
                                className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all"
                            >
                                <option value="" disabled>-- Pilih Departemen --</option>
                                {pilihanDepartemen.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.nama}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Gaji Pokok (Rp)</label>
                        <input 
                            name="gaji" 
                            type="number" 
                            defaultValue={karyawan.gaji} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light font-mono focus:outline-none focus:ring-2 focus:ring-hris-info rounded-sm transition-all" 
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hris-border flex justify-end">
                    <SubmitButton text="UPDATE KARYAWAN" />
                </div>
                
            </form>

        </section>
    );
}
