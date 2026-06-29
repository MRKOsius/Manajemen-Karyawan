"use server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { promises as fs } from "fs";
import path from "path";

// Definisi tingkat asersi keamanan terpusat Zod
const skemaKaryawan = z.object({
    nama: z.string().min(3, "Nama sangat pendek, minimal 3 karakter."),
    gaji: z.coerce.number().positive("Skala kompensasi wajib bernilai positif nyata."),
    jabatanId: z.string().min(1, "Posisi struktural wajib didudukkan."),
    departemenId: z.string().min(1, "Distribusi unit divisi wajib diterapkan."),
    avatar: z.any()
        .refine((file) => !file || file.size === 0 || file.size <= 2 * 1024 * 1024, "Ukuran maksimal foto adalah 2MB.")
        .refine((file) => !file || file.size === 0 || ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Format file harus JPG, PNG, atau WEBP.")
        .optional()
});

export async function simpanKaryawan(prevState: unknown, formData: FormData) {

    const session = await getSession();
    if (!session) {
        return {
            message: "Akses Ditolak!"
        };
    }

    const rawData = {
        nama: formData.get("nama"),
        gaji: formData.get("gaji"),
        jabatanId: formData.get("jabatanId"),
        departemenId: formData.get("departemenId"),
        avatar: formData.get("avatar")
    };

    const validasi = skemaKaryawan.safeParse(rawData);

    // Filter A: Menolak data palsu yang tidak memenuhi regulasi Zod
    if (!validasi.success) {
        return {
            error: validasi.error.flatten().fieldErrors,
            message: "Mohon isi kelengkapan formulir sesuai standar operasional yang tepat."
        };
    }

    const fileAvatar = validasi.data.avatar as File | null;
    let urlAvatarTersimpan = null;

    if (fileAvatar && fileAvatar.size > 0) {
        const bytes = await fileAvatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const namaFileUnik = `${Date.now()}-${fileAvatar.name.replaceAll(" ", "_")}`;

        const folderPublik = path.join(process.cwd(), "public/uploads");

        await fs.mkdir(folderPublik, { recursive: true });

        await fs.writeFile(path.join(folderPublik, namaFileUnik), buffer);

        urlAvatarTersimpan = `/uploads/${namaFileUnik}`;
    }

    // Filter B: Menghindari layar putih (Error 500) jika Database atau ORM bermasalah jaringan
    try {
        await prisma.karyawan.create({
            data: {
                nama: validasi.data.nama,
                jabatanId: validasi.data.jabatanId,
                departemenID: validasi.data.departemenId,
                gaji: validasi.data.gaji,
                avatar: urlAvatarTersimpan,
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
