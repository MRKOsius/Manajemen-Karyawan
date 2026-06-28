// Loading state — skeleton pulse, bukan spinner besar
// Sesuai skill ui-design: "skeleton, bukan spinner untuk konten besar"

export default function Loading() {
    return (
        <div className="px-6 py-8" aria-busy="true" aria-label="Memuat halaman...">
            {/* Skeleton heading */}
            <div className="mb-8 space-y-2">
                <div className="h-7 w-48 bg-hris-surface animate-pulse rounded-sm"></div>
                <div className="h-4 w-72 bg-hris-surface animate-pulse rounded-sm"></div>
            </div>

            {/* Skeleton grid cards */}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-hris-surface animate-pulse rounded-sm border border-hris-border"></div>
                ))}
            </div>
        </div>
    )
}