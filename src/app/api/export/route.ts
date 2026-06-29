import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    // 1. Validasi Keamanan (Hanya HRD/Admin yang boleh mengunduh!)
    const session = await getSession();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Tarik Seluruh Data Karyawan (Aktif) dari Database
    const karyawan = await prisma.karyawan.findMany({
        where: { isActive: true },
        include: {
            departemen: true,
            jabatan: true
        }
    });

    // 3. Susun Baris Judul (Header Tabel Excel)
    const headerRow = ["ID", "Nama Lengkap", "Jabatan", "Departemen", "Gaji Pokok", "Tanggal Bergabung"].join(",");

    // 4. Susun Baris Isi (Data Baris per Karyawan)
    const dataRows = karyawan.map(k => {
        const id = k.id;
        // Escape koma pada teks jika ada, menggunakan tanda kutip ganda ""
        const nama = `"${k.nama.replace(/"/g, '""')}"`;
        const jabatan = `"${k.jabatan?.nama || 'Tanpa Jabatan'}"`;
        const departemen = `"${k.departemen?.nama || 'Tanpa Departemen'}"`;
        const gaji = k.gaji;
        const bergabung = new Intl.DateTimeFormat('id-ID').format(k.createdAt);

        return [id, nama, jabatan, departemen, gaji, bergabung].join(",");
    });

    // 5. Gabungkan Header dan Isi (Dipisah dengan garis baru / Enter)
    const csvContent = [headerRow, ...dataRows].join("\n");

    // 6. Cetak dan Kirim sebagai Berkas Ekspor Paksa .CSV (Bukan sekadar teks browser)
    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "attachment; filename=laporan-karyawan-aktif.csv",
        },
    });
}
