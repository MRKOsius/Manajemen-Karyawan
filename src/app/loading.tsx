export default function Loading() {
  return (
    <div className="px-10 py-10 max-w-6xl mx-auto flex flex-col gap-8 w-full" aria-busy="true" aria-label="Memuat data...">
      {/* Skeleton Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="skeleton h-6 w-32 rounded"></div>
        <div className="skeleton h-10 w-full md:w-64 rounded-[6px]"></div>
      </div>

      {/* Skeleton Table */}
      <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
        <div className="border-b border-border-strong px-6 py-3 flex gap-4">
          <div className="skeleton h-4 w-24 rounded"></div>
        </div>
        
        {/* Table Rows Skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-border-default last:border-0 hover:bg-elevated transition-colors">
            <div>
              <div className="skeleton h-4 w-48 rounded"></div>
              <div className="skeleton h-3 w-64 rounded mt-1.5 opacity-60"></div>
            </div>
            <div>
               <div className="skeleton h-6 w-20 rounded-[20px]"></div>
            </div>
            <div className="skeleton h-6 w-6 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}