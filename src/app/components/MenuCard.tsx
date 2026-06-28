import Link from "next/link"

// === DESIGN BRIEF ===
// Card navigasi — bukan dekorasi, ini tombol akses modul
// Tidak pakai rounded-xl (AI default), gunakan rounded-sm tajam
// Tidak pakai hover:scale (noise visual), gunakan border accent shift

interface MenuCardProps {
    title: string
    description: string
    href: string
    children?: React.ReactNode
}

export default function MenuCard({ title, description, href, children }: MenuCardProps) {
    return (
        <Link
            href={href}
            className="block p-6 bg-hris-surface border border-hris-border rounded-sm
                       hover:border-hris-accent transition-colors group"
        >
            <h3 className="text-base font-bold text-hris-light group-hover:text-hris-accent transition-colors">
                {title}
            </h3>
            <p className="text-hris-muted text-sm mt-1">{description}</p>
            {children}
        </Link>
    )
}