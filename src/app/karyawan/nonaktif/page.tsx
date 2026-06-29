import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import prisma from "@/lib/prisma";
import EmptyState from "@/app/components/EmptyState";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
    title: 'Arsip Karyawan Non-Aktif | HRIS Admin',
    description: 'Data karyawan yang telah dihapus atau dinonaktifkan.',
}

async function pulihkanKaryawan(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    await prisma.karyawan.update({ where: { id: id }, data: { isActive: true } });

    revalidatePath("/karyawan/nonaktif");
    revalidatePath("/karyawan");
}

async function hapusPermanen(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    const siMati = await prisma.karyawan.findUnique({
        where: {
            id: id
        }
    });

    if (siMati?.avatar) {
        const alamatFisikPath = path.join(process.cwd(),
            "public", siMati.avatar);
        try {
            await fs.unlink(alamatFisikPath);
        } catch (e) {
            console.log("File tidak ditemukan, mungkin sudah rontok sebelumnya.");
        }
    }

    await prisma.karyawan.delete({ where: { id: id } });
    revalidatePath("/karyawan/nonaktif");
}

export default async function KaryawanNonaktifPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const PAGE_SIZE = 10;
    const currentPage = Number(params?.page) || 1;

    const totalData = await prisma.karyawan.count({
        where: {
            isActive: false
        }
    });

    const totalPages = Math.ceil(totalData / PAGE_SIZE) || 1;

    const dataKaryawan = await prisma.karyawan.findMany({
        where: { isActive: false },
        orderBy: { createdAt: 'desc' },
        include: { jabatan: true, departemen: true },
        take: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE
    });

    return (
        <section className="px-6 py-8 max-w-6xl mx-auto">
            {/* --- Bagian Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[18px] font-semibold text-ink-primary">Karyawan Non-Aktif (Arsip)</h1>
                    <p className="font-mono text-[13px] text-ink-muted mt-1">Daftar karyawan yang telah dinonaktifkan atau dihapus dari sistem.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tombol Outline Kembali V2 */}
                    <Link
                        href="/karyawan"
                        className="bg-transparent hover:bg-elevated text-ink-secondary hover:text-ink-primary text-[13px] font-medium py-2 px-4 border border-border-default rounded-[8px] whitespace-nowrap transition-colors focus:outline-none flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Data Aktif
                    </Link>
                </div>
            </div>

            {dataKaryawan && dataKaryawan.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Profil Karyawan
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-48">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-32">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataKaryawan.map((karyawan) => {
                                const formattedEmail = `${karyawan.nama.split(" ")[0].toLowerCase()}@hris.co.id`;
                                const joinDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(karyawan.createdAt);

                                return (
                                    <tr key={karyawan.id}>
                                        <td className="px-6 py-4">
                                            <p className="text-[14px] font-medium text-ink-primary">{karyawan.nama}</p>
                                            <p className="text-[12px] font-mono text-ink-muted mt-0.5">
                                                {formattedEmail} · {karyawan.departemen?.nama || "Tanpa Departemen"} · Disimpan {joinDate}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            {/* Badge V2 Inactive (Warna Abu kalem Bulat Kosong) */}
                                            <span className="badge-inactive inline-flex items-center gap-1.5">
                                                <span aria-hidden="true" className="text-[10px]">○</span> Nonaktif
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Aksi Pulihkan Menggunakan Accent V2 (Kuning/Amber) */}
                                                <form action={pulihkanKaryawan}>
                                                    <input type="hidden" name="id" value={karyawan.id} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-secondary hover:text-accent border border-border-default hover:border-accent hover:bg-accent-light px-3 py-1.5 rounded-[8px] transition-colors focus:outline-none"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Pulihkan Data
                                                    </button>
                                                </form>

                                                <form action={hapusPermanen}>
                                                    <input type="hidden" name="id" value={karyawan.id} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-danger border border-danger/30 hover:border-danger hover:bg-danger/10 px-3 py-1.5 rounded-[8px] transition-colors focus:outline-none"
                                                    >
                                                        Hapus Permanen
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-border-default flex items-center justify-between">
                        <p className="text-[13px] text-ink-muted">
                            Menampilkan <span className="font-mono text-ink-primary">{(currentPage - 1) * PAGE_SIZE + 1}</span> - <span className="font-mono text-ink-primary">{Math.min(currentPage * PAGE_SIZE, totalData)}</span> dari <span className="font-mono text-ink-primary">{totalData}</span> arsip
                        </p>
                        <div className="flex items-center gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={`/karyawan/nonaktif?page=${currentPage - 1}`}
                                    className="px-3 py-1.5 text-[13px] font-medium text-ink-secondary border border-border-default rounded-[8px] hover:bg-elevated hover:text-ink-primary transition-colors focus:outline-none focus:border-border-focus"
                                >
                                    Sebelumnya
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 text-[13px] font-medium text-ink-disabled border border-border-default rounded-[8px] bg-sunken">
                                    Sebelumnya
                                </span>
                            )}

                            {currentPage < totalPages ? (
                                <Link
                                    href={`/karyawan/nonaktif?page=${currentPage + 1}`}
                                    className="px-3 py-1.5 text-[13px] font-medium text-ink-secondary border border-border-default rounded-[8px] hover:bg-elevated hover:text-ink-primary transition-colors focus:outline-none focus:border-border-focus"
                                >
                                    Selanjutnya
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 text-[13px] font-medium text-ink-disabled border border-border-default rounded-[8px] bg-sunken">
                                    Selanjutnya
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="Ruang arsip bersih"
                    body="Belum ada satupun karyawan terhapus yang bersarang di database ini."
                    action="Kembali ke Data Aktif"
                    actionHref="/karyawan"
                />
            )}
        </section>
    )
}