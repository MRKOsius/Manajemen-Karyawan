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
            <h1 className="text-3xl font-bold text-white mb-2">Hubungi Kami</h1>
            <p className="text-gray-400 mb-8">Punya Keluhan teknis atau pertanyaan seputar aplikasi HR ini? Tinggalkan pesanmu di sini!</p>
            <form action={kirimPesan} className="bg-gray-900 border border-gray-800 p-8 rounded-2xl flex flex-col gap-6 shadow-xl">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300">Siapa Namamu?</label>
                    <input type="text" name="nama" required className="bg-gray-800 border-none p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Misal: Rayyan" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300">Alamat Email</label>
                    <input type="text" name="email" required className="bg-gray-800 border-none p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="rayyan@contoh.com"/>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300">Deskripsikan Pesanmu</label>
                    <textarea name="isiPesan" rows={4} required className="bg-gray-800 border-none p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none" placeholder="Bantu aku! Serverku kebakaran...."></textarea>
                </div>
                
                <button type="submit" className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-95 transition-all py-3 rounded-xl font-bold text-white uppercase tracking-wider text-sm shadow-lg shadow-blue-900/20">Kirim Pesan Melintasi Server</button>
            </form>
        </main>
    )
}