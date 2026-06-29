"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { Menu } from "lucide-react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullscreenPage = pathname === "/login" || pathname === "/setup";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [prevPathname, setPrevPathname] = useState(pathname);

    // Menutup paksa sidebar mobile saat URL/Rute berubah
    if (pathname !== prevPathname) {
        setIsMobileMenuOpen(false);
        setPrevPathname(pathname);
    }

    if (isFullscreenPage) {
        return <main className="bg-canvas min-h-screen">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-canvas">
            {/* Tombol Hamburger Melayang (Khusus Layar HP/Mobile) */}
            <button 
                aria-label="Buka Navigasi"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed z-45 bottom-6 right-6 w-14 h-14 bg-ink-primary text-canvas rounded-full shadow-[0px_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Tirai Gelap / Backdrop (Klik Untuk Menutup Menu) */}
            <div 
                className={`md:hidden fixed inset-0 bg-ink-primary/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Kontainer Sidebar (Geser di HP, Statis di Desktop) */}
            <div className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            {/* Wilayah Konten Utama (Bergeser otomatis di belakang sidebar Desktop) */}
            <main className="flex-1 min-h-screen w-full md:ml-[240px] transition-all pb-24 md:pb-0">
                {children}
            </main>
        </div>
    );
}
