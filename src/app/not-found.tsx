import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: '404 Tidak Ditemukan | HRIS Admin'
}

export default function NotFound() {
    return (
        <section className="px-10 py-20 w-full min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="mb-8 opacity-20 text-ink-muted">
                <FileQuestion className="w-24 h-24 stroke-[1.5]" />
            </div>
            
            <h1 className="text-[20px] font-semibold text-ink-primary mb-2">Pencarian Nihil (404)</h1>
            <p className="text-[13px] text-ink-secondary max-w-md mx-auto mb-10 leading-relaxed">
                Halaman, dokumen, atau rute URL yang barusan Anda tuju kemungkinan salah eja atau telah dimusnahkan secara permanen dari server HRIS.
            </p>

            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-[13px] font-medium text-white transition-colors rounded-[6px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
                <ArrowLeft className="w-4 h-4" /> Balik ke Dashboard Indeks
            </Link>
        </section>
    );
}
