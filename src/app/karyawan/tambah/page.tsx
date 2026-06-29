import Link from "next/link";
import prisma from "@/lib/prisma";
import KaryawanForm from "./KaryawanForm";

export default async function TambahKaryawanPage() {
    const pilihanJabatan = await prisma.jabatan.findMany({ where: { isActive: true } });
    const pilihanDepartemen = await prisma.departemen.findMany({ where: { isActive: true } });

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/karyawan" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Karyawan / Tambah Karyawan
                </Link>
                <h1 className="text-[20px] font-semibold text-ink-primary mt-4">Tambah Karyawan Baru</h1>
            </div>

            {/* Injeksi Form Klien Zod */}
            <KaryawanForm 
                pilihanJabatan={pilihanJabatan} 
                pilihanDepartemen={pilihanDepartemen} 
            />

        </section>
    )
}