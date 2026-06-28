import Link from "next/link"

// === DESIGN BRIEF ===
// Navbar otoritatif — logo kiri, navigasi kanan
// Tidak pakai dropdown, cukup flat links (sesuai jumlah menu kita)
// Amber accent block sebagai signature identity

const navLinks = [
    { label: "Karyawan", href: "/karyawan" },
    { label: "Jabatan", href: "/jabatan" },
    { label: "Departemen", href: "/departemen" },
    { label: "Gaji", href: "/gaji" },
]

export default function Header() {
    return (
        <header className="border-b border-hris-border bg-hris-primary px-6 py-4 flex items-center justify-between">

            {/* Logo block — amber square sebagai brand signature */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-hris-accent" aria-hidden="true"></div>
                <span className="text-lg font-bold tracking-tight text-hris-light group-hover:text-hris-accent transition-colors">
                    HRIS Admin
                </span>
            </Link>

            {/* Navigation — flat links, font-mono untuk nuansa data-driven */}
            <nav aria-label="Navigasi utama">
                <ul className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-sm font-mono text-hris-muted hover:text-hris-light transition-colors"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

        </header>
    )
}