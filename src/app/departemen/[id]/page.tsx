import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import SubmitButton from "@/app/components/SubmitButton";

export default async function DetailDepartemen({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const departemen = await prisma.departemen.findUnique({
        where: { id: id }
    });

    if (!departemen) return <div className="p-10 text-center text-ink-muted mt-10 w-full">Departemen tidak ditemukan.</div>;

    async function updateData(formData: FormData) {
        "use server";
        const session = await getSession();
        if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

        const nama = formData.get("nama") as string;
        const lokasi = formData.get("lokasi") as string;

        await prisma.departemen.update({
            where: { id: id },
            data: { nama, lokasi }
        });

        redirect("/departemen");
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/departemen" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Departemen / Edit Departemen
                </Link>
                <div className="mt-6">
                    <h1 className="text-[20px] font-semibold text-ink-primary tracking-tight">Edit Master Departemen</h1>
                    <p className="text-ink-muted text-[12px] font-mono mt-0.5">UUID: {departemen.id}</p>
                </div>
            </div>

            <form action={updateData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Divisi</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Departemen</label>
                                <input id="nama" name="nama" type="text" defaultValue={departemen.nama} required className="hris-input" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="lokasi" className="text-[13px] font-medium text-ink-primary mb-1">Lokasi Gedung / Operasi</label>
                                <input id="lokasi" name="lokasi" type="text" defaultValue={departemen.lokasi} required className="hris-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                    <Link 
                        href="/departemen"
                        className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                    >
                        Batalkan
                    </Link>
                    <SubmitButton text="Update Departemen" />
                </div>
                
            </form>
        </section>
    );
}
