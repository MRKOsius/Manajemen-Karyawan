export default function GajiPage() {
    return (
        <section className="px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Data Gaji</h1>
                <p className="text-hris-muted text-sm mt-1">Kelola payroll, komponen gaji, dan slip bulanan.</p>
            </div>

            <div role="status" className="text-center py-16 border border-dashed border-hris-border rounded-sm">
                <p className="text-hris-muted">Modul gaji belum dikonfigurasi.</p>
                <p className="text-xs text-hris-muted mt-2 font-mono">Akan tersedia setelah integrasi database.</p>
            </div>
        </section>
    )
}