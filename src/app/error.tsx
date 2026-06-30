"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <section className="px-10 py-20 w-full min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger-bg/20 border border-danger/30 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-danger" />
            </div>
            
            <h1 className="text-[20px] font-semibold text-ink-primary mb-2">Terjadi Bentrokan Sistem</h1>
            <p className="text-[13px] text-ink-secondary max-w-md mx-auto mb-8 leading-relaxed">
                Terjadi kesalahan sistem saat memuat data. Silakan coba lagi atau hubungi bantuan jika masalah berlanjut.
            </p>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-surface border border-border-strong text-[13px] font-medium text-ink-primary hover:bg-elevated hover:border-border-focus transition-all rounded-[6px] focus:outline-none focus:ring-2 focus:ring-border-focus"
                >
                    <RefreshCcw className="w-4 h-4" /> Picu Ulang Sistem
                </button>
                
                <a
                    href="mailto:support@nexhr.com"
                    className="flex items-center gap-2 px-6 py-2.5 bg-transparent border border-border-default text-[13px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-all rounded-[6px]"
                >
                    Hubungi Bantuan
                </a>
            </div>
            <p className="mt-8 font-mono text-[10px] text-ink-muted max-w-lg truncate">
                ERROR_TRACE_ID: {error.digest || "RUNTIME_CRASH"}
            </p>
        </section>
    );
}
