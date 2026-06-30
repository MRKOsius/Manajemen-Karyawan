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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            
            {/* Sisi Kiri: Form Area */}
            <div className="bg-surface flex items-center justify-center p-10 relative z-10 w-full h-full lg:border-r border-border-default">
                <div className="w-full max-w-[420px]">
                    <div className="w-12 h-12 bg-accent-light border border-accent/20 text-accent rounded-[10px] flex items-center justify-center mb-10 shadow-sm">
                        <Container strokeWidth={1.5} size={24} />
                    </div>

                    <p className="font-sans text-[11px] font-semibold text-accent tracking-[0.15em] uppercase mb-3">NEXHR INTRANET</p>
                    <h1 className="font-serif text-[32px] text-ink-primary leading-tight font-medium">
                        Portal Manajemen<br />Sumber Daya
                    </h1>
                    <hr className="border-t border-border-default mb-8" />

                    <LoginForm action={prosesLogin} />
                </div>
            </div>

            {/* Sisi Kanan: Area Dekoratif / Brand */}
            <div 
                className="hidden lg:flex flex-col items-center justify-center bg-canvas relative overflow-hidden"
                style={{
                    backgroundImage: "radial-gradient(circle, var(--border-strong) 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            >
                {/* Efek pudar bawah agar tidak monoton */}
                <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-canvas to-transparent z-0"></div>
                <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-canvas to-transparent z-0"></div>
                
                <div className="relative z-10 max-w-sm text-center px-8">
                    
                    <div className="relative mb-12">
                        <div className="w-20 h-20 mx-auto bg-surface border border-border-default rounded-[12px] shadow-sm flex items-center justify-center -rotate-6 relative z-10">
                            <Container strokeWidth={1.5} size={32} className="text-ink-primary" />
                        </div>
                        <div className="w-16 h-16 mx-auto -mt-10 bg-surface border border-border-default rounded-[12px] shadow-sm flex items-center justify-center rotate-12 relative z-0 opacity-60 ml-[60%]">
                            <Container strokeWidth={1.5} size={24} className="text-ink-muted" />
                        </div>
                    </div>

                    <h2 className="font-serif text-[28px] text-ink-primary leading-tight mb-3">Terikat & Terpusat.</h2>
                    <p className="text-[13px] text-ink-secondary leading-relaxed font-sans">
                        Desain antarmuka solid bebas distraksi. Pantau produktivitas, struktur divisi, dan sirkulasi perputaran mesin bisnis korporat Anda.
                    </p>
                </div>
            </div>
            
        </div>
    )
}