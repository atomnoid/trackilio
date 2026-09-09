'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CompassIcon,
  SparklesIcon,
  PinIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  ShuffleIcon,
  MessageSquareIcon,
  FlameIcon,
} from '@/components/icons/Icons';

export function InteractiveAbout() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [interactiveTasteA, setInteractiveTasteA] = useState<string>('Cafes & Vintage Boutiques');
  const [interactiveTasteB, setInteractiveTasteB] = useState<string>('Scenic Mountain Treks');
  const [blendScore, setBlendScore] = useState<number>(84);
  const [interactivePlaces, setInteractivePlaces] = useState([
    { name: 'Kamo Riverbank Sunset', cat: 'Viewpoint', note: 'Bring iced matcha tea and watch the ducks by Sanjo Bridge', visited: true },
    { name: 'Weekenders Coffee Roastery', cat: 'Cafe', note: 'Tucked inside a quiet car park alley', visited: false },
    { name: 'Pontocho Alley Riverside Dining', cat: 'Dining', note: 'Book wooden lantern riverside seating', visited: false },
  ]);

  const steps = [
    {
      id: 0,
      title: '1. Curate & Collect Places',
      subtitle: 'Never lose a travel spot in messy group chats again',
      emoji: '📍',
      actionLabel: 'Create a List',
      actionHref: '/create',
      description:
        'Save cafes, viewpoints, bakeries, and secret spots with custom priority tags (Must Visit vs. Want to Visit vs. Maybe), status tracking (Saved, Planned, Visited), and direct Google Maps pins.',
      badge: 'Step 1: Curation',
    },
    {
      id: 1,
      title: '2. Real-Time Squad Collaboration',
      subtitle: 'Invite friends by @username with instant co-editor access',
      emoji: '🤝',
      actionLabel: 'Collaborate with Friends',
      actionHref: '/create',
      description:
        'Add travel buddies as co-editors or viewers. Upvote favorite spots together, leave spot notes, and coordinate your itinerary seamlessly without duplicate spreadsheets.',
      badge: 'Step 2: Collaboration',
    },
    {
      id: 2,
      title: '3. Match Vibes with Travel Blend',
      subtitle: 'Calculate your travel compatibility score with any friend',
      emoji: '✨',
      actionLabel: 'Try Travel Blend',
      actionHref: '/blend',
      description:
        'Wondering if you and your travel partner travel well together? Enter any two @usernames to calculate your shared taste overlap, common bucket list spots, and compatibility score.',
      badge: 'Step 3: Algorithm',
    },
    {
      id: 3,
      title: '4. Publish & Share with the World',
      subtitle: 'Fast, responsive standalone links ready for social sharing',
      emoji: '🌐',
      actionLabel: 'Discover Public Lists',
      actionHref: '/discover',
      description:
        'Every public list generates a clean, indexable URL with OpenGraph previews. Share your local guides with followers on Instagram, Twitter/X, and group chats with zero friction.',
      badge: 'Step 4: Social Sharing',
    },
  ];

  const handleToggleVisited = (index: number) => {
    setInteractivePlaces((prev) =>
      prev.map((p, i) => (i === index ? { ...p, visited: !p.visited } : p))
    );
  };

  const handleShuffleBlend = () => {
    const tastes = [
      'Artisan Bakeries & Natural Wine',
      'Mountain Hikes & Wild Swimming',
      'Vintage Thrift & Record Stores',
      'Street Food Night Markets',
      'Art Museums & Historic Architecture',
      'Sunset Rooftops & Secret Speakeasies',
    ];
    const pickA = tastes[Math.floor(Math.random() * tastes.length)];
    let pickB = tastes[Math.floor(Math.random() * tastes.length)];
    while (pickB === pickA) {
      pickB = tastes[Math.floor(Math.random() * tastes.length)];
    }
    setInteractiveTasteA(pickA);
    setInteractiveTasteB(pickB);
    setBlendScore(Math.floor(Math.random() * 20) + 80);
  };

  return (
    <div className="space-y-20 sm:space-y-28 py-6 bg-[#FAF3E1]">
      {/* 1. Header Section */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-4 py-1.5 text-xs font-bold text-[#222222] shadow-2xs"
        >
          <SparklesIcon className="h-3.5 w-3.5 text-[#FA8112]" />
          The Story & Mechanics of Trackilio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-sans text-4xl sm:text-6xl font-black text-[#222222] tracking-tight leading-[1.08]"
        >
          Travel lists designed for{' '}
          <span className="text-[#FA8112]">
            real exploration.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-[#6B6862] max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Trackilio replaces cluttered notes, chaotic group chats, and generic tourist listicles with collaborative itineraries, community discovery, and intelligent Travel Taste Blends.
        </motion.p>

        {/* Action quick buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] text-white px-7 py-3.5 text-xs font-extrabold shadow-xs active-press transition-colors"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Create Your First List</span>
          </Link>

          <Link
            href="/blend"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] text-[#222222] px-6 py-3.5 text-xs font-bold active-press transition-colors"
          >
            <SparklesIcon className="h-4 w-4 text-[#FA8112]" />
            <span>Try Travel Blend</span>
          </Link>
        </motion.div>
      </section>

      {/* 2. Interactive Step-by-Step Simulator */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
            Interactive Showcase
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-black text-[#222222]">
            How Trackilio Works Under the Hood
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-xl mx-auto font-medium">
            Click through the steps below to experience how Trackilio simplifies trip planning.
          </p>
        </div>

        {/* Navigation Step Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active-press cursor-pointer ${
                activeStep === idx
                  ? 'bg-white border-[#222222] shadow-sm ring-2 ring-[#FA8112]/30 scale-[1.02]'
                  : 'bg-[#F5E7C6]/70 border-[#E8DECA] hover:border-[#222222] hover:bg-white text-[#6B6862]'
              }`}
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] flex items-center justify-center text-xl shadow-2xs">
                {s.emoji}
              </div>
              <div className="truncate">
                <div className={`text-xs font-black ${activeStep === idx ? 'text-[#FA8112]' : 'text-[#222222]'}`}>
                  Step 0{idx + 1}
                </div>
                <div className="text-[11px] text-[#6B6862] truncate font-medium">{s.title.split('. ')[1]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Step Card */}
        <div className="bg-white rounded-3xl border border-[#E8DECA] p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Explanation Column */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5E7C6] text-[#222222] border border-[#E8DECA]">
                {steps[activeStep].emoji} {steps[activeStep].badge}
              </span>

              <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#222222] leading-tight">
                {steps[activeStep].title.split('. ')[1]}
              </h3>

              <p className="text-sm font-bold text-[#FA8112]">
                {steps[activeStep].subtitle}
              </p>

              <p className="text-sm text-[#6B6862] leading-relaxed font-normal">
                {steps[activeStep].description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={steps[activeStep].actionHref}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] text-white text-xs font-extrabold shadow-xs transition-colors active-press"
                >
                  <span>{steps[activeStep].actionLabel}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>

                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF3E1] hover:bg-[#F5E7C6] text-[#222222] border border-[#E8DECA] text-xs font-bold transition-colors active-press cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRightIcon className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-2xl border border-[#E8DECA] bg-[#FAF3E1] p-5 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#222222]">🎌 7 Days in Kyoto</span>
                        <span className="text-[10px] bg-[#F5E7C6] text-[#222222] font-bold px-2 py-0.5 rounded-full border border-[#E8DECA]">
                          Interactive Demo
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B6862] font-medium">Click to toggle visited</span>
                    </div>

                    <div className="space-y-2.5">
                      {interactivePlaces.map((place, i) => (
                        <div
                          key={place.name}
                          onClick={() => handleToggleVisited(i)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            place.visited
                              ? 'bg-[#F5E7C6] border-[#222222]'
                              : 'bg-white border-[#E8DECA] hover:border-[#FA8112]'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${place.visited ? 'line-through text-[#6B6862]' : 'text-[#222222]'}`}>
                                {place.name}
                              </span>
                              <span className="text-[10px] text-[#6B6862] bg-[#FAF3E1] px-1.5 py-0.2 rounded font-medium border border-[#E8DECA]">
                                {place.cat}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B6862]">{place.note}</p>
                          </div>

                          <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            place.visited ? 'bg-[#222222] text-white' : 'border border-[#E8DECA] text-[#6B6862]'
                          }`}>
                            {place.visited ? '✓' : ''}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-[#6B6862] text-center font-medium pt-1">
                      ✨ Tap any spot above to toggle visited status
                    </p>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-2xl border border-[#E8DECA] bg-[#F5E7C6] p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-[#FA8112]" />
                        <span className="text-xs font-black text-[#222222]">Collaborative Squad</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#222222] bg-white px-2 py-0.5 rounded-full border border-[#E8DECA]">
                        3 Online Co-Editors
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Elena Rostova', user: '@elena_travels', role: 'Owner', badge: '👑', color: 'bg-[#222222] text-white' },
                        { name: 'Aarav Mehta', user: '@aarav_explores', role: 'Editor', badge: '✏️', color: 'bg-[#FA8112] text-white' },
                        { name: 'Claire Dubois', user: '@claire_paris', role: 'Editor', badge: '✏️', color: 'bg-[#222222] text-white' },
                      ].map((collab) => (
                        <div key={collab.user} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8DECA]">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-full ${collab.color} font-black text-xs flex items-center justify-center shadow-2xs`}>
                              {collab.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#222222]">{collab.name}</div>
                              <div className="text-[10px] text-[#6B6862]">{collab.user}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF3E1] border border-[#E8DECA] text-[#222222]">
                            {collab.badge} {collab.role}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#E8DECA] text-xs text-[#222222] space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FA8112]">
                        <MessageSquareIcon className="h-3 w-3" />
                        <span>Live Spot Note from @aarav_explores:</span>
                      </div>
                      <p className="text-[11px] italic text-[#6B6862]">
                        &ldquo;Let&rsquo;s shift the bamboo grove to early morning so we catch the natural light!&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-2xl border border-[#E8DECA] bg-[#FAF3E1] p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
                      <span className="text-xs font-black text-[#222222]">✨ Travel Taste Blender</span>
                      <button
                        onClick={handleShuffleBlend}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#222222] bg-white px-2.5 py-1 rounded-full border border-[#E8DECA] shadow-2xs hover:bg-[#F5E7C6] transition-colors active-press cursor-pointer"
                      >
                        <ShuffleIcon className="h-3 w-3 text-[#FA8112]" />
                        <span>Shuffle Vibes</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-[#E8DECA] space-y-1 text-center">
                        <span className="text-[10px] font-bold text-[#FA8112]">Traveler A</span>
                        <p className="text-xs font-black text-[#222222] truncate">{interactiveTasteA}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E8DECA] space-y-1 text-center">
                        <span className="text-[10px] font-bold text-[#222222]">Traveler B</span>
                        <p className="text-xs font-black text-[#222222] truncate">{interactiveTasteB}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E8DECA] text-center space-y-1.5 shadow-2xs">
                      <div className="text-3xl font-black text-[#FA8112]">
                        {blendScore}% Match
                      </div>
                      <p className="text-xs text-[#6B6862] font-medium">
                        High Compatibility: You both love aesthetic cafes and exploring authentic neighborhoods!
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-2xl border border-[#E8DECA] bg-white p-5 space-y-3.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#FA8112]">
                        <SparklesIcon className="h-3.5 w-3.5" />
                        Public Guide Card
                      </span>
                      <span className="text-[10px] font-bold text-[#222222] bg-[#F5E7C6] px-2 py-0.5 rounded-full border border-[#E8DECA]">
                        Indexed by Google
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-mono text-[#6B6862]">trackilio.com/l/paris-pastries</div>
                      <h4 className="text-sm font-black text-[#222222]">Paris Food Bucket List: Pastries & Bistro Wine</h4>
                      <p className="text-xs text-[#6B6862]">
                        Curated by @claire_paris • 14 spots saved • 182 upvotes
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlameIcon className="h-4 w-4 text-[#FA8112]" />
                        <span className="text-xs font-bold text-[#222222]">OpenGraph Social Preview Ready</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#FA8112]">1-Click Share 🔗</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Principles Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
            Why We Built Trackilio
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-black text-[#222222]">
            Designed for Authentic Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#E8DECA] p-7 space-y-3 shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-[#F5E7C6] text-[#222222] flex items-center justify-center text-2xl shadow-2xs border border-[#E8DECA]">
              🎯
            </div>
            <h3 className="font-sans text-lg font-black text-[#222222]">Zero Generic Sponsored Content</h3>
            <p className="text-xs text-[#6B6862] leading-relaxed font-normal">
              Unlike generic travel blogs saturated with paid promotions, Trackilio guides come directly from passionate travelers sharing actual favorite places.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8DECA] p-7 space-y-3 shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-[#F5E7C6] text-[#222222] flex items-center justify-center text-2xl shadow-2xs border border-[#E8DECA]">
              ⚡
            </div>
            <h3 className="font-sans text-lg font-black text-[#222222]">1-Click Fast List Creation</h3>
            <p className="text-xs text-[#6B6862] leading-relaxed font-normal">
              Type a destination and launch a new itinerary instantly with starter templates or curate custom spot categories on the fly.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8DECA] p-7 space-y-3 shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-[#F5E7C6] text-[#222222] flex items-center justify-center text-2xl shadow-2xs border border-[#E8DECA]">
              🌐
            </div>
            <h3 className="font-sans text-lg font-black text-[#222222]">Open Sharing & Public SEO</h3>
            <p className="text-xs text-[#6B6862] leading-relaxed font-normal">
              Every public list gets a clean, fast-loading, indexable link with OpenGraph cards, making sharing with friends or social followers frictionless.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CTA Bottom Banner */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#222222] p-8 sm:p-12 text-center text-white space-y-5 shadow-sm">
          <div className="relative z-10 space-y-4">
            <h3 className="font-sans text-3xl sm:text-4xl font-black text-[#FAF3E1]">
              Ready to start your next journey?
            </h3>
            <p className="text-sm sm:text-base font-medium text-[#F5E7C6] max-w-xl mx-auto">
              Join Trackilio and turn your dream destinations into collaborative, beautifully organized itineraries today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] text-white px-7 py-3.5 text-xs font-extrabold shadow-xs transition-colors active-press"
              >
                <PlusIcon className="h-4 w-4 stroke-[2.5]" />
                <span>Get Started Free</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 hover:border-white/80 text-white px-6 py-3.5 text-xs font-bold transition-colors"
              >
                <span>Contact Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
