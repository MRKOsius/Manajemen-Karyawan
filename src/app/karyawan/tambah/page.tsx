import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default function TambahKaryawanPage() {
    async function simpanData(formData: FormData) {
        "use server";

        const nama = formData.get("nama") as string;
        const jabatan = formData.get("jabatan") as string;
        const divisi = formData.get("divisi") as string;
        const gaji = Number(formData.get("gaji"));

        await prisma.karyawan.create({
            data: {
                nama: nama,
                jabatan: jabatan,
                divisi: divisi,
                gaji: gaji,
            }
        });

        redirect("/karyawan")
    }

    return (
        <main className="p-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/karyawan" className="text-gray-400 hover:text-white transition">
                    ← Kembali
                </Link>
                <h1 className="text-3xl font-bold text-white">Tambah Karyawan Baru</h1>
            </div>

            <form action={simpanData} className="max-w-md flex flex-col gap-4 bg-gray-900 p-6 rounded-xl border-gray-800">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm">Nama Lengkap</label>
                    <input type="text" name="nama" required className="bg-gray-800 text-white rounded-lg p-3 outline-none border border-gray-700 focus:border-blue-500 transition" placeholder="Misal: Budi Santoso" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm">Jabatan</label>
                    <input type="text" name="jabatan" required className="bg-gray-800 text-white rounded-lg p-3 outline-none border border-gray-700 focus:border-blue-500 transition" placeholder="Misal: Software Engineer" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm">Divisi</label>
                    <input type="text" name="divisi" required className="bg-gray-800 text-white rounded-lg p-3 outline-none border border-gray-700 focus:border-blue-500 transition" placeholder="Misal: IT Development" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm">Gaji (Rp)</label>
                    <input type="number" name="gaji" required className="bg-gray-800 text-white rounded-lg p-3 outline-none border border-gray-700 focus:border-blue-500 transition" placeholder="Misal: 5000000" />
                </div>

                <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition active:scale-95">
                    Simpan Data
                </button>
            </form>
        </main>
    )
}