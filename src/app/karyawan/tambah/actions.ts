"use server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// Definisi tingkat asersi keamanan terpusat Zod
const skemaKaryawan = z.object({
    nama: z.string().min(3, "Nama sangat pendek, minimal 3 karakter."),
    gaji: z.coerce.number().positive("Skala kompensasi wajib bernilai positif nyata."),
    jabatanId: z.string().min(1, "Posisi struktural wajib didudukkan."),
    departemenId: z.string().min(1, "Distribusi unit divisi wajib diterapkan.")
});

export async function simpanKaryawan(prevState: unknown, formData: FormData) {
    const rawData = {
        nama: formData.get("nama"),
        gaji: formData.get("gaji"),
        jabatanId: formData.get("jabatanId"),
        departemenId: formData.get("departemenId"),
    };

    const validasi = skemaKaryawan.safeParse(rawData);

    // Filter A: Menolak data palsu yang tidak memenuhi regulasi Zod
    if (!validasi.success) {
        return {
            error: validasi.error.flatten().fieldErrors,
            message: "Mohon isi kelengkapan formulir sesuai standar operasional yang tepat."
        };
    }

    // Filter B: Menghindari layar putih (Error 500) jika Database atau ORM bermasalah jaringan
    try {
        await prisma.karyawan.create({
            data: {
                nama: validasi.data.nama,
                jabatanId: validasi.data.jabatanId,
                departemenID: validasi.data.departemenId,
                gaji: validasi.data.gaji,
            }
        });
    } catch {
        return {
            message: "Maaf, mesin Database (Prisma) gagal mengeksekusi rekaman data ini. Hubungi IT."
        };
    }

    // Jika lancar, baru kita pindahkan UI tanpa interupsi
    redirect("/karyawan");
}
