"use client";
import { useState } from "react";

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
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ink-muted hover:text-ink-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                        {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-accent text-white hover:bg-accent-hover font-medium rounded-[6px] py-[12px] px-6 mt-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
                Akses Dashboard
            </button>
            
            <p className="text-center text-[11px] text-ink-muted mt-4">
                HRIS Admin v1.0
            </p>
        </form>
    )
}
