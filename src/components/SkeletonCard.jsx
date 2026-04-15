export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px]">
      <div className="rounded-lg overflow-hidden">
        <div className="w-full aspect-[2/3] bg-white/5 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="mb-10">
      <div className="h-6 w-48 bg-white/5 animate-pulse rounded mb-3 mx-4 sm:mx-6 lg:mx-12" />
      <div className="flex gap-3 px-4 sm:px-6 lg:px-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
