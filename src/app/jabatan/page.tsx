import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import SubmitButton from "../components/SubmitButton";

export const metadata: Metadata = {
    title: 'Data Jabatan | HRIS Admin',
    description: 'Daftar kelola data jabatan.'
}

async function tambahJabatan(formData: FormData) {
    "use server";
    const nama = formData.get("nama") as string;
    const deskripsi = formData.get("deskripsi") as string;
    
    await prisma.jabatan.create({
        data: { nama, deskripsi }
    });
    revalidatePath("/jabatan");
}

async function hapusJabatan(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.jabatan.delete({ where: { id } });
    revalidatePath("/jabatan");
}

export default async function JabatanPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";

    const dataJabatan = await prisma.jabatan.findMany({
        where: {
            nama: {
                contains: kataKunci,
                mode: 'insensitive'
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <section className="px-6 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-hris-light">Data Jabatan</h1>
                    <p className="text-hris-muted text-sm mt-1">Kelola level posisi dan struktur organisasi.</p>
                </div>

                <form method="GET" className="flex max-w-sm w-full">
                    <input 
                        type="text" 
                        name="q" 
                        defaultValue={kataKunci}
                        placeholder="Cari referensi jabatan..." 
                        className="w-full bg-hris-surface border-y border-l border-hris-border p-2 text-sm text-hris-light focus:outline-none focus:border-hris-accent"
                    />
                    <button type="submit" className="bg-hris-surface border border-hris-border p-2 text-sm text-hris-muted hover:text-hris-light transition-colors">
                        Cari
                    </button>
                    {kataKunci && (
                        <a href="/jabatan" className="px-3 flex items-center text-xs text-hris-danger hover:underline">
                            Clear
                        </a>
                    )}
                </form>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Kolom Kiri: Form Master Data */}
                <div className="md:col-span-1">
                    <form action={tambahJabatan} className="bg-hris-surface border border-hris-border p-6 rounded-sm flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-hris-light border-b border-hris-border pb-2">Tambah Master Jabatan</h2>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase tracking-wider text-hris-muted">Nama Jabatan</label>
                            <input type="text" name="nama" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent" placeholder="Misal: Manager IT" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase tracking-wider text-hris-muted">Deskripsi Posisi</label>
                            <textarea name="deskripsi" rows={3} className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent resize-none" placeholder="Deskripsi tugas..."></textarea>
                        </div>
                        
                        <SubmitButton text="SIMPAN JABATAN" />
                    </form>
                </div>

                {/* Kolom Kanan: Tabel Data */}
                <div className="md:col-span-2">
                    {dataJabatan.length > 0 ? (
                        <div className="border border-hris-border overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-hris-surface text-hris-muted text-xs font-mono uppercase">
                                        <th className="px-4 py-3">Jabatan</th>
                                        <th className="px-4 py-3">Deskripsi</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-hris-border">
                                    {dataJabatan.map((jabatan: any) => (
                                        <tr key={jabatan.id} className="hover:bg-hris-surface transition-colors">
                                            <td className="px-4 py-3 font-medium text-hris-light">{jabatan.nama}</td>
                                            <td className="px-4 py-3 text-hris-muted text-xs">{jabatan.deskripsi || '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end space-x-3 items-center">
                                                    <a href={`/jabatan/${jabatan.id}`} className="text-xs text-hris-info hover:underline">Edit</a>
                                                    <form action={hapusJabatan}>
                                                        <input type="hidden" name="id" value={jabatan.id} />
                                                        <button type="submit" className="text-xs text-hris-danger hover:underline mt-1">Hapus</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="border border-dashed border-hris-border p-10 text-center">
                            <p className="text-hris-muted text-sm">Belum ada master data jabatan.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}