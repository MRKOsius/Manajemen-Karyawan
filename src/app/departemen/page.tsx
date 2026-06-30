import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "@/lib/session";
import ActionDropdown from "../components/ActionDropdown";
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Departemen | HRIS Admin',
    description: 'Daftar kelola divisi dan operasional.'
}

async function hapusDepartemen(formData: FormData) {
    "use server";
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
    
    const id = formData.get("id") as string;
    
    try {
        // Melakukan Hapus Permanen agar sistem constraint Prisma (P2003) bekerja
        await prisma.departemen.delete({ where: { id: id } });
        
        revalidatePath("/departemen");
        revalidatePath("/");
    } catch (error) {
        if (error instanceof Error && (error as { code?: string }).code === 'P2003') {
            return { error: "Dilarang: Departemen ini masih memiliki Karyawan tersangkut." };
        }
        return { error: "Gagal menghapus ke dalam database." };
    }
}

export default async function DepartemenPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";
    
    const session = await getSession();
    const isSuperAdmin = session?.role === 'SUPER_ADMIN';

    const dataDepartemen = await prisma.departemen.findMany({
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
                <h1 className="text-[18px] font-semibold text-ink-primary">Departemen</h1>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form method="GET" className="flex items-center w-full md:w-64 relative">
                        <Search className="w-4 h-4 text-ink-muted absolute left-3" />
                        <input 
                            type="text" 
                            name="q" 
                            defaultValue={kataKunci}
                            placeholder="Cari departemen..." 
                            className="w-full bg-surface border border-border-default rounded-[6px] py-2 pl-9 pr-3 text-[13px] text-ink-primary focus:outline-none focus:border-border-focus"
                        />
                        {kataKunci && (
                            <Link href="/departemen" className="absolute right-3 text-[11px] font-medium text-danger hover:underline">
                                Clear
                            </Link>
                        )}
                    </form>
                    
                    {isSuperAdmin && (
                        <Link 
                            href="/departemen/tambah" 
                            className="bg-accent hover:bg-accent-hover text-surface text-[13px] font-medium py-2 px-4 rounded-[6px] whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                        >
                            + Tambah Departemen
                        </Link>
                    )}
                </div>
            </div>

            {dataDepartemen.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Informasi Divisi
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
                            {dataDepartemen.map((dept) => {
                                const createDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(dept.createdAt);
                                
                                return (
                                <tr key={dept.id}>
                                    <td className="px-6 py-3">
                                        <p className="text-[14px] font-medium text-ink-primary">{dept.nama}</p>
                                        <p className="text-[12px] font-mono text-ink-muted mt-0.5">
                                            ID-{dept.id.substring(0,8)} · {dept.lokasi || "Ops: Seluruh Lokasi"} · {createDate}
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
                                                id={dept.id} 
                                                entityName={dept.nama}
                                                entityType="Departemen"
                                                editHref={`/departemen/${dept.id}`}
                                                deleteAction={hapusDepartemen}
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
                    title="Belum ada data departemen" 
                    body="Gunakan menu di atas untuk menambah unit operasi atau divisi secara terstruktur."
                    action="Tambah Departemen"
                    actionHref="/departemen/tambah"
                />
            )}
        </section>
    )
}