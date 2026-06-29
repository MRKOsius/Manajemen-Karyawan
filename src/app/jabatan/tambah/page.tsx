import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";

export default async function TambahJabatanPage() {
    async function simpanData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const deskripsi = formData.get("deskripsi") as string;

        await prisma.jabatan.create({
            data: {
                nama,
                deskripsi
            }
        });

        redirect("/jabatan")
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/jabatan" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Jabatan / Tambah Jabatan
                </Link>
                <h1 className="text-[20px] font-semibold text-ink-primary mt-4">Tambah Referensi Jabatan</h1>
            </div>

            <form action={simpanData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Posisi</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Jabatan</label>
                                <input id="nama" type="text" name="nama" required className="hris-input" placeholder="Misal: Manager Operasional" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="deskripsi" className="text-[13px] font-medium text-ink-primary mb-1">Deskripsi Tugas</label>
                                <textarea id="deskripsi" name="deskripsi" rows={3} className="hris-input resize-none" placeholder="Tugas dan tanggung jawab detail..."></textarea>
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
                    <SubmitButton text="Simpan Jabatan" />
                </div>
            </form>
        </section>
    )
}
