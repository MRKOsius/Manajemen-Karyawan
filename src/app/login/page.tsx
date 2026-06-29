import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    async function prosesLogin(formData: FormData) {
        "use server"

        const username = formData.get("username") as string || "admin";
        const password = formData.get("password") as string;

        const akunAdmin = await prisma.admin.findUnique({
            where: { username: username }
        });

        if (akunAdmin) {
            const passwordCocok = await bcrypt.compare(password, akunAdmin.password);
            
            if (passwordCocok) {
                const cookieStore = await cookies();

                cookieStore.set("isLoggedIn", "true", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24
                });

                redirect("/");
            }
        }
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-canvas"
            style={{
                backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }}
        >
            <div className="bg-surface border border-border-default rounded-[8px] p-10 w-full max-w-[400px]">
                <p className="font-sans text-[12px] font-semibold text-ink-muted tracking-widest uppercase mb-3">HRIS</p>
                <h1 className="font-serif text-[32px] text-accent leading-[1.1] mb-6">
                    Masa Depan Manajemen Karyawan.
                </h1>
                
                <hr className="border-t border-border-default mb-6" />

                <LoginForm action={prosesLogin} />
            </div>
        </div>
    )
}