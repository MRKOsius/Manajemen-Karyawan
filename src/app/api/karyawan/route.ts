import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const dataKaryawan = await prisma.karyawan.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json({
        sukses: true,
        pesan: "Berhasil mengambil data dari Database Neon",
        data: dataKaryawan
    });
}