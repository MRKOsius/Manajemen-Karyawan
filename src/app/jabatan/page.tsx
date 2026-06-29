import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import ActionDropdown from "../components/ActionDropdown";
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Jabatan | HRIS Admin',
    description: 'Kelola posisi struktural.'
}

async function hapusJabatan(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.jabatan.delete({ where: { id } });
    revalidatePath("/jabatan");
    revalidatePath("/");
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
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-[18px] font-semibold text-ink-primary">Jabatan</h1>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form method="GET" className="flex items-center w-full md:w-64 relative">
                        <svg className="w-4 h-4 text-ink-muted absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                    
                    <Link 
                        href="/jabatan/tambah" 
                        className="bg-accent hover:bg-accent-hover text-white text-[13px] font-medium py-2 px-4 rounded-[6px] whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                    >
                        + Tambah Jabatan
                    </Link>
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
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-24">
                                    Opsi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataJabatan.map((jabatan: any) => {
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
                                    <td className="px-6 py-3 text-right">
                                        <ActionDropdown 
                                            id={jabatan.id} 
                                            entityName={jabatan.nama}
                                            entityType="Jabatan"
                                            editHref={`/jabatan/${jabatan.id}`}
                                            deleteAction={hapusJabatan}
                                        />
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState 
                    title="Tidak ada referensi jabatan" 
                    body="Pastikan minimal ada satu jabatan yang diset sebelum mengisi penempatan karyawan."
                    action="Tambah Jabatan"
                    actionHref="/jabatan/tambah"
                />
            )}
        </section>
    )
}