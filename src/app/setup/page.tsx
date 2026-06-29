import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Link from "next/link";

export default async function SetupPage() {
    // 1. Cek apakah admin sudah ada
    const adminSudahAda = await prisma.admin.findUnique({
        where: { username: "admin" }
    });
    if (adminSudahAda) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-hris-primary p-6">
                <div className="text-center">
                    <h1 className="text-xl text-hris-muted font-mono">=== Setup Timeout ===</h1>
                    <p className="text-hris-light mt-2">Akses ditutup. Akun Admin sudah eksis di Database.</p>
                </div>
            </main>
        )
    }
    // 2. Hash password
    const passwordRahasia = await bcrypt.hash("admin123", 10);
    // 3. Simpan ke database
    await prisma.admin.create({
        data: {
            username: "admin",
            password: passwordRahasia
        }
    });
    // --- AESTHETIC DESIGN SKILLS APPLIED ---
    return (
        <main className="min-h-screen flex items-center justify-center bg-hris-primary p-6">
            <div className="max-w-md w-full bg-hris-surface border border-hris-border p-6 rounded-sm">
                <h1 className="text-lg font-medium text-white mb-2">Setup Berhasil</h1>
                <p className="text-hris-muted text-sm mb-6">Akun administrator utama telah dibuat dan diamankan.</p>
                <Link href="/login" className="block w-full bg-hris-light text-hris-primary py-2 text-center text-sm font-medium hover:bg-hris-accent transition-colors">
                    Lanjut ke Login
                </Link>
            </div>
        </main>
    )
}