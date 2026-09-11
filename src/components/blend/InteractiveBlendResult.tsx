'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/types/database';
import { ShareBlendButton } from './ShareBlendButton';
import {
  PinIcon,
  SparklesIcon,
  CompassIcon,
  ArrowRightIcon,
  RefreshIcon,
  CheckIcon,
  ExternalLinkIcon,
  PlusIcon,
} from '@/components/icons/Icons';

export interface SharedPlaceItem {
  name: string;
  destination?: string;
  category?: string;
}

export interface BlendSessionData {
  id: string;
  score: number;
  label: string;
  sharedPlaces: SharedPlaceItem[];
  sharedDestinations: string[];
  sharedCategories?: string[];
  userA: Profile;
  userB: Profile;
  createdAt?: string;
}

interface InteractiveBlendResultProps {
  blend: BlendSessionData;
}

export function InteractiveBlendResult({ blend }: InteractiveBlendResultProps) {
  const [activeTab, setActiveTab] = useState<'places' | 'destinations' | 'vibes'>('places');
  const [searchFilter, setSearchFilter] = useState('');

  const nameA = blend.userA.display_name || blend.userA.username || 'Traveler A';
  const nameB = blend.userB.display_name || blend.userB.username || 'Traveler B';
  const initialA = nameA.charAt(0).toUpperCase();
  const initialB = nameB.charAt(0).toUpperCase();

  // Color theme based on compatibility score
  const getTheme = (score: number) => {
    if (score >= 80) {
      return {
        accent: '#2E7D32',
        accentBg: '#E8F5E9',
        border: '#C8E6C9',
        tagBg: '#E8F5E9',
        badge: 'Twin Adventurers',
      };
    }
    if (score >= 60) {
      return {
        accent: '#FA8112',
        accentBg: '#FAF3E1',
        border: '#E8DECA',
        tagBg: '#F5E7C6',
        badge: 'High Vibe Synergy',
      };
    }
    if (score >= 40) {
      return {
        accent: '#E0533C',
        accentBg: '#FFEAE6',
        border: '#FFD3CC',
        tagBg: '#FFEAE6',
        badge: 'Curious Explorers',
      };
    }
    return {
      accent: '#6B6862',
      accentBg: '#F5F5F5',
      border: '#E5E5E5',
      tagBg: '#EEEEEE',
      badge: 'Opposite Worlds',
    };
  };

  const theme = getTheme(blend.score);

  // Filtered places
  const filteredPlaces = blend.sharedPlaces.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.destination && p.destination.toLowerCase().includes(q))
    );
  });

  const categories = blend.sharedCategories && blend.sharedCategories.length > 0
    ? blend.sharedCategories
    : ['Cafés & Coffee', 'Scenic Views', 'Hidden Gems', 'Historic Sights'];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#FAF3E1]">
      {/* 1. HERO MATCH CARD WITH FRAMER MOTION VENN DIAGRAM */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-white border border-[#E8DECA] p-6 sm:p-10 shadow-xs text-center space-y-7"
      >
        {/* Top Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-4 py-1 text-xs font-black text-[#222222]"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-[#FA8112]" />
          <span>Trackilio Travel Blend</span>
          <span className="text-[#6B6862]">•</span>
          <span className="text-[#FA8112]">{theme.badge}</span>
        </motion.div>

        {/* Interactive Venn Diagram Visualizer */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="relative flex items-center justify-center w-full max-w-md h-48 sm:h-56">
            {/* Circle A (User A) */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: -35, opacity: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FAF3E1] border-2 border-[#E8DECA] flex flex-col items-center justify-center p-3 shadow-inner z-10"
            >
              {blend.userA.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blend.userA.avatar_url}
                  alt={nameA}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mb-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#222222] text-white font-black text-base flex items-center justify-center shadow-xs mb-1">
                  {initialA}
                </div>
              )}
              <span className="font-sans text-xs font-black text-[#222222] truncate max-w-[90px]">
                {nameA}
              </span>
              <span className="text-[10px] text-[#6B6862] font-bold">
                {blend.userA.username ? `@${blend.userA.username}` : 'Traveler'}
              </span>
            </motion.div>

            {/* Overlap Lens / Match Score Center */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative z-30 flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#222222] text-white shadow-xl border-4 border-white"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-sans font-black text-3xl sm:text-4xl leading-none text-[#FA8112]"
              >
                {blend.score}%
              </motion.div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E2DAC8] mt-0.5">
                Match
              </span>
            </motion.div>

            {/* Circle B (User B) */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 35, opacity: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#F5E7C6] border-2 border-[#E8DECA] flex flex-col items-center justify-center p-3 shadow-inner z-10"
            >
              {blend.userB.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blend.userB.avatar_url}
                  alt={nameB}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mb-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#FA8112] text-white font-black text-base flex items-center justify-center shadow-xs mb-1">
                  {initialB}
                </div>
              )}
              <span className="font-sans text-xs font-black text-[#222222] truncate max-w-[90px]">
                {nameB}
              </span>
              <span className="text-[10px] text-[#6B6862] font-bold">
                {blend.userB.username ? `@${blend.userB.username}` : 'Traveler'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#222222]">
            &ldquo;{blend.label}&rdquo;
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
            <strong>{nameA}</strong> and <strong>{nameB}</strong> share a{' '}
            <strong>{blend.score}%</strong> taste similarity based on overlapping saved spots,
            itineraries, and favorite destinations.
          </p>
        </div>

        {/* Quick Summary Pill Stats */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] text-xs font-bold text-[#222222]">
            <PinIcon className="w-3.5 h-3.5 text-[#FA8112]" />
            <span>{blend.sharedPlaces.length} Shared Spots</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] text-xs font-bold text-[#222222]">
            <CompassIcon className="w-3.5 h-3.5 text-[#FA8112]" />
            <span>{blend.sharedDestinations.length} Common Cities</span>
          </span>
        </div>

        {/* Action Buttons: Share & New Blend */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <ShareBlendButton
            blendId={blend.id}
            score={blend.score}
            label={blend.label}
            nameA={nameA}
            nameB={nameB}
          />

          <Link
            href="/blend"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] text-[#222222] font-bold px-6 py-3 text-xs shadow-2xs active-press transition-colors cursor-pointer"
          >
            <RefreshIcon className="h-4 w-4 text-[#FA8112]" />
            <span>Start Another Blend</span>
          </Link>
        </div>
      </motion.section>

      {/* 2. INTERACTIVE OVERLAP EXPLORER WITH TABS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-3xl bg-white border border-[#E8DECA] p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DECA] pb-4">
          <div>
            <h2 className="font-sans text-xl font-black text-[#222222]">
              Overlap Breakdown
            </h2>
            <p className="text-xs text-[#6B6862]">
              Explore the exact spots, cities, and travel vibes you both love.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="inline-flex items-center gap-1 bg-[#FAF3E1] border border-[#E8DECA] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('places')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-[#222222] text-white shadow-xs'
                  : 'text-[#6B6862] hover:text-[#222222]'
              }`}
            >
              Places ({blend.sharedPlaces.length})
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'destinations'
                  ? 'bg-[#222222] text-white shadow-xs'
                  : 'text-[#6B6862] hover:text-[#222222]'
              }`}
            >
              Cities ({blend.sharedDestinations.length})
            </button>
            <button
              onClick={() => setActiveTab('vibes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vibes'
                  ? 'bg-[#222222] text-white shadow-xs'
                  : 'text-[#6B6862] hover:text-[#222222]'
              }`}
            >
              Vibes
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'places' && (
            <motion.div
              key="places-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {blend.sharedPlaces.length > 3 && (
                <input
                  type="text"
                  placeholder="Filter shared places by name or city..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-xl border border-[#E8DECA] bg-[#FAF3E1]/50 px-4 py-2 text-xs font-medium text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition-colors"
                />
              )}

              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredPlaces.map((place, i) => {
                    const mapQuery = `https://maps.google.com/?q=${encodeURIComponent(
                      place.name + (place.destination ? ` ${place.destination}` : '')
                    )}`;

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-2xl bg-[#FAF3E1]/70 border border-[#E8DECA] p-4 flex flex-col justify-between gap-3 hover:border-[#222222] hover:bg-white transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">📍</span>
                            <h4 className="font-sans text-sm font-extrabold text-[#222222] line-clamp-1">
                              {place.name}
                            </h4>
                          </div>

                          {place.destination && (
                            <p className="text-xs text-[#6B6862] font-semibold pl-5 truncate">
                              {place.destination}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#E8DECA]/50 text-xs">
                          <span className="text-[11px] font-bold text-[#FA8112]">
                            Both Saved
                          </span>

                          <a
                            href={mapQuery}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#222222] hover:text-[#FA8112] transition-colors"
                          >
                            <span>Open Map</span>
                            <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FAF3E1]/40 border border-[#E8DECA] p-8 text-center space-y-2">
                  <span className="text-3xl">☕</span>
                  <p className="text-xs font-bold text-[#222222]">
                    No overlapping places found yet
                  </p>
                  <p className="text-[11px] text-[#6B6862] max-w-sm mx-auto">
                    Save more places to your public lists to discover hidden mutual recommendations.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'destinations' && (
            <motion.div
              key="dests-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {blend.sharedDestinations.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {blend.sharedDestinations.map((dest, i) => (
                    <Link
                      key={i}
                      href={`/discover?city=${encodeURIComponent(dest)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] hover:border-[#222222] px-4 py-2 text-xs font-extrabold text-[#222222] transition-all hover:bg-white"
                    >
                      <PinIcon className="w-3.5 h-3.5 text-[#FA8112]" />
                      <span>{dest}</span>
                      <ArrowRightIcon className="w-3 h-3 text-[#6B6862]" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FAF3E1]/40 border border-[#E8DECA] p-8 text-center space-y-2">
                  <span className="text-3xl">✈️</span>
                  <p className="text-xs font-bold text-[#222222]">
                    No mutual cities yet
                  </p>
                  <p className="text-[11px] text-[#6B6862]">
                    Explore new itineraries on Discover to find common travel spots.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'vibes' && (
            <motion.div
              key="vibes-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat, i) => {
                  const matchVal = Math.min(98, Math.max(50, blend.score + (i * 7) % 25));
                  return (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#FAF3E1]/60 border border-[#E8DECA] p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#222222]">
                        <span>{cat}</span>
                        <span className="font-mono text-[#FA8112]">{matchVal}% Match</span>
                      </div>
                      <div className="w-full bg-[#E8DECA]/50 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${matchVal}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-[#222222] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 3. CO-PLANNING CTA: START A COLLABORATIVE LIST */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-3xl bg-[#222222] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FA8112]">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Ready for your next trip together?</span>
          </div>
          <h3 className="font-sans text-lg font-black text-white">
            Create a Shared Co-Op List with {nameB}
          </h3>
          <p className="text-xs text-[#E2DAC8] max-w-md">
            Start a collaborative travel list and invite each other to co-curate hidden cafes, restaurants, and itineraries.
          </p>
        </div>

        <Link
          href={`/create?collabWith=${encodeURIComponent(blend.userB.username || blend.userB.id)}`}
          className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-[#FA8112] hover:bg-[#E4720A] text-white font-extrabold px-6 py-3 text-xs shadow-md active-press transition-colors cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Shared List</span>
        </Link>
      </motion.section>

      {/* 4. TRAVELER PROFILES */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link
          href={`/u/${blend.userA.username || blend.userA.id}`}
          className="group rounded-2xl bg-white border border-[#E8DECA] p-5 hover:border-[#222222] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {blend.userA.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blend.userA.avatar_url}
                alt={nameA}
                className="w-10 h-10 rounded-xl object-cover border border-[#E8DECA]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#222222] text-white font-black flex items-center justify-center">
                {initialA}
              </div>
            )}
            <div>
              <h4 className="font-sans text-xs font-black text-[#222222] group-hover:text-[#FA8112] transition-colors">
                {nameA}
              </h4>
              <p className="text-[11px] text-[#6B6862] font-semibold">
                @{blend.userA.username || 'traveler'}
              </p>
            </div>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-[#6B6862] group-hover:translate-x-1 group-hover:text-[#222222] transition-all" />
        </Link>

        <Link
          href={`/u/${blend.userB.username || blend.userB.id}`}
          className="group rounded-2xl bg-white border border-[#E8DECA] p-5 hover:border-[#222222] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {blend.userB.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blend.userB.avatar_url}
                alt={nameB}
                className="w-10 h-10 rounded-xl object-cover border border-[#E8DECA]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#FA8112] text-white font-black flex items-center justify-center">
                {initialB}
              </div>
            )}
            <div>
              <h4 className="font-sans text-xs font-black text-[#222222] group-hover:text-[#FA8112] transition-colors">
                {nameB}
              </h4>
              <p className="text-[11px] text-[#6B6862] font-semibold">
                @{blend.userB.username || 'traveler'}
              </p>
            </div>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-[#6B6862] group-hover:translate-x-1 group-hover:text-[#222222] transition-all" />
        </Link>
      </motion.section>
    </div>
  );
}
