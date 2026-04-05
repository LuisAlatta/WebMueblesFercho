export default function CategoriaLoading() {
  return (
    <div className="min-h-[calc(100dvh-72px)] animate-pulse">
      {/* Sticky header skeleton */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f0ece6]" />
          <div>
            <div className="h-4 w-28 bg-[#f0ece6] rounded" />
            <div className="h-3 w-16 bg-[#f0ece6] rounded mt-1.5" />
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white">
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
  );
}
