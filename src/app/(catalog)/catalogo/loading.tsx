export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 animate-pulse">
      <div className="flex gap-8">
        {/* Sidebar skeleton — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-4">
          <div className="h-4 w-20 bg-[#f0ece6] rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-full bg-[#f0ece6] rounded" />
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="h-5 w-32 bg-[#f0ece6] rounded" />
              <div className="h-3 w-20 bg-[#f0ece6] rounded mt-1.5" />
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded overflow-hidden">
                <div className="aspect-[3/5] bg-[#f0ece6]" />
                <div className="px-3 py-3">
                  <div className="h-2.5 w-14 bg-[#f0ece6] rounded mb-2" />
                  <div className="h-3 w-24 bg-[#f0ece6] rounded mb-2" />
                  <div className="h-3.5 w-16 bg-[#f0ece6] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
