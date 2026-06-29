import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../action";

const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Karyawan", href: "/karyawan" },
    { label: "Jabatan", href: "/jabatan" },
    { label: "Departemen", href: "/departemen" },
    { label: "Absensi", href: "/absensi" },
    { label: "Gaji", href: "/gaji" },
];

export default function Sidebar({ sessionData }: { sessionData?: Record<string, unknown> | null }) {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 w-full bg-surface border-r border-border-default flex flex-col pt-6 z-10 transition-colors overflow-hidden">
            {/* Logo */}
            <div className="px-6 mb-8 flex justify-center xl:justify-start">
                <Link href="/" className="font-serif text-[18px] text-accent font-bold tracking-wide">
                    <span className="lg:hidden xl:inline">HRIS</span>
                    <span className="hidden lg:inline xl:hidden">H</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1" aria-label="Navigasi Utama">
                {navLinks.map((link) => {
                    // RBAC: Hanya SUPER_ADMIN yang bisa melihat tab Gaji
                    if (link.label === "Gaji" && sessionData?.role !== "SUPER_ADMIN") {
                        return null;
                    }

                    const isActive = link.href === "/" 
                        ? pathname === "/" 
                        : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center lg:justify-center xl:justify-start px-4 py-2 rounded text-[14px] transition-colors
                                ${isActive 
                                    ? "bg-elevated text-ink-primary font-medium border-l-2 border-accent rounded-l-none" 
                                    : "text-ink-secondary hover:bg-elevated hover:text-ink-primary"
                                }`}
                            title={link.label}
                        >
                            <span className="lg:hidden xl:inline">{link.label}</span>
                            <span className="hidden lg:inline xl:hidden font-mono text-[12px] opacity-70">
                                {link.label.substring(0, 1)}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-elevated overflow-hidden shrink-0 flex items-center justify-center">
                        <span className="text-[12px] font-medium text-ink-secondary uppercase">
                            {sessionData?.role ? String(sessionData.role).substring(0, 2) : "RY"}
                        </span>
                    </div>
                    <div className="overflow-hidden lg:hidden xl:block">
                        <p className="text-[13px] font-medium text-ink-primary truncate leading-tight capitalize">
                            {String(sessionData?.role || "Rayyan")}
                        </p>
                        <p className="text-[11px] text-ink-muted truncate">Administrator</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <form action={logoutAction} className="w-full">
                    <button 
                        type="submit" 
                        title="Keluar"
                        className="w-full flex items-center justify-center gap-2 lg:px-0 xl:px-4 py-2 text-[14px] font-medium text-ink-secondary border border-border-default rounded-[8px] hover:text-danger hover:bg-danger-bg hover:border-danger transition-colors"
                    >
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" x2="9" y1="12" y2="12"/>
                        </svg>
                        <span className="lg:hidden xl:inline">Keluar dari Sistem</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
