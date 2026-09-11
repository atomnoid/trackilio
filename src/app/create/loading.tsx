export default function CreateListLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="skeleton-shimmer h-5 w-36 rounded-full mx-auto" />
        <div className="skeleton-shimmer h-10 w-72 rounded-xl mx-auto" />
        <div className="skeleton-shimmer h-4 w-80 rounded-lg mx-auto" />
      </div>

      {/* Form card */}
      <div className="rounded-3xl border border-[#E8DECA] bg-white p-8 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton-shimmer h-3.5 w-24 rounded-md" />
            <div className="skeleton-shimmer h-12 w-full rounded-2xl" />
          </div>
        ))}
        <div className="skeleton-shimmer h-12 w-full rounded-2xl mt-4" />
      </div>
    </div>
  );
}
