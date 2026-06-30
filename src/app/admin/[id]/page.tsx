import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import SubmitButton from "@/app/components/SubmitButton";

export default async function DetailAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Validasi Akses Halaman
    const sessionDetail = await getSession();
    if (sessionDetail?.role !== "SUPER_ADMIN") {
        return <div className="p-10 text-center text-ink-muted">Akses Terlarang</div>;
    }

    const targetAccount = await prisma.admin.findUnique({
        where: { id: id }
    });

    if (!targetAccount) return <div className="p-10 text-center text-ink-muted mt-10 w-full">Akun tidak ditemukan.</div>;

    async function updateData(formData: FormData) {
        "use server";
        const session = await getSession();
        if (session?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

        const username = formData.get("username") as string;
        const passwordPlain = formData.get("password") as string;
        const role = formData.get("role") as string;

        if (!username || !role) {
            throw new Error("Data nama pengguna dan role wajib diisi.");
        }

        // Cek bentrok username dengan admin lain (kecuali diri dia sendiri)
        const existing = await prisma.admin.findFirst({
            where: {
                username: username,
                id: { not: id }
            }
        });

        if (existing) {
            throw new Error("Username sudah terpakai oleh admin lain.");
        }

        const updatePayload: { username: string, role: string, password?: string } = {
            username,
            role
        };

        // Cegah downgrade role bunuh diri, jika dia mengedit profilnya sendiri
        if (session.id === id && role === "HR_STAFF") {
             throw new Error("Pencegahan Lockout: Anda tidak bisa menurunkan Hak Akses Root ke Staff diri sendiri secara mandiri.");
        }

        // Jika password diisi, update hash. Jika tidak, gunakan hash lama di DB
        if (passwordPlain && passwordPlain.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updatePayload.password = await bcrypt.hash(passwordPlain, salt);
        }

        await prisma.admin.update({
            where: { id: id },
            data: updatePayload
        });

        redirect("/admin");
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/admin" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Kelola Admin / Edit
                </Link>
                <div className="mt-6">
                    <h1 className="text-[20px] font-semibold text-ink-primary tracking-tight">Edit Admin</h1>
                    <p className="text-ink-muted text-[12px] font-mono mt-0.5">UUID: {targetAccount.id}</p>
                </div>
            </div>

            <form action={updateData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    <div className="mb-0">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Akun</h2>
                        <div className="gap-6 flex flex-col">
                            
                            <div className="flex flex-col">
                                <label htmlFor="username" className="text-[13px] font-medium text-ink-primary mb-1">Username</label>
                                <input id="username" type="text" name="username" defaultValue={targetAccount.username} required className="hris-input lowercase" />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-[13px] font-medium text-ink-primary mb-1 flex items-center gap-2">
                                    Password 
                                    <span className="bg-canvas border border-border-default text-ink-secondary px-1.5 py-0.5 rounded text-[10px] font-mono tracking-widest font-normal">OPSIONAL</span>
                                </label>
                                <input id="password" type="password" name="password" className="hris-input font-mono" minLength={6} />
                            </div>

                            <div className="flex flex-col mt-2">
                                <label htmlFor="role" className="text-[13px] font-medium text-ink-primary mb-2">Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-3 border border-border-default rounded-[6px] hover:border-border-strong cursor-pointer transition-colors bg-canvas has-checked:border-border-strong">
                                        <input type="radio" name="role" value="HR_STAFF" defaultChecked={targetAccount.role === "HR_STAFF"} className="accent-accent" />
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium text-ink-primary cursor-pointer">HR STAFF</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-border-default rounded-[6px] hover:border-accent-hover cursor-pointer transition-colors bg-accent/5 has-checked:border-accent-strong">
                                        <input type="radio" name="role" value="SUPER_ADMIN" defaultChecked={targetAccount.role === "SUPER_ADMIN"} className="accent-accent" />
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium cursor-pointer text-accent">SUPER ADMIN</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {sessionDetail.id === targetAccount.id && (
                                 <div className="p-3 bg-danger-bg text-danger/80 border border-danger/30 rounded text-[12px] font-medium">
                                     Ini adalah akun Anda sendiri.
                                 </div>
                            )}
                            
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
                    <SubmitButton text="Update Pemilik Akun" />
                </div>
            </form>
        </section>
    )
}
