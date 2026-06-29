import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";

export default async function DetailDepartemen({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const departemen = await prisma.departemen.findUnique({
        where: { id: id }
    });

    if (!departemen) return <div className="p-10 text-center text-hris-muted mt-10">Departemen tidak ditemukan.</div>;

    async function updateData(formData: FormData) {
        "use server";
        const nama = formData.get("nama") as string;
        const lokasi = formData.get("lokasi") as string;

        await prisma.departemen.update({
            where: { id: id },
            data: { nama, lokasi }
        });

        redirect("/departemen");
    }

    return (
        <section className="px-6 py-8 flex flex-col items-center">
            
            <div className="w-full max-w-2xl text-left mb-6">
                <Link href="/departemen" className="text-sm font-mono text-hris-info hover:underline flex items-center gap-2">
                    ← Kembali ke Tabel Master
                </Link>
            </div>

            <div className="w-full max-w-2xl mb-8">
                <h1 className="text-2xl font-bold text-hris-light tracking-tight">Edit Master Departemen</h1>
                <p className="text-hris-muted text-sm font-mono mt-1">UUID: {departemen.id}</p>
            </div>

            <form action={updateData} className="w-full max-w-2xl bg-hris-surface p-8 border border-hris-border rounded-sm shadow-xl">
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Nama Divisi / Jabatan</label>
                        <input 
                            name="nama" 
                            type="text" 
                            defaultValue={departemen.nama} 
                            required 
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-hris-muted">Lokasi / Gedung</label>
                        <input 
                            name="lokasi" 
                            type="text" 
                            defaultValue={departemen.lokasi} 
                            required
                            className="w-full p-3 bg-hris-primary border border-hris-border text-hris-light focus:outline-none focus:ring-2 focus:ring-hris-accent rounded-sm transition-all" 
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hris-border flex justify-end">
                    <SubmitButton text="UPDATE DEPARTEMEN" />
                </div>
                
            </form>
        </section>
    );
}
