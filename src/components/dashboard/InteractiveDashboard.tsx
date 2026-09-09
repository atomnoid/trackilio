'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Compass,
  Globe,
  Lock,
  Sparkles,
  MapPin,
  Bookmark,
  Users,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  UserPlus,
  Share2,
} from 'lucide-react';
import { SavedPlace, WanderList, BlendSession, Profile } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { BlendHistoryCard } from '@/components/blend/BlendHistoryCard';

interface InteractiveDashboardProps {
  userDisplayName: string;
  initialLists: WanderList[];
  initialCollabLists?: WanderList[];
  initialSavedPlaces?: SavedPlace[];
  initialBlendSessions?: Array<BlendSession & { otherUser?: Profile }>;
  userId: string;
}

const TEMPLATE_SUGGESTIONS = [
  { title: '7 Days in Kyoto: Cafes & Bamboo Groves', dest: 'Kyoto, Japan', emoji: '⛩️' },
  { title: 'Paris Pastry & Natural Wine Tour', dest: 'Paris, France', emoji: '🥐' },
  { title: 'Kolkata Heritage Coffee & Bookshops', dest: 'Kolkata, India', emoji: '☕' },
  { title: 'Amalfi Coast Sunset & Cliffside Dining', dest: 'Amalfi, Italy', emoji: '🍋' },
];

export function InteractiveDashboard({
  userDisplayName,
  initialLists,
  initialCollabLists = [],
  initialSavedPlaces = [],
  initialBlendSessions = [],
  userId,
}: InteractiveDashboardProps) {
  const router = useRouter();
  const [lists, setLists] = useState<WanderList[]>(initialLists);
  const [collabLists, setCollabLists] = useState<WanderList[]>(initialCollabLists);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialSavedPlaces);
  const [blendSessions, setBlendSessions] = useState<Array<BlendSession & { otherUser?: Profile }>>(
    initialBlendSessions
  );

  const [activeTab, setActiveTab] = useState<'all' | 'collaborated' | 'blends' | 'public' | 'private' | 'saved'>(
    'all'
  );
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
        setCreatedSuccess(`Created: "${finalTitle}"!`);
        setTimeout(() => setCreatedSuccess(null), 3000);
        router.push(`/l/${data.slug}`);
      } else {
        router.push(`/create?title=${encodeURIComponent(finalTitle)}`);
      }
    } catch {
      setIsCreating(false);
      router.push(`/create?title=${encodeURIComponent(finalTitle)}`);
    }
  };

  // Filter logic
  const filteredLists = () => {
    if (activeTab === 'collaborated') return collabLists;
    if (activeTab === 'public') return lists.filter((l) => l.is_public);
    if (activeTab === 'private') return lists.filter((l) => !l.is_public);
    return lists;
  };

  const currentDisplayLists = filteredLists();
  const publicCount = lists.filter((l) => l.is_public).length;
  const privateCount = lists.filter((l) => !l.is_public).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Serene Pastel Purple & Light Steel Blue Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E7E0EE] bg-gradient-to-br from-[#F6F1F6] via-[#FAF9FC] to-[#F1F3FB] p-6 sm:p-10 shadow-xs">
        {/* Soft Ambient Radial Accents */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#C5ADC5]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#B2B5E0]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[#E7E0EE] px-3.5 py-1 text-xs font-bold text-[#6469AC] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#8E6D8E]" />
              <span>Mindful Travel Hub</span>
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-black text-[#2A2735] tracking-tight">
              Welcome back, {userDisplayName} ✨
            </h1>
            <p className="text-xs sm:text-sm text-[#595567] font-medium leading-relaxed">
              Create, collaborate on shared itineraries with friends, and compare travel tastes seamlessly.
            </p>
          </div>

          {/* Main Hero CTAs — Collaborated Lists as Primary CTA */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('collaborated')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black shadow-xs active-press transition-all ${
                activeTab === 'collaborated'
                  ? 'bg-[#6469AC] text-white'
                  : 'bg-white/90 border border-[#B2B5E0] text-[#6469AC] hover:bg-[#F1F3FB]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Collaborated Lists ({collabLists.length})</span>
            </button>

            <Link
              href="/blend"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/90 border border-[#E7E0EE] hover:border-[#C5ADC5] text-[#8E6D8E] px-4.5 py-3 text-xs font-bold shadow-2xs active-press transition-all"
            >
              <Sparkles className="h-4 w-4 text-[#C5ADC5]" />
              <span>Blend Taste</span>
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] hover:opacity-95 text-white px-5 py-3 text-xs font-extrabold shadow-xs active-press transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New List</span>
            </Link>
          </div>
        </div>

        {/* Serene 1-Click Instant List Creation Input */}
        <div className="relative z-10 pt-6 mt-6 border-t border-[#E7E0EE]/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuickCreate();
            }}
            className="flex flex-col sm:flex-row gap-2.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#E7E0EE] shadow-2xs"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-3 h-4.5 w-4.5 text-[#8E6D8E]" />
              <input
                type="text"
                placeholder="Where to next? Enter trip name (e.g. 5 Days in Kyoto or Amalfi Coast Escapes)..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-[#2A2735] placeholder-[#847F95] focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !quickTitle.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs disabled:opacity-50 active-press transition-all shrink-0"
            >
              {isCreating ? 'Creating…' : 'Quick Create'}
            </button>
          </form>

          {createdSuccess && (
            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 mt-2 inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {createdSuccess}
            </p>
          )}

          {/* Instant Inspiration Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-[11px] font-bold text-[#847F95]">Inspirations:</span>
            {TEMPLATE_SUGGESTIONS.map((sug) => (
              <button
                key={sug.title}
                type="button"
                onClick={() => handleQuickCreate(sug.title, sug.dest)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 border border-[#E7E0EE] hover:border-[#C5ADC5] hover:bg-white text-[11px] font-medium text-[#595567] active-press transition-all"
              >
                <span>{sug.emoji}</span>
                <span>{sug.title.split(':')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section Header with Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E7E0EE]">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-[#2A2735]">
              {activeTab === 'collaborated'
                ? 'Collaborated Travel Lists'
                : activeTab === 'blends'
                ? 'Saved Blend Matches'
                : activeTab === 'saved'
                ? 'Saved Places Bucket'
                : 'My Travel Lists'}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/90 border border-[#E7E0EE] shadow-2xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white shadow-2xs'
                  : 'text-[#595567] hover:text-[#2A2735] hover:bg-[#F6F1F6]'
              }`}
            >
              All Lists ({lists.length})
            </button>

            <button
              onClick={() => setActiveTab('collaborated')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'collaborated'
                  ? 'bg-[#6469AC] text-white shadow-2xs'
                  : 'text-[#6469AC] hover:bg-[#F1F3FB]'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Collaborated ({collabLists.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blends')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'blends'
                  ? 'bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white shadow-2xs'
                  : 'text-[#595567] hover:text-[#2A2735] hover:bg-[#F6F1F6]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C5ADC5]" />
              <span>Blends ({blendSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('public')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'public'
                  ? 'bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white shadow-2xs'
                  : 'text-[#595567] hover:text-[#2A2735] hover:bg-[#F6F1F6]'
              }`}
            >
              Public ({publicCount})
            </button>

            <button
              onClick={() => setActiveTab('private')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'private'
                  ? 'bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white shadow-2xs'
                  : 'text-[#595567] hover:text-[#2A2735] hover:bg-[#F6F1F6]'
              }`}
            >
              Private ({privateCount})
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white shadow-2xs'
                  : 'text-[#595567] hover:text-[#2A2735] hover:bg-[#F6F1F6]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved Places ({savedPlaces.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Collaborated Lists */}
        {activeTab === 'collaborated' && (
          <div className="space-y-6">
            {collabLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {collabLists.map((list) => (
                  <WanderListCard key={list.id} list={list} showCollabBadge />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E7E0EE] bg-white/90 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[#F6F1F6] to-[#F1F3FB] border border-[#E7E0EE] text-[#6469AC] flex items-center justify-center shadow-2xs">
                  <Users className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-lg font-bold text-[#2A2735]">
                    No collaborated lists yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595567] font-medium max-w-md mx-auto">
                    Collaborate with friends on shared travel plans! Open any of your lists and invite friends by their @username to edit or view.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-5 py-2.5 text-xs font-bold shadow-xs active-press"
                  >
                    <Plus className="h-4 w-4" /> Create a List to Collaborate
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Blend Matches */}
        {activeTab === 'blends' && (
          <div className="space-y-6">
            {blendSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {blendSessions.map((blend) => (
                  <BlendHistoryCard key={blend.id} blend={blend} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E7E0EE] bg-white/90 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[#C5ADC5]/30 to-[#B2B5E0]/30 border border-[#E7E0EE] text-[#6469AC] flex items-center justify-center shadow-2xs">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-lg font-bold text-[#2A2735]">
                    No Blend matches yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595567] font-medium max-w-md mx-auto">
                    Enter any @username to calculate your Travel Taste match score. Your results will automatically be saved here for both of you!
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/blend"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-5 py-2.5 text-xs font-bold shadow-xs active-press"
                  >
                    <Sparkles className="h-4 w-4" /> Start a Blend Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Saved Places */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {savedPlaces.map((sp) =>
                  sp.place ? (
                    <PlaceDiscoveryCard key={sp.id} place={sp.place} initialSaved={true} />
                  ) : null
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E7E0EE] bg-white/90 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#F6F1F6] border border-[#E7E0EE] text-[#8E6D8E] flex items-center justify-center shadow-2xs">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-lg font-bold text-[#2A2735]">
                    No saved places yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595567] font-medium max-w-md mx-auto">
                    Bookmark interesting cafes, landmarks, and hotels as you discover them across Trackilio.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-5 py-2.5 text-xs font-bold shadow-xs active-press"
                  >
                    <Compass className="h-4 w-4" /> Discover Places
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 4: All, Public, or Private Lists */}
        {activeTab !== 'collaborated' && activeTab !== 'blends' && activeTab !== 'saved' && (
          <div className="space-y-6">
            {currentDisplayLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {currentDisplayLists.map((list) => (
                  <WanderListCard key={list.id} list={list} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E7E0EE] bg-white/90 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#F6F1F6] border border-[#E7E0EE] text-[#8E6D8E] flex items-center justify-center shadow-2xs">
                  <Compass className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-lg font-bold text-[#2A2735]">
                    No lists in this section
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595567] font-medium max-w-md mx-auto">
                    Start crafting a new travel guide or itinerary to organize your dream spots.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-5 py-2.5 text-xs font-bold shadow-xs active-press"
                  >
                    <Plus className="h-4 w-4" /> Create Your First List
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
