export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        {/* Simple, lightweight spinner — no heavy animation component */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#F5E7C6]" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#FA8112] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#6B6862]">Loading…</p>
      </div>
    </div>
  );
}
