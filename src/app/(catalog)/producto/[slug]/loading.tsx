export default function ProductoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-32 bg-[#f0ece6] rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image skeleton */}
        <div>
          <div className="aspect-[3/5] bg-[#f0ece6] rounded-2xl mb-3" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-[#f0ece6] shrink-0" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div>
          <div className="h-3.5 w-24 bg-[#f0ece6] rounded mb-3" />
          <div className="h-7 w-64 bg-[#f0ece6] rounded mb-2" />
          <div className="h-5 w-40 bg-[#f0ece6] rounded mb-6" />
          <div className="h-8 w-32 bg-[#f0ece6] rounded mb-6" />

          {/* Material selector skeleton */}
          <div className="mb-5">
            <div className="h-3.5 w-16 bg-[#f0ece6] rounded mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-[#f0ece6] rounded-lg" />
              ))}
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="h-14 w-full bg-[#f0ece6] rounded-xl mb-4" />

          {/* Info badges skeleton */}
          <div className="flex gap-4">
            <div className="h-4 w-36 bg-[#f0ece6] rounded" />
            <div className="h-4 w-36 bg-[#f0ece6] rounded" />
          </div>

          {/* Description skeleton */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            <div className="h-3 w-full bg-[#f0ece6] rounded" />
            <div className="h-3 w-full bg-[#f0ece6] rounded" />
            <div className="h-3 w-3/4 bg-[#f0ece6] rounded" />
            <div className="h-3 w-1/2 bg-[#f0ece6] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
