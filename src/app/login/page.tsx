import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import LoginForm from "./LoginForm";
import { Container } from "lucide-react";
import { createSession } from "@/lib/session";

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

                await createSession(akunAdmin.id, akunAdmin.role)

                redirect("/");
            }
        }
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-canvas relative"
            style={{
                backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }}
        >
            <div className="bg-surface border border-border-strong shadow-sm rounded-[8px] p-10 w-full max-w-[420px] relative z-10">
                
                <div className="w-12 h-12 bg-accent-light border border-accent/20 text-accent rounded-[10px] flex items-center justify-center mb-8 shadow-sm">
                    <Container strokeWidth={1.5} size={24} />
                </div>

                <p className="font-sans text-[11px] font-semibold text-accent tracking-[0.15em] uppercase mb-3">Sistem Akses Intranet</p>
                <h1 className="font-serif text-[34px] text-ink-primary leading-[1.05] tracking-tight mb-8">
                    Kelola Kapital <br/> Manusia Terpadu.
                </h1>
                <hr className="border-t border-border-default mb-8" />

                <LoginForm action={prosesLogin} />
            </div>
        </div>
    )
}