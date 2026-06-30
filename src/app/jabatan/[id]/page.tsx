import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import SubmitButton from "@/app/components/SubmitButton";

export default async function DetailJabatan({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const jabatan = await prisma.jabatan.findUnique({
        where: { id: id }
    });

    if (!jabatan) return <div className="p-10 text-center text-ink-muted mt-10 w-full">Jabatan tidak ditemukan.</div>;

    async function updateData(formData: FormData) {
        "use server";
        const session = await getSession();
        if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
        
        const nama = formData.get("nama") as string;
        const deskripsi = formData.get("deskripsi") as string;

        await prisma.jabatan.update({
            where: { id: id },
            data: { nama, deskripsi }
        });

        redirect("/jabatan");
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/jabatan" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Jabatan / Edit Jabatan
                </Link>
                <div className="mt-6">
                    <h1 className="text-[20px] font-semibold text-ink-primary tracking-tight">Edit Master Jabatan</h1>
                    <p className="text-ink-muted text-[12px] font-mono mt-0.5">UUID: {jabatan.id}</p>
                </div>
            </div>

            <form action={updateData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Posisi</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Jabatan</label>
                                <input id="nama" name="nama" type="text" defaultValue={jabatan.nama} required className="hris-input" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="deskripsi" className="text-[13px] font-medium text-ink-primary mb-1">Deskripsi Tugas</label>
                                <textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={jabatan.deskripsi || ""} className="hris-input resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                    <Link 
                        href="/jabatan"
                        className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                    >
                        Batalkan
                    </Link>
                    <SubmitButton text="Update Jabatan" />
                </div>
                
            </form>
        </section>
    );
}