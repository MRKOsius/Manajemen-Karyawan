import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import SubmitButton from "../components/SubmitButton";

export const metadata: Metadata = {
    title: 'Data Departemen | HRIS Admin',
    description: 'Daftar kelola divisi dan struktur.'
}

async function tambahDepartemen(formData: FormData) {
    "use server";
    const nama = formData.get("nama") as string;
    const lokasi = formData.get("lokasi") as string;
    
    await prisma.departemen.create({
        data: { nama, lokasi }
    });
    revalidatePath("/departemen");
}

async function hapusDepartemen(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.departemen.delete({ where: { id } });
    revalidatePath("/departemen");
}

export default async function DepartemenPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {

    const params = await searchParams;
    const kataKunci = params?.q || "";
    const dataDepartemen = await prisma.departemen.findMany({
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
                    <h1 className="text-2xl font-bold tracking-tight text-hris-light">Data Departemen</h1>
                    <p className="text-hris-muted text-sm mt-1">Kelola divisi, unit kerja, dan pengelompokan tim.</p>
                </div>
                
                <form method="GET" className="flex max-w-sm w-full">
                    <input 
                        type="text" 
                        name="q" 
                        defaultValue={kataKunci}
                        placeholder="Cari divisi..." 
                        className="w-full bg-hris-surface border-y border-l border-hris-border p-2 text-sm text-hris-light focus:outline-none focus:border-hris-accent"
                    />
                    <button type="submit" className="bg-hris-surface border border-hris-border p-2 text-sm text-hris-muted hover:text-hris-light transition-colors">
                        Cari
                    </button>
                    {kataKunci && (
                        <a href="/departemen" className="px-3 flex items-center text-xs text-hris-danger hover:underline">
                            Clear
                        </a>
                    )}
                </form>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1">
                    <form action={tambahDepartemen} className="bg-hris-surface border border-hris-border p-6 rounded-sm flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-hris-light border-b border-hris-border pb-2">Tambah Departemen</h2>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase tracking-wider text-hris-muted">Nama Divisi</label>
                            <input type="text" name="nama" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent" placeholder="Misal: Human Resources" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase tracking-wider text-hris-muted">Lokasi / Gedung</label>
                            <input type="text" name="lokasi" required className="bg-hris-primary border border-hris-border p-2 text-hris-light text-sm outline-none focus:border-hris-accent" placeholder="Misal: Lantai 4 / Tower B" />
                        </div>
                        
                        <SubmitButton text="SIMPAN DEPARTEMEN" />
                    </form>
                </div>

                <div className="md:col-span-2">
                    {dataDepartemen.length > 0 ? (
                        <div className="border border-hris-border overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-hris-surface text-hris-muted text-xs font-mono uppercase">
                                        <th className="px-4 py-3">Nama Divisi</th>
                                        <th className="px-4 py-3">Lokasi (Gedung)</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-hris-border">
                                    {dataDepartemen.map((dept: any) => (
                                        <tr key={dept.id} className="hover:bg-hris-surface transition-colors">
                                            <td className="px-4 py-3 font-medium text-hris-light">{dept.nama}</td>
                                            <td className="px-4 py-3 text-hris-muted text-xs">{dept.lokasi}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end space-x-3 items-center">
                                                    <a href={`/departemen/${dept.id}`} className="text-xs text-hris-info hover:underline">Edit</a>
                                                    <form action={hapusDepartemen}>
                                                        <input type="hidden" name="id" value={dept.id} />
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
                            <p className="text-hris-muted text-sm">Belum ada master data departemen.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}