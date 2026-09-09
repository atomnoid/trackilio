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
import { SavedPlace, WanderList, BlendSession, Profile, DailyFact } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { BlendHistoryCard } from '@/components/blend/BlendHistoryCard';
import { FunFactWidget } from '@/components/daily-fact/DailyFactCard';

interface InteractiveDashboardProps {
  userDisplayName: string;
  initialLists: WanderList[];
  initialCollabLists?: WanderList[];
  initialSavedLists?: WanderList[];
  initialSavedPlaces?: SavedPlace[];
  initialBlendSessions?: Array<BlendSession & { otherUser?: Profile }>;
  initialDailyFact?: DailyFact | null;
  userId: string;
}

const TEMPLATE_SUGGESTIONS = [
  { title: '7 Days in Kyoto: Cafes & Shrines', dest: 'Kyoto, Japan', emoji: '⛩️' },
  { title: 'Paris Pastry & Wine Tour', dest: 'Paris, France', emoji: '🥐' },
  { title: 'Kolkata Heritage Cafes & Street Art', dest: 'Kolkata, India', emoji: '☕' },
  { title: 'Amalfi Coast Sunset Spots', dest: 'Amalfi, Italy', emoji: '🍋' },
];

export function InteractiveDashboard({
  userDisplayName,
  initialLists,
  initialCollabLists = [],
  initialSavedLists = [],
  initialSavedPlaces = [],
  initialBlendSessions = [],
  initialDailyFact,
  userId,
}: InteractiveDashboardProps) {
  const router = useRouter();
  const [lists, setLists] = useState<WanderList[]>(initialLists);
  const [collabLists, setCollabLists] = useState<WanderList[]>(initialCollabLists);
  const [savedLists, setSavedLists] = useState<WanderList[]>(initialSavedLists);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialSavedPlaces);
  const [blendSessions, setBlendSessions] = useState<Array<BlendSession & { otherUser?: Profile }>>(
    initialBlendSessions
  );

  const [activeTab, setActiveTab] = useState<
    'my-lists' | 'collaborated' | 'saved-lists' | 'blends' | 'saved-places' | 'public' | 'private'
  >('my-lists');

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

  const publicCount = lists.filter((l) => l.is_public).length;
  const privateCount = lists.filter((l) => !l.is_public).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Modern Flat Design Hero Banner (White, Sunset Orange, Red-Violet) */}
      <div className="relative rounded-3xl overflow-hidden border border-[#EFE9EC] bg-white p-6 sm:p-10 shadow-xs">
        {/* Soft Ambient Radial Tints */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#FF5841]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#C53678]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3.5 py-1 text-xs font-black text-[#FF5841] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Modern Travel Workspace</span>
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-black text-[#1A1723] tracking-tight">
              Welcome back, {userDisplayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium leading-relaxed">
              Create itineraries, co-build collaborated travel lists with friends, and discover shared Travel Blends.
            </p>
          </div>

          {/* Hero Main CTAs — Collaborated Lists & Create */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('collaborated')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black shadow-xs active-press transition-all ${
                activeTab === 'collaborated'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white'
                  : 'bg-[#FFEAE6] hover:bg-[#FFDCD6] border border-[#FFD3CC] text-[#FF5841]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Collaborated Lists ({collabLists.length})</span>
            </button>

            <Link
              href="/blend"
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#EFE9EC] hover:border-[#FF5841] text-[#C53678] px-4.5 py-3 text-xs font-bold shadow-2xs active-press transition-all"
            >
              <Sparkles className="h-4 w-4 text-[#FF5841]" />
              <span>Blend Taste</span>
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 text-white px-5 py-3 text-xs font-black shadow-xs active-press transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New List</span>
            </Link>
          </div>
        </div>

        {/* 1-Click Instant List Creator */}
        <div className="relative z-10 pt-6 mt-6 border-t border-[#EFE9EC]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuickCreate();
            }}
            className="flex flex-col sm:flex-row gap-2.5 bg-[#FAFAFC] p-2 rounded-2xl border border-[#EFE9EC] shadow-2xs"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-3 h-4.5 w-4.5 text-[#FF5841]" />
              <input
                type="text"
                placeholder="Where to next? Enter trip name (e.g. 5 Days in Kyoto or Amalfi Coast Getaway)..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-[#1A1723] placeholder-[#7E7890] focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !quickTitle.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white font-black px-5 py-2.5 text-xs shadow-2xs disabled:opacity-50 active-press transition-all shrink-0"
            >
              {isCreating ? 'Creating…' : 'Quick Create'}
            </button>
          </form>

          {createdSuccess && (
            <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 mt-2 inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {createdSuccess}
            </p>
          )}

          {/* Inspiration Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-[11px] font-bold text-[#7E7890]">Quick Ideas:</span>
            {TEMPLATE_SUGGESTIONS.map((sug) => (
              <button
                key={sug.title}
                type="button"
                onClick={() => handleQuickCreate(sug.title, sug.dest)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#EFE9EC] hover:border-[#FF5841] text-[11px] font-medium text-[#4F4B5E] active-press transition-all"
              >
                <span>{sug.emoji}</span>
                <span>{sug.title.split(':')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Fun Fact Banner on Dashboard */}
      {initialDailyFact && (
        <div className="w-full">
          <FunFactWidget initialFact={initialDailyFact} variant="dashboard" />
        </div>
      )}

      {/* Main Section Header with Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EFE9EC]">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-[#1A1723]">
              {activeTab === 'collaborated'
                ? 'Collaborated Travel Lists'
                : activeTab === 'saved-lists'
                ? 'Saved / Bookmarked Lists'
                : activeTab === 'blends'
                ? 'Saved Blend Matches'
                : activeTab === 'saved-places'
                ? 'Saved Places Bucket'
                : 'My Created Lists'}
            </h2>
          </div>

          {/* Modern Flat Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#EFE9EC] shadow-2xs">
            <button
              onClick={() => setActiveTab('my-lists')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'my-lists'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              My Lists ({lists.length})
            </button>

            {/* Collaborated Tab — Strictly only lists with collaborators */}
            <button
              onClick={() => setActiveTab('collaborated')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'collaborated'
                  ? 'bg-[#FF5841] text-white shadow-2xs'
                  : 'text-[#FF5841] bg-[#FFF5F3] hover:bg-[#FFEAE6]'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Collaborated ({collabLists.length})</span>
            </button>

            {/* Saved Lists Tab */}
            <button
              onClick={() => setActiveTab('saved-lists')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'saved-lists'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved Lists ({savedLists.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blends')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'blends'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF5841]" />
              <span>Blends ({blendSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('public')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'public'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              Public ({publicCount})
            </button>

            <button
              onClick={() => setActiveTab('private')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'private'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              Private ({privateCount})
            </button>

            <button
              onClick={() => setActiveTab('saved-places')}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'saved-places'
                  ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-2xs'
                  : 'text-[#4F4B5E] hover:text-[#1A1723] hover:bg-[#F6F4F8]'
              }`}
            >
              <span>Saved Places ({savedPlaces.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Collaborated Lists — Strictly lists with active collaboration */}
        {activeTab === 'collaborated' && (
          <div className="space-y-6">
            {collabLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {collabLists.map((list) => (
                  <WanderListCard key={list.id} list={list} showCollabBadge />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#EFE9EC] bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center shadow-2xs">
                  <Users className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#1A1723]">
                    No collaborated lists yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium max-w-md mx-auto">
                    Collaborate with friends on group trips! Open any of your lists and click &quot;+ Add Collaborator&quot; at the top to invite friends by @username.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-5 py-2.5 text-xs font-black shadow-xs active-press"
                  >
                    <Plus className="h-4 w-4" /> Create a List to Collaborate
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Saved / Bookmarked Lists */}
        {activeTab === 'saved-lists' && (
          <div className="space-y-6">
            {savedLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {savedLists.map((list) => (
                  <WanderListCard key={list.id} list={list} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#EFE9EC] bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#F9E2EE] text-[#C53678] flex items-center justify-center shadow-2xs">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#1A1723]">
                    No saved lists yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium max-w-md mx-auto">
                    When you discover great guides on Trackilio, click the &quot;Save List&quot; button to bookmark them here for easy access anytime.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-5 py-2.5 text-xs font-black shadow-xs active-press"
                  >
                    <Compass className="h-4 w-4" /> Discover Public Lists
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Blend Matches */}
        {activeTab === 'blends' && (
          <div className="space-y-6">
            {blendSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {blendSessions.map((blend) => (
                  <BlendHistoryCard key={blend.id} blend={blend} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#EFE9EC] bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center shadow-2xs">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#1A1723]">
                    No Blend matches yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium max-w-md mx-auto">
                    Enter any @username to calculate your Travel Taste match. Your results will automatically be saved here for both of you!
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/blend"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-5 py-2.5 text-xs font-black shadow-xs active-press"
                  >
                    <Sparkles className="h-4 w-4" /> Start a Blend Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 4: Saved Places */}
        {activeTab === 'saved-places' && (
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
              <div className="rounded-3xl border border-[#EFE9EC] bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#F6F4F8] text-[#7E7890] flex items-center justify-center shadow-2xs">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#1A1723]">
                    No saved places yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium max-w-md mx-auto">
                    Bookmark interesting cafes, viewpoints, and hotels as you discover them across Trackilio.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-5 py-2.5 text-xs font-black shadow-xs active-press"
                  >
                    <Compass className="h-4 w-4" /> Discover Places
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 5: My Lists, Public, or Private */}
        {activeTab !== 'collaborated' &&
          activeTab !== 'saved-lists' &&
          activeTab !== 'blends' &&
          activeTab !== 'saved-places' && (
            <div className="space-y-6">
              {(activeTab === 'public'
                ? lists.filter((l) => l.is_public)
                : activeTab === 'private'
                ? lists.filter((l) => !l.is_public)
                : lists
              ).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {(activeTab === 'public'
                    ? lists.filter((l) => l.is_public)
                    : activeTab === 'private'
                    ? lists.filter((l) => !l.is_public)
                    : lists
                  ).map((list) => (
                    <WanderListCard key={list.id} list={list} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-[#EFE9EC] bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center shadow-2xs">
                    <Compass className="h-7 w-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-sans text-base sm:text-lg font-bold text-[#1A1723]">
                      No lists in this section
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4F4B5E] font-medium max-w-md mx-auto">
                      Start building a curated itinerary to organize your favorite places.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-5 py-2.5 text-xs font-black shadow-xs active-press"
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
