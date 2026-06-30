import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "@/lib/session";
import ActionDropdown from "../components/ActionDropdown";
import EmptyState from "../components/EmptyState";

export const metadata: Metadata = {
    title: 'Kelola Admin | HRIS Admin',
    description: 'Manajemen pengguna sistem HRIS.'
}

async function hapusAdmin(formData: FormData) {
    "use server";
    
    // RBAC Lapis Server
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
    
    const id = formData.get("id") as string;
    
    if (session.id === id) {
        throw new Error("Tindakan dicegah: Anda tidak dapat menghapus akun Anda sendiri.");
    }
    
    await prisma.admin.delete({ where: { id: id } });
    revalidatePath("/admin");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";
    
    const session = await getSession();
    const isSuperAdmin = session?.role === 'SUPER_ADMIN';

    // Asumsi: proxy.ts sudah memblokir akses ke rute ini jika BUKAN `SUPER_ADMIN`.
    // Validasi tambahan ini untuk berjaga-jaga:
    if (!isSuperAdmin) {
        return <div className="p-10 text-center text-ink-muted">Akses Terlarang</div>;
    }

    const dataAdmin = await prisma.admin.findMany({
        where: {
            username: {
                contains: kataKunci,
                mode: 'insensitive'
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-[18px] font-semibold text-ink-primary">Kelola Admin</h1>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form method="GET" className="flex items-center w-full md:w-64 relative">
                        <Search className="w-4 h-4 text-ink-muted absolute left-3" />
                        <input 
                            type="text" 
                            name="q" 
                            defaultValue={kataKunci}
                            placeholder="Cari username..." 
                            className="w-full bg-surface border border-border-default rounded-[6px] py-2 pl-9 pr-3 text-[13px] text-ink-primary focus:outline-none focus:border-border-focus"
                        />
                        {kataKunci && (
                            <Link href="/admin" className="absolute right-3 text-[11px] font-medium text-danger hover:underline">
                                Clear
                            </Link>
                        )}
                    </form>
                    
                    <Link 
                        href="/admin/tambah" 
                        className="bg-accent hover:bg-accent-hover text-surface text-[13px] font-medium py-2 px-4 rounded-[6px] whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                    >
                        + Tambah Admin
                    </Link>
                </div>
            </div>

            {dataAdmin.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Informasi Akun
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-48">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-24">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataAdmin.map((aknt) => {
                                const createDate = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(aknt.createdAt);
                                
                                return (
                                <tr key={aknt.id}>
                                    <td className="px-6 py-3">
                                        <p className="text-[14px] font-medium text-ink-primary">{aknt.username}</p>
                                        <p className="text-[12px] font-mono text-ink-muted mt-0.5">
                                            ID-{aknt.id.substring(0,8)} · Dibuat: {createDate}
                                        </p>
                                    </td>
                                    <td className="px-6 py-3 border-r border-border-default md:border-none">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold font-mono tracking-wide ${
                                                aknt.role === 'SUPER_ADMIN' 
                                                    ? 'bg-accent/10 border border-accent/20 text-accent' 
                                                    : 'bg-elevated border border-border-default text-ink-secondary'
                                            }`}>
                                                {aknt.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        {/* Tidak mengizinkan edit/hapus pada diri sendiri dari aksi row untuk cegah suicide account lock */}
                                        {session.id !== aknt.id ? (
                                            <ActionDropdown 
                                                id={aknt.id} 
                                                entityName={aknt.username}
                                                entityType="Admin"
                                                editHref={`/admin/${aknt.id}`}
                                                deleteAction={hapusAdmin}
                                            />
                                        ) : (
                                            <span className="text-[11px] font-mono text-ink-disabled">AKUN SAYA</span>
                                        )}
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState 
                    title="Tidak ada data" 
                    body="Data admin tidak ditemukan."
                    action="Kembali"
                    actionHref="/admin"
                />
            )}
        </section>
    )
}
