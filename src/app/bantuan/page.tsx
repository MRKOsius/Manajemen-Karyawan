import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default function HalamanBantuan(){

    async function kirimPesan(formData: FormData) {
        "use server"

        await prisma.pesan.create({
            data: {
                nama: formData.get("nama") as string,
                email: formData.get("email") as string,
                isiPesan: formData.get("isiPesan") as string,
            }
        });

        redirect("/");
    }

    return (
        <main className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-hris-light tracking-tight mb-2">Pusat Bantuan</h1>
            <p className="text-hris-muted text-sm mb-8">Punya keluhan teknis atau kendala sistem HRIS? Laporkan di bawah ini.</p>
            <form action={kirimPesan} className="bg-hris-surface border border-hris-border p-8 rounded-sm flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-hris-light">Siapa Namamu?</label>
                    <input type="text" name="nama" required className="bg-hris-primary border border-hris-border p-3 rounded-sm text-hris-light outline-none focus:ring-2 focus:ring-hris-accent transition-shadow" placeholder="Misal: Rayyan" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-hris-light">Alamat Email</label>
                    <input type="text" name="email" required className="bg-hris-primary border border-hris-border p-3 rounded-sm text-hris-light outline-none focus:ring-2 focus:ring-hris-accent transition-shadow" placeholder="contoh: rayyan@hris.corp"/>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-hris-light">Deskripsikan Pesanmu</label>
                    <textarea name="isiPesan" rows={4} required className="bg-hris-primary border border-hris-border p-3 rounded-sm text-hris-light outline-none focus:ring-2 focus:ring-hris-accent transition-shadow resize-none" placeholder="Tulis rincian kendalamu..."></textarea>
                </div>
                <button type="submit" className="mt-2 bg-hris-light text-hris-primary hover:bg-hris-accent active:scale-[0.98] transition-all py-3 rounded-sm font-bold uppercase tracking-wider text-sm">Kirim Laporan</button>
            </form>
        </main>
    )
}