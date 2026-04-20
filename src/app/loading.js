import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen pt-28">
      {/* Top Header Placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-4 w-48 opacity-70" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Secondary Banner area */}
      <Skeleton className="h-[200px] w-full mb-12 rounded-2xl" />

      {/* Flexible Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 border border-[var(--border-subtle)]">
            <div className="flex justify-between items-center">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-7 w-3/4 mt-4" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
