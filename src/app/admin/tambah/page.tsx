import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import SubmitButton from "@/app/components/SubmitButton";

export default async function TambahAdminPage() {
    async function simpanData(formData: FormData) {
        "use server";
        const session = await getSession();
        if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

        const username = formData.get("username") as string;
        const passwordPlain = formData.get("password") as string;
        const role = formData.get("role") as string;

        // Validasi
        if (!username || !passwordPlain || !role) {
            throw new Error("Data tidak lengkap.");
        }

        // Cek username bentrok
        const existing = await prisma.admin.findUnique({
            where: { username }
        });
        if (existing) {
            throw new Error("Username sudah digunakan akun lain.");
        }

        // Enkripsi password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });

        redirect("/admin");
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/admin" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Kelola Admin / Tambah Baru
                </Link>
                <h1 className="text-[20px] font-semibold text-ink-primary mt-4">Tambah Admin Baru</h1>
            </div>

            <form action={simpanData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Akun</h2>
                        <div className="gap-6 flex flex-col">
                            
                            <div className="flex flex-col">
                                <label htmlFor="username" className="text-[13px] font-medium text-ink-primary mb-1">Username</label>
                                <input id="username" type="text" name="username" required className="hris-input lowercase" />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-[13px] font-medium text-ink-primary mb-1">Password</label>
                                <input id="password" type="password" name="password" required className="hris-input font-mono" minLength={6} />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="role" className="text-[13px] font-medium text-ink-primary mb-2">Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-3 border border-border-default rounded-[6px] hover:border-border-strong cursor-pointer transition-colors bg-canvas">
                                        <input type="radio" name="role" value="HR_STAFF" defaultChecked className="accent-accent" />
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium text-ink-primary cursor-pointer">HR STAFF</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-border-default rounded-[6px] hover:border-accent-hover cursor-pointer transition-colors bg-accent/5">
                                        <input type="radio" name="role" value="SUPER_ADMIN" className="accent-accent" />
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium cursor-pointer text-accent">SUPER ADMIN</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                    <Link 
                        href="/admin"
                        className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                    >
                        Batalkan
                    </Link>
                    <SubmitButton text="Simpan Akun" />
                </div>
            </form>
        </section>
    )
}
