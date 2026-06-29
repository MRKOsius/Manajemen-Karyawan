"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import React from "react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullscreenPage = pathname === "/login" || pathname === "/setup";

    if (isFullscreenPage) {
        return <main className="bg-canvas min-h-screen">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-canvas">
            <Sidebar />
            <main className="flex-1 ml-[240px] min-h-screen transition-all">
                {children}
            </main>
        </div>
    );
}
