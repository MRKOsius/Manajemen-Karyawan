import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "@/lib/session";
import ActionDropdown from "../components/ActionDropdown";
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Jabatan | HRIS Admin',
    description: 'Kelola posisi struktural.'
}

async function hapusJabatan(formData: FormData) {
    "use server";
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    await prisma.jabatan.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/jabatan");
    revalidatePath("/");
}

export default async function JabatanPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";
    
    const session = await getSession();
    const isSuperAdmin = session?.role === 'SUPER_ADMIN';
    
    const dataJabatan = await prisma.jabatan.findMany({
        where: {
            isActive: true,
            nama: {
                contains: kataKunci,
                mode: 'insensitive'
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-[18px] font-semibold text-ink-primary">Jabatan</h1>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form method="GET" className="flex items-center w-full md:w-64 relative">
                        <Search className="w-4 h-4 text-ink-muted absolute left-3" />
                        <input 
                            type="text" 
                            name="q" 
                            defaultValue={kataKunci}
                            placeholder="Cari jabatan..." 
                            className="w-full bg-surface border border-border-default rounded-[6px] py-2 pl-9 pr-3 text-[13px] text-ink-primary focus:outline-none focus:border-border-focus"
                        />
                        {kataKunci && (
                            <Link href="/jabatan" className="absolute right-3 text-[11px] font-medium text-danger hover:underline">
                                Clear
                            </Link>
                        )}
                    </form>
                    
                    {isSuperAdmin && (
                        <Link 
                            href="/jabatan/tambah" 
                            className="bg-accent hover:bg-accent-hover text-surface text-[13px] font-medium py-2 px-4 rounded-[6px] whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                        >
                            + Tambah Jabatan
                        </Link>
                    )}
                </div>
            </div>

            {dataJabatan.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Informasi Posisi
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
                            {dataJabatan.map((jabatan) => {
                                const createDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(jabatan.createdAt);

                                return (
                                <tr key={jabatan.id}>
                                    <td className="px-6 py-3">
                                        <p className="text-[14px] font-medium text-ink-primary">{jabatan.nama}</p>
                                        <p className="text-[12px] font-mono text-ink-muted mt-0.5 max-w-sm lg:max-w-xl truncate">
                                            LV-{(jabatan.id).slice(-4).toUpperCase()} · {jabatan.deskripsi || "Struktural standar"} · {createDate}
                                        </p>
                                    </td>
                                    <td className="px-6 py-3">
                                       <span className="badge-active inline-flex items-center gap-1.5">
                                           <span aria-hidden="true" className="text-[10px]">●</span> Aktif
                                       </span>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-3 text-right">
                                            <ActionDropdown 
                                                id={jabatan.id} 
                                                entityName={jabatan.nama}
                                                entityType="Jabatan"
                                                editHref={`/jabatan/${jabatan.id}`}
                                                deleteAction={hapusJabatan}
                                            />
                                        </td>
                                    )}
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState 
                    title="Belum ada referensi jabatan" 
                    body="Pastikan minimal ada satu struktur set sebelum Anda mendaftarkan karyawan baru."
                    action="Tambah Jabatan"
                    actionHref="/jabatan/tambah"
                />
            )}
        </section>
    )
}