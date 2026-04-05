export default function ProductoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-3 w-32 bg-[#f0ece6] rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="aspect-[3/5] bg-[#f0ece6] rounded-lg" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-20 bg-[#f0ece6] rounded" />
          <div className="h-6 w-48 bg-[#f0ece6] rounded" />
          <div className="h-5 w-24 bg-[#f0ece6] rounded" />
          <div className="h-12 w-full bg-[#f0ece6] rounded-lg mt-6" />
          <div className="space-y-2 mt-6">
            <div className="h-3 w-full bg-[#f0ece6] rounded" />
            <div className="h-3 w-3/4 bg-[#f0ece6] rounded" />
            <div className="h-3 w-1/2 bg-[#f0ece6] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
