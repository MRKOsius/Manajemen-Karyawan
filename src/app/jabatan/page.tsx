import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Data Jabatan | HRIS Admin',
    description: 'Daftar kelola data jabatan.'
}

export default function JabatanPage() {
    return (
        <section className="px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Data Jabatan</h1>
                <p className="text-hris-muted text-sm mt-1">Kelola level posisi dan struktur organisasi.</p>
            </div>

            {/* Empty state — menunggu koneksi database */}
            <div role="status" className="text-center py-16 border border-dashed border-hris-border rounded-sm">
                <p className="text-hris-muted">Modul jabatan belum dikonfigurasi.</p>
                <p className="text-xs text-hris-muted mt-2 font-mono">Akan tersedia setelah integrasi database.</p>
            </div>
        </section>
    )
}