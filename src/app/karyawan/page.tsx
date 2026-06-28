import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
    title: 'Data Karyawan | HRIS Admin',
    description: 'Daftar kelola data karyawan perusahaan.',
}

async function hapusKaryawan(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    await prisma.karyawan.delete({
        where: { id: id }
    });

    revalidatePath("/karyawan")
}

export default async function KaryawanPage() {
    const dataKaryawan = await prisma.karyawan.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <section className="px-6 py-8">

            {/* Page header dengan aksi */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Karyawan</h1>
                    <p className="text-hris-muted text-sm mt-1">
                        {dataKaryawan ? `${dataKaryawan.length} karyawan terdaftar` : "Memuat data..."}
                    </p>
                </div>
                <Link
                    href="/karyawan/tambah"
                    className="bg-hris-accent text-hris-primary font-bold text-sm px-4 py-2 rounded-sm hover:brightness-110 transition"
                >
                    + Tambah Karyawan
                </Link>
            </div>

            {/* Tabel data — bukan card grid */}
            {dataKaryawan && dataKaryawan.length > 0 ? (
                <div className="border border-hris-border rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-hris-surface text-hris-muted text-xs font-mono uppercase tracking-wider">
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Jabatan</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hris-border">
                            {dataKaryawan.map((karyawan: any) => (
                                <tr key={karyawan.id} className="hover:bg-hris-surface transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-hris-light">{karyawan.nama}</span>
                                        <span className="block text-xs text-hris-muted font-mono">ID: {karyawan.id}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-hris-muted">{karyawan.jabatan}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/karyawan/${karyawan.id}`}
                                                className="text-xs font-mono text-hris-info hover:text-hris-light transition-colors px-2 py-1 border border-hris-border rounded-sm hover:border-hris-info"
                                            >
                                                Edit
                                            </Link>
                                            <form action={hapusKaryawan}>
                                                <input type="hidden" name="id" value={karyawan.id} />
                                                <button
                                                    type="submit"
                                                    className="text-xs font-mono text-hris-danger hover:text-hris-light transition-colors px-2 py-1 border border-hris-border rounded-sm hover:border-hris-danger hover:bg-hris-danger"
                                                >
                                                    Hapus
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Empty state — arahkan ke aksi, bukan hanya teks */
                <div role="status" className="text-center py-16 border border-dashed border-hris-border rounded-sm">
                    <p className="text-hris-muted mb-4">Belum ada data karyawan terdaftar.</p>
                    <Link
                        href="/karyawan/tambah"
                        className="text-sm font-bold text-hris-accent hover:underline"
                    >
                        Tambah karyawan pertama
                    </Link>
                </div>
            )}

        </section>
    )
}