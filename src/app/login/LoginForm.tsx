"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm({ action }: { action: (formData: FormData) => void }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={action} className="space-y-5">
            <div className="flex flex-col">
                <label htmlFor="username" className="text-[13px] font-medium text-ink-primary mb-1">Email atau Username</label>
                <input 
                    id="username" 
                    name="username" 
                    type="text" 
                    className="hris-input" 
                    placeholder="nama@perusahaan.com"
                    defaultValue="admin"
                    required 
                />
            </div>

            <div className="flex flex-col relative">
                <label htmlFor="password" className="text-[13px] font-medium text-ink-primary mb-1">Kata Sandi</label>
                <div className="relative w-full">
                    <input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"}
                        className="hris-input pr-10" 
                        placeholder="••••••••"
                        required 
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted hover:text-ink-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            <Button 
                type="submit" 
                className="w-full mt-4 bg-accent text-surface hover:bg-accent-hover font-medium py-6 text-[14px] rounded-[6px]"
            >
                Masuk ke Dashboard
            </Button>
            
            <p className="text-center text-[11px] text-ink-muted mt-4">
                HRIS Admin v1.0
            </p>
        </form>
    )
}
