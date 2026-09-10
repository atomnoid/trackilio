import { InteractiveHeroMap } from '@/components/home/InteractiveHeroMap';

export function MapIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return <InteractiveHeroMap className={className} />;
}

export function BlendIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-[#FAF3E1] border border-[#E8DECA] p-6 shadow-sm overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Person A */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="sm:col-span-4 bg-[#F5E7C6] border-2 border-[#222222] rounded-2xl p-4 text-center space-y-2 shadow-xs"
        >
          <div className="h-12 w-12 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
            YOU
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">@your_username</div>
            <div className="text-[11px] font-bold text-[#6B6862]">18 Places Saved</div>
          </div>
        </motion.div>

        {/* Overlapping Blend Center */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="sm:col-span-4 bg-[#FAF3E1] border-2 border-dashed border-[#FA8112] rounded-2xl p-4 text-center space-y-1 shadow-sm"
        >
          <div className="inline-block bg-[#FA8112] text-white text-base font-black px-4 py-1.5 rounded-xl shadow-xs">
            84% Match
          </div>
          <div className="text-[11px] font-extrabold text-[#222222] pt-1">
            9 shared spots in common
          </div>
          <p className="text-[10px] text-[#6B6862] font-medium">
            High overlap in artisan bakeries & sunset viewpoints
          </p>
        </motion.div>

        {/* Person B */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="sm:col-span-4 bg-[#F5E7C6] border-2 border-[#222222] rounded-2xl p-4 text-center space-y-2 shadow-xs"
        >
          <div className="h-12 w-12 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
            ALEX
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">@alex_wanderer</div>
            <div className="text-[11px] font-bold text-[#6B6862]">24 Places Saved</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SaveFlowIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`rounded-3xl bg-[#FAF3E1] border border-[#E8DECA] p-6 shadow-sm ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Step 1: Spot */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl border border-[#E8DECA] p-4 space-y-2.5 shadow-xs"
        >
          <div className="h-12 rounded-xl bg-[#F5E7C6] flex items-center justify-center text-xl font-black">
            ☕
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">Blue Tokai Cafe</div>
            <div className="text-[10px] text-[#6B6862]">Kolkata, India</div>
          </div>
          <span className="block text-center text-[10px] font-black uppercase text-white bg-[#FA8112] py-1 rounded-lg shadow-2xs">
            Saved to Wishlist
          </span>
        </motion.div>

        {/* Step 2: List */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#F5E7C6] rounded-2xl border-2 border-[#222222] p-4 space-y-2.5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-1 border-b border-[#E8DECA]">
            <span className="text-xs font-black text-[#222222]">📋 Weekend in Goa</span>
            <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-md border border-[#E8DECA]">
              Public
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-white text-[11px] font-bold text-[#222222] shadow-2xs">
              1. Blue Tokai Cafe
            </div>
            <div className="p-2 rounded-lg bg-white/70 text-[11px] font-semibold text-[#6B6862] border border-dashed border-[#E8DECA]">
              + Add another spot
            </div>
          </div>
        </motion.div>

        {/* Step 3: Outing */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#222222] text-white rounded-2xl p-5 text-center space-y-2 shadow-md"
        >
          <div className="text-3xl">🚀</div>
          <div className="font-sans text-sm font-black text-[#FAF3E1]">
            Ready for your trip
          </div>
          <p className="text-[10px] text-[#F5E7C6] font-medium leading-snug">
            All spots, offline-friendly maps, and collaborator notes in one place.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function CollabIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`rounded-3xl bg-[#F5E7C6] border border-[#E8DECA] p-6 shadow-sm space-y-4 ${className}`}>
      {/* Collaborators row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8DECA]">
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            <div className="h-9 w-9 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              YOU
            </div>
            <div className="h-9 w-9 rounded-full bg-[#FA8112] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              RIA
            </div>
            <div className="h-9 w-9 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              SAM
            </div>
          </div>
          <span className="text-xs font-bold text-[#222222]">3 Co-Planners</span>
        </div>

        <span className="inline-flex items-center gap-1 bg-white border border-[#E8DECA] px-3 py-1 rounded-xl text-xs font-black text-[#222222] shadow-2xs">
          + Invite @friend
        </span>
      </div>

      {/* Shared List Note Card */}
      <div className="bg-white rounded-2xl border border-[#E8DECA] p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-[#222222]">
            Arashiyama Bamboo Grove
          </div>
          <span className="text-[10px] font-bold text-[#FA8112] bg-[#FAF3E1] px-2 py-0.5 rounded-md">
            Must Visit
          </span>
        </div>
        <p className="text-[11px] text-[#6B6862] italic leading-relaxed">
          &ldquo;Ria: Let’s go early at 7 AM so we get the natural light before tourists arrive!&rdquo;
        </p>
      </div>
    </div>
  );
}
