import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Karyawan", href: "/karyawan" },
    { label: "Jabatan", href: "/jabatan" },
    { label: "Departemen", href: "/departemen" },
    { label: "Gaji", href: "/gaji" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 w-[240px] bg-surface border-r border-border-default flex flex-col pt-6 z-10 transition-colors">
            {/* Logo */}
            <div className="px-6 mb-8">
                <Link href="/" className="font-serif text-[18px] text-accent font-bold tracking-wide">
                    HRIS
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1" aria-label="Navigasi Utama">
                {navLinks.map((link) => {
                    const isActive = link.href === "/" 
                        ? pathname === "/" 
                        : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-2 rounded text-[14px] transition-colors
                                ${isActive 
                                    ? "bg-elevated text-ink-primary font-medium border-l-2 border-accent rounded-l-none" 
                                    : "text-ink-secondary hover:bg-elevated hover:text-ink-primary"
                                }`}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Profil Bawah */}
            <div className="p-6 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-elevated overflow-hidden shrink-0 flex items-center justify-center">
                        <span className="text-[12px] font-medium text-ink-secondary">RY</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[13px] font-medium text-ink-primary truncate leading-tight">Rayyan</p>
                        <p className="text-[11px] text-ink-muted truncate">Administrator</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
