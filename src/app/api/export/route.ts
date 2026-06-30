import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const type = req.nextUrl.searchParams.get("type") || "karyawan";
    const isSuperAdmin = session.role === "SUPER_ADMIN";

    if (type === "gaji") {
        if (!isSuperAdmin) return new NextResponse("Forbidden", { status: 403 });
        
        const riwayat = await prisma.gajiRiwayat.findMany({
            include: { karyawan: true },
            orderBy: { createdAt: 'desc' }
        });

        const headerRow = ["ID Riwayat", "Bulan", "Nama Karyawan", "Nominal", "Status"].join(",");
        const dataRows = riwayat.map(g => [g.id, `"${g.bulan}"`, `"${g.karyawan.nama}"`, g.nominal, g.status].join(","));
        const csvContent = [headerRow, ...dataRows].join("\n");

        return new NextResponse(csvContent, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=laporan-gaji.csv" }});
    }
    
    if (type === "absensi") {
        const rekaman = await prisma.absensi.findMany({
            include: { karyawan: true },
            orderBy: { waktu: 'desc' }
        });

        const headerRow = ["ID Absensi", "Nama Karyawan", "Tipe", "Waktu"].join(",");
        const dataRows = rekaman.map(a => [a.id, `"${a.karyawan.nama}"`, a.tipe, new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(a.waktu)].join(","));
        const csvContent = [headerRow, ...dataRows].join("\n");

        return new NextResponse(csvContent, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=laporan-absensi.csv" }});
    }

    // Default: Karyawan
    const karyawan = await prisma.karyawan.findMany({
        where: { isActive: true },
        include: { departemen: true, jabatan: true }
    });

    // Sesuaikan header berdasarkan role (Sembunyikan Gaji untuk HR_STAFF)
    const headerArr = ["ID", "Nama Lengkap", "Jabatan", "Departemen", "Tanggal Bergabung"];
    if (isSuperAdmin) headerArr.splice(4, 0, "Gaji Pokok");
    
    const headerRow = headerArr.join(",");

    const dataRows = karyawan.map(k => {
        const bergabung = new Intl.DateTimeFormat('id-ID').format(k.createdAt);
        const rowArr = [
            k.id, 
            `"${k.nama.replace(/"/g, '""')}"`, 
            `"${k.jabatan?.nama || 'Tanpa Jabatan'}"`, 
            `"${k.departemen?.nama || 'Tanpa Departemen'}"`,
            bergabung
        ];
        if (isSuperAdmin) rowArr.splice(4, 0, k.gaji.toString());
        return rowArr.join(",");
    });

    const csvContent = [headerRow, ...dataRows].join("\n");

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "attachment; filename=laporan-karyawan-aktif.csv",
        },
    });
}
