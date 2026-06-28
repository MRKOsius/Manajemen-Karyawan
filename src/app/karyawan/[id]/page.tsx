import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DetailKaryawan({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Menarik data saat ini
    const karyawan = await prisma.karyawan.findUnique({
        where: { id: id }
    });

    if (!karyawan) return <div className="p-10 text-hris-muted">Karyawan tidak ditemukan.</div>;

    // --- MODUL 3 KEMBALI! Server Action untuk Update ---
    async function updateData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const jabatan = formData.get("jabatan") as string;
        const divisi = formData.get("divisi") as string;
        const gaji = Number(formData.get("gaji"));

        await prisma.karyawan.update({
            where: { id: id },
            data: {
                nama: nama,
                jabatan: jabatan,
                divisi: divisi,
                gaji: gaji
            }
        });

        redirect("/karyawan");
    }

    return (
        <section className="px-6 py-8 flex flex-col items-center">
            
            <div className="w-full max-w-2xl text-left mb-6">
                <Link href="/karyawan" className="text-sm font-mono text-hris-info hover:underline">
                    ← Kembali ke Tabel
                </Link>
            </div>

            {/* Area Profil & Foto (Modul 4.3) */}
            <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
                <Image 
                    src={`https://i.pravatar.cc/150?u=${karyawan.id}`}
                    alt={`Foto ${karyawan.nama}`}
                    width={100}
                    height={100}
                    // Gambar bulat, bukan rounded-2xl
                    className="rounded-full border-4 border-hris-border shadow-sm mb-4" 
                />
                <h1 className="text-2xl font-bold text-hris-light tracking-tight">Edit Kredensial Karyawan</h1>
                <p className="text-hris-muted text-sm font-mono">ID: {karyawan.id}</p>
            </div>

            {/* Area Form Edit (Modul 3 dengan Skin Modul 4) */}
            <form action={updateData} className="w-full max-w-2xl bg-hris-surface p-8 border border-hris-border rounded-sm">
                
                <div className="space-y-5">
                    <div className="space-y-1">
                        <label htmlFor="nama" className="block text-sm font-semibold text-hris-light">Nama Lengkap</label>
                        <input 
                            id="nama" 
                            name="nama" 
                            type="text" 
                            defaultValue={karyawan.nama} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="jabatan" className="block text-sm font-semibold text-hris-light">Jabatan Utama</label>
                        <input 
                            id="jabatan" 
                            name="jabatan" 
                            type="text" 
                            defaultValue={karyawan.jabatan} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="divisi" className="block text-sm font-semibold text-hris-light">Divisi (Departemen)</label>
                        <input 
                            id="divisi" 
                            name="divisi" 
                            type="text" 
                            defaultValue={karyawan.divisi} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />            
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="gaji" className="block text-sm font-semibold text-hris-light">Gaji Pokok (Rp)</label>
                        <input 
                            id="gaji" 
                            name="gaji" 
                            type="number" 
                            defaultValue={karyawan.gaji} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light font-mono focus:outline-none focus:ring-2 focus:ring-hris-info rounded-sm transition-all" 
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hris-border">
                    <button 
                        type="submit" 
                        className="bg-hris-light text-hris-primary hover:bg-hris-accent font-bold py-3 px-6 rounded-sm transition-colors w-full sm:w-auto focus:ring-2 focus:ring-hris-info"
                    >
                        Simpan Perubahan
                    </button>
                </div>
                
            </form>

        </section>
    );
}
