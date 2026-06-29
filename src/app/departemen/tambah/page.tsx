import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";

export default async function TambahDepartemenPage() {
    async function simpanData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const lokasi = formData.get("lokasi") as string;
        
        await prisma.departemen.create({
            data: { nama, lokasi }
        });

        redirect("/departemen")
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/departemen" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Departemen / Tambah Departemen
                </Link>
                <h1 className="text-[20px] font-semibold text-ink-primary mt-4">Tambah Master Departemen</h1>
            </div>

            <form action={simpanData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Divisi</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Departemen</label>
                                <input id="nama" type="text" name="nama" required className="hris-input" placeholder="Misal: Divisi Finansial" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="lokasi" className="text-[13px] font-medium text-ink-primary mb-1">Lokasi Gedung / Operasi</label>
                                <input id="lokasi" type="text" name="lokasi" required className="hris-input" placeholder="Lantai 12A Tower Alpha" />
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
                    <SubmitButton text="Simpan Departemen" />
                </div>
            </form>
        </section>
    )
}
