import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, Download, Archive } from "lucide-react";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import ActionDropdown from "../components/ActionDropdown";
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Karyawan | HRIS Admin',
    description: 'Daftar kelola data karyawan.',
}

async function hapusKaryawan(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.karyawan.update({ where: { id: id }, data: { isActive: false } });
    revalidatePath("/karyawan")
}

export default async function KaryawanPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";

    const session = await getSession();
    const isSuperAdmin = session?.role === 'SUPER_ADMIN';

    // Konfigurasi Paginasi
    const PAGE_SIZE = 10;
    const currentPage = Number(params?.page) || 1;

    // Hitung total seluruh baris di database (untuk mengetahui jumlah halaman akhir)
    const totalData = await prisma.karyawan.count({
        where: {
            isActive: true,
            nama: {
                contains: kataKunci,
                mode: 'insensitive'
            }
        }
    });

    const totalPages = Math.ceil(totalData / PAGE_SIZE) || 1;

    const dataKaryawan = await prisma.karyawan.findMany({
        where: {
            isActive: true,
            nama: {
                contains: kataKunci,
                mode: 'insensitive'
            }
        },
        orderBy: { createdAt: 'desc' },
        include: {
            jabatan: true,
            departemen: true
        },
        take: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE
    });

    return (
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-[18px] font-semibold text-ink-primary">Karyawan</h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form method="GET" className="flex items-center w-full md:w-64 relative">
                        <Search className="w-4 h-4 text-ink-muted absolute left-3" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={kataKunci}
                            placeholder="Cari karyawan..."
                            className="w-full bg-surface border border-border-default rounded-[6px] py-2 pl-9 pr-3 text-[13px] text-ink-primary focus:outline-none focus:border-border-focus"
                        />
                        {kataKunci && (
                            <Link href="/karyawan" className="absolute right-3 text-[11px] font-medium text-danger hover:underline">
                                Clear
                            </Link>
                        )}
                    </form>

                    {isSuperAdmin && (
                        <>
                            <Link
                                href="/karyawan/tambah"
                                className="bg-accent hover:bg-accent-hover text-surface text-[13px] font-medium py-2 px-4 rounded-[6px] whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                            >
                                + Tambah Karyawan
                            </Link>
        
                            <a
                                href="/api/export?type=karyawan"
                                target="_blank"
                                className="bg-transparent hover:bg-elevated text-ink-secondary hover:text-ink-primary text-[13px] font-medium py-2 px-4 border border-border-default rounded-[8px] whitespace-nowrap transition-colors focus:outline-none flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Ekspor ke Excel
                            </a>
        
                            <Link
                                href="/karyawan/nonaktif"
                                className="bg-transparent hover:bg-elevated text-ink-secondary hover:text-ink-primary text-[13px] font-medium py-2 px-4 border border-border-default rounded-[8px] whitespace-nowrap transition-colors focus:outline-none flex items-center gap-2"
                            >
                                <Archive className="w-4 h-4" />
                                Lihat Arsip
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {dataKaryawan && dataKaryawan.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Profil Karyawan
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-48">
                                    Status
                                </th>
                                {isSuperAdmin && (
                                    <th scope="col" className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-24">
                                        Opsi
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {dataKaryawan.map((karyawan) => {
                                const formattedEmail = `${karyawan.nama.split(" ")[0].toLowerCase()}@hris.co.id`;

                                return (
                                    <tr key={karyawan.id}>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-elevated border border-border-default overflow-hidden shrink-0 flex items-center justify-center">
                                                    {karyawan.avatar ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={karyawan.avatar} alt={`Foto ${karyawan.nama}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[12px] font-medium text-ink-secondary">{karyawan.nama.substring(0, 2).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-ink-primary">{karyawan.nama}</p>
                                                    <p className="text-[12px] font-mono text-ink-muted mt-1 leading-none">
                                                        {formattedEmail} · {karyawan.departemen?.nama || "Tanpa Departemen"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="badge-active inline-flex items-center gap-1.5">
                                                <span aria-hidden="true" className="text-[10px]">●</span> Aktif
                                            </span>
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="px-6 py-3 text-right">
                                                <ActionDropdown
                                                    id={karyawan.id}
                                                    entityName={karyawan.nama}
                                                    entityType="Karyawan"
                                                    editHref={`/karyawan/${karyawan.id}`}
                                                    deleteAction={hapusKaryawan}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-border-default flex items-center justify-between">
                        <p className="text-[13px] text-ink-muted">
                            Menampilkan <span className="font-mono text-ink-primary">{(currentPage - 1) * PAGE_SIZE + 1}</span> - <span className="font-mono text-ink-primary">{Math.min(currentPage * PAGE_SIZE, totalData)}</span> dari <span className="font-mono text-ink-primary">{totalData}</span> karyawan
                        </p>
                        <div className="flex items-center gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={`/karyawan?q=${kataKunci}&page=${currentPage - 1}`}
                                    className="px-3 py-1.5 text-[13px] font-medium text-ink-secondary border border-border-default rounded-[6px] hover:bg-elevated hover:text-ink-primary transition-colors focus:outline-none focus:border-border-focus"
                                >
                                    Sebelumnya
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 text-[13px] font-medium text-ink-disabled border border-border-default rounded-[6px] bg-sunken">
                                    Sebelumnya
                                </span>
                            )}

                            {currentPage < totalPages ? (
                                <Link
                                    href={`/karyawan?q=${kataKunci}&page=${currentPage + 1}`}
                                    className="px-3 py-1.5 text-[13px] font-medium text-ink-secondary border border-border-default rounded-[6px] hover:bg-elevated hover:text-ink-primary transition-colors focus:outline-none focus:border-border-focus"
                                >
                                    Selanjutnya
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 text-[13px] font-medium text-ink-disabled border border-border-default rounded-[6px] bg-sunken">
                                    Selanjutnya
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="Belum ada karyawan terdaftar"
                    body="Mulai dengan menambahkan profil karyawan pertama Anda ke dalam sistem."
                    action="Tambah Karyawan Pertama"
                    actionHref="/karyawan/tambah"
                />
            )}
        </section>
    )
}