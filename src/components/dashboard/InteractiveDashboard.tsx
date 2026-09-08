'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { Plus, Compass, Globe, Lock, Sparkles, MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InteractiveDashboardProps {
  userDisplayName: string;
  initialLists: WanderList[];
  userId: string;
}

const TEMPLATE_SUGGESTIONS = [
  { title: '7 Days in Kyoto: Cafes & Bamboo Groves', dest: 'Kyoto, Japan', emoji: '⛩️' },
  { title: 'Paris Pastry & Natural Wine Bar Tour', dest: 'Paris, France', emoji: '🥐' },
  { title: 'Best Hidden Heritage Cafes of Kolkata', dest: 'Kolkata, India', emoji: '☕' },
  { title: 'Bali Waterfall & Sunset Bucket List', dest: 'Bali, Indonesia', emoji: '🌴' },
];

export function InteractiveDashboard({
  userDisplayName,
  initialLists,
  userId,
}: InteractiveDashboardProps) {
  const router = useRouter();
  const [lists, setLists] = useState<WanderList[]>(initialLists);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState<string | null>(null);

  // Quick 1-Click Instant List Creation
  const handleQuickCreate = async (titleToCreate?: string, destToCreate?: string) => {
    const finalTitle = titleToCreate || quickTitle;
    if (!finalTitle.trim()) return;

    setIsCreating(true);

    try {
      const res = await fetch('/api/lists/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle.trim(),
          destination: destToCreate || '',
          userId,
        }),
      });

      const data = await res.json();
      setIsCreating(false);

      if (res.ok && data.slug) {
        setCreatedSuccess(`List created: "${finalTitle}"!`);
        setTimeout(() => setCreatedSuccess(null), 3000);
        router.push(`/l/${data.slug}`);
      } else {
        // Fallback navigation to /create with prefilled title
        router.push(`/create?title=${encodeURIComponent(finalTitle)}`);
      }
    } catch {
      setIsCreating(false);
      router.push(`/create?title=${encodeURIComponent(finalTitle)}`);
    }
  };

  const filteredLists = lists.filter((l) => {
    if (filter === 'public') return l.is_public;
    if (filter === 'private') return !l.is_public;
    return true;
  });

  const publicCount = lists.filter((l) => l.is_public).length;
  const privateCount = lists.filter((l) => !l.is_public).length;

  return (
    <div className="space-y-10">
      {/* Interactive Welcome Hero Banner */}
      <div className="rounded-3xl bg-[#2C2A29] text-white p-6 sm:p-10 space-y-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" /> Easy-as-Air Workspace
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-black text-white">
              Welcome back, {userDisplayName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#9E968F] font-medium max-w-lg">
              Where are you traveling next? Create a list instantly or pick a 1-click template below.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white px-5 py-3 text-xs font-bold shadow-2xs active-press transition-all shrink-0 self-start md:self-auto"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Full List Creator
          </Link>
        </div>

        {/* Instant 1-Click Creation Input */}
        <div className="relative z-10 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuickCreate();
            }}
            className="flex flex-col sm:flex-row gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-3 h-4.5 w-4.5 text-amber-300" />
              <input
                type="text"
                placeholder="Enter trip name or destination (e.g. 7 Days in Amalfi Coast)..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !quickTitle.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs disabled:opacity-50 active-press transition-all shrink-0"
            >
              <Zap className="h-4 w-4" />
              {isCreating ? 'Creating...' : 'Instant Create'}
            </button>
          </form>
        </div>

        {/* Success Alert */}
        {createdSuccess && (
          <div className="relative z-10 flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-xl text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" /> {createdSuccess}
          </div>
        )}

        {/* 1-Click Quick Template Starter Chips */}
        <div className="relative z-10 space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#9E968F] uppercase tracking-wider block">
            ⚡ Quick-Start Templates (Click to create)
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TEMPLATE_SUGGESTIONS.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => handleQuickCreate(tpl.title, tpl.dest)}
                className="whitespace-nowrap rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 transition-all active-press"
              >
                <span>{tpl.emoji}</span>
                <span>{tpl.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 shadow-2xs space-y-1 cozy-card">
          <span className="text-[11px] font-extrabold text-[#78726D] uppercase tracking-wider">
            Total Lists
          </span>
          <p className="text-3xl font-black font-sans text-[#2C2A29]">{lists.length}</p>
        </div>

        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 shadow-2xs space-y-1 cozy-card">
          <span className="text-[11px] font-extrabold text-[#4A6B5D] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[#4A6B5D]" /> Public Guides
          </span>
          <p className="text-3xl font-black font-sans text-[#2C2A29]">{publicCount}</p>
        </div>

        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 shadow-2xs space-y-1 cozy-card">
          <span className="text-[11px] font-extrabold text-[#78726D] uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#78726D]" /> Private Lists
          </span>
          <p className="text-3xl font-black font-sans text-[#2C2A29]">{privateCount}</p>
        </div>
      </div>

      {/* Lists Controls & Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-3">
          <h2 className="font-sans text-2xl font-black text-[#2C2A29]">
            My Lists ({filteredLists.length})
          </h2>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F3ECE1] p-1 rounded-xl border border-[#E6DFD5]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-[#2C2A29] shadow-2xs'
                  : 'text-[#78726D] hover:text-[#2C2A29]'
              }`}
            >
              All ({lists.length})
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'public'
                  ? 'bg-white text-[#4A6B5D] shadow-2xs'
                  : 'text-[#78726D] hover:text-[#2C2A29]'
              }`}
            >
              Public ({publicCount})
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'private'
                  ? 'bg-white text-[#2C2A29] shadow-2xs'
                  : 'text-[#78726D] hover:text-[#2C2A29]'
              }`}
            >
              Private ({privateCount})
            </button>
          </div>
        </div>

        {/* Lists Grid */}
        {filteredLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#E6DFD5] p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-[#F3ECE1] text-[#2C2A29] flex items-center justify-center mx-auto">
              <Compass className="h-7 w-7 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-xl font-bold text-[#2C2A29]">
                No lists found in this filter
              </h3>
              <p className="text-[#78726D] text-xs font-medium">
                Create a new list or pick a quick template above to start collecting places.
              </p>
            </div>
            <button
              onClick={() => handleQuickCreate('My Next Adventure')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs hover:bg-[#3B594B] active-press transition-colors"
            >
              <Zap className="h-4 w-4" /> Instant Create List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
