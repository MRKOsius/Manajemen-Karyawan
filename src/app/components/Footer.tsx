// Footer — informasional, bukan dekoratif
// Semantic: <footer> dengan teks ringkas

export default function Footer() {
    return (
        <footer className="border-t border-hris-border px-6 py-4 flex items-center justify-between text-xs font-mono text-hris-muted">
            <p>&copy; 2026 HRIS Admin — Rayyan</p>
            <p>Sistem Manajemen Karyawan v1.0</p>
        </footer>
    )
}