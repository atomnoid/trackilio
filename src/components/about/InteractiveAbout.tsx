'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CompassIcon,
  SparklesIcon,
  PinIcon,
  UsersIcon,
  HeartHandshakeIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ShareIcon,
  BookmarkIcon,
  ShuffleIcon,
  MessageSquareIcon,
  FlameIcon,
  SearchIcon,
} from '@/components/icons/Icons';

export function InteractiveAbout() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [interactiveTasteA, setInteractiveTasteA] = useState<string>('Cafes & Vintage Boutiques');
  const [interactiveTasteB, setInteractiveTasteB] = useState<string>('Scenic Mountain Treks');
  const [blendScore, setBlendScore] = useState<number>(84);
  const [interactivePlaces, setInteractivePlaces] = useState([
    { name: 'Kamo Riverbank Sunset', cat: 'Viewpoint', note: 'Bring iced matcha tea and watch the ducks', visited: true },
    { name: 'Weekenders Coffee Roastery', cat: 'Cafe', note: 'Tucked inside a tiny car park alley', visited: false },
    { name: 'Pontocho Alley Izakaya', cat: 'Dining', note: 'Book lantern riverside seating', visited: false },
  ]);

  const steps = [
    {
      id: 0,
      title: '1. Curate & Collect Places',
      tagline: 'Never lose a travel recommendation in messy group chats again',
      emoji: '📍',
      description:
        'Save cafes, viewpoints, bakeries, and secret viewpoints with custom notes, priority tags (Must Visit vs. Want to Visit), and direct Google Maps pins.',
      color: 'from-[#FF5841] to-[#FF7A5C]',
      bg: 'bg-[#FFEAE6]',
      border: 'border-[#FFD3CC]',
    },
    {
      id: 1,
      title: '2. Collaborate in Real-Time',
      tagline: 'Invite friends by @username with instant co-editor access',
      emoji: '🤝',
      description:
        'Add travel buddies as co-editors or viewers. Upvote favorite spots together, leave spot comments, and coordinate your itinerary seamlessly.',
      color: 'from-[#C53678] to-[#E05090]',
      bg: 'bg-[#F9E2EE]',
      border: 'border-[#F4C5DD]',
    },
    {
      id: 2,
      title: '3. Match Travel Blend',
      tagline: 'Calculate shared taste overlap and discover twin destinations',
      emoji: '✨',
      description:
        'Blend your travel profile with any friend’s @username. Trackilio cross-references your saved spots and taste preferences to surface the highest-compatibility travel spots.',
      color: 'from-[#FF5841] to-[#C53678]',
      bg: 'bg-gradient-to-r from-[#FFEAE6] to-[#F9E2EE]',
      border: 'border-[#FFD3CC]',
    },
    {
      id: 3,
      title: '4. Public Discovery & Daily Trivia',
      tagline: 'Share your guides with clean links & enjoy daily curated fun facts',
      emoji: '🌍',
      description:
        'Publish your wander lists to help travelers worldwide. Explore trending community guides and roll fresh travel trivia right from your dashboard.',
      color: 'from-[#C53678] to-[#FF5841]',
      bg: 'bg-[#FFEAE6]',
      border: 'border-[#FFD3CC]',
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
      'Hidden Alpine Hikes & Lakes',
      'Cyberpunk Neon Arcades',
      'Old Town Architecture & Bookstores',
      'Tropical Coastal Surf & Shacks',
      'Historic Tea Houses & Zen Gardens',
    ];
    const newA = tastes[Math.floor(Math.random() * tastes.length)];
    let newB = tastes[Math.floor(Math.random() * tastes.length)];
    while (newB === newA) {
      newB = tastes[Math.floor(Math.random() * tastes.length)];
    }
    setInteractiveTasteA(newA);
    setInteractiveTasteB(newB);
    setBlendScore(Math.floor(Math.random() * 25) + 75); // 75 - 99
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-4 py-1.5 text-xs font-black text-[#FF5841] shadow-2xs">
          <SparklesIcon className="h-3.5 w-3.5 animate-spin-slow" />
          The Story & Mechanics of Trackilio
        </div>

        <h1 className="font-sans text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
          Travel lists designed for{' '}
          <span className="bg-gradient-to-r from-[#FF5841] to-[#C53678] bg-clip-text text-transparent">
            real exploration.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Trackilio replaces cluttered notes, chaotic group chats, and generic tourist listicles with collaborative itineraries, community discovery, and intelligent Travel Taste Blends.
        </p>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5841] hover:bg-[#E84430] text-white px-7 py-3.5 text-xs font-black shadow-md hover:shadow-lg transition-all active-press"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Create Your First List</span>
          </Link>

          <Link
            href="/blend"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#FFD3CC] hover:border-[#FF5841] text-[#C53678] px-6 py-3.5 text-xs font-black shadow-2xs hover:shadow-xs transition-all active-press"
          >
            <SparklesIcon className="h-4 w-4 text-[#FF5841]" />
            <span>Try Travel Blend</span>
          </Link>
        </div>
      </section>

      {/* Interactive Step-by-Step Simulator */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5841]">
            Interactive Showcase
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-black text-gray-900">
            How Trackilio Works Under the Hood
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium">
            Click through the steps below to experience how Trackilio simplifies trip planning.
          </p>
        </div>

        {/* Navigation Step Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-3 p-4 rounded-3xl border text-left transition-all active-press cursor-pointer ${
                activeStep === idx
                  ? 'bg-white border-[#FF5841] shadow-md ring-2 ring-[#FF5841]/20 scale-[1.02]'
                  : 'bg-white/60 border-gray-100 hover:border-gray-200 hover:bg-white text-gray-500'
              }`}
            >
              <div className={`h-10 w-10 shrink-0 rounded-2xl ${s.bg} flex items-center justify-center text-xl`}>
                {s.emoji}
              </div>
              <div className="truncate">
                <div className={`text-xs font-black ${activeStep === idx ? 'text-[#FF5841]' : 'text-gray-800'}`}>
                  Step 0{idx + 1}
                </div>
                <div className="text-[11px] text-gray-500 truncate font-medium">{s.title.split('. ')[1]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Step Interactive Canvas Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Active Step Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#FF5841]/10 to-[#C53678]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Explanation Column */}
            <div className="lg:col-span-6 space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${steps[activeStep].bg} text-[#FF5841] border ${steps[activeStep].border}`}>
                {steps[activeStep].emoji} Step 0{activeStep + 1}
              </span>

              <h3 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {steps[activeStep].title.split('. ')[1]}
              </h3>

              <p className="text-sm font-bold text-[#C53678]">
                {steps[activeStep].tagline}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {steps[activeStep].description}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all active-press"
                >
                  <span>Next Step</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-6">
              {activeStep === 0 && (
                /* Step 1 Interactive: Place Checklist Simulator */
                <div className="rounded-2xl border border-[#EFE9EC] bg-[#FAFAFC] p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-900">🎌 7 Days in Kyoto</span>
                      <span className="text-[10px] bg-[#FFEAE6] text-[#FF5841] font-bold px-2 py-0.5 rounded-full">
                        Interactive Demo
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Click to toggle visited</span>
                  </div>

                  <div className="space-y-2.5">
                    {interactivePlaces.map((place, i) => (
                      <div
                        key={place.name}
                        onClick={() => handleToggleVisited(i)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          place.visited
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-white border-gray-100 hover:border-[#FF5841]/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${place.visited ? 'line-through text-emerald-800' : 'text-gray-900'}`}>
                              {place.name}
                            </span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded font-medium">
                              {place.cat}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">{place.note}</p>
                        </div>

                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          place.visited ? 'bg-emerald-600 text-white' : 'border border-gray-200 text-gray-300'
                        }`}>
                          {place.visited ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-400 text-center font-medium pt-1">
                    ✨ Tap any spot above to mark as visited
                  </p>
                </div>
              )}

              {activeStep === 1 && (
                /* Step 2 Interactive: Live Collaborator Preview */
                <div className="rounded-2xl border border-[#F4C5DD] bg-[#FDF4F8] p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F4C5DD]/60">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-[#C53678]" />
                      <span className="text-xs font-black text-gray-900">Collaborative Squad</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#C53678] bg-white px-2 py-0.5 rounded-full border border-[#F4C5DD]">
                      3 Online
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Elena Rostova', user: '@elena_travels', role: 'Owner', badge: '👑', color: 'bg-[#FFEAE6] text-[#FF5841]' },
                      { name: 'Aarav Mehta', user: '@aarav_explores', role: 'Editor', badge: '✏️', color: 'bg-[#F9E2EE] text-[#C53678]' },
                      { name: 'Claire Dubois', user: '@claire_paris', role: 'Editor', badge: '✏️', color: 'bg-purple-100 text-purple-700' },
                    ].map((collab) => (
                      <div key={collab.user} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-full ${collab.color} font-black text-xs flex items-center justify-center`}>
                            {collab.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">{collab.name}</div>
                            <div className="text-[10px] text-gray-400">{collab.user}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
                          {collab.badge} {collab.role}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C53678]">
                      <MessageSquareIcon className="h-3 w-3" />
                      <span>Live Suggestion from @aarav_explores:</span>
                    </div>
                    <p className="text-[11px] italic text-gray-500">
                      &ldquo;Let&rsquo;s shift the bamboo grove to early morning so we avoid the crowds!&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                /* Step 3 Interactive: Travel Blend Simulator */
                <div className="rounded-2xl border border-[#FFD3CC] bg-gradient-to-br from-[#FFEAE6]/60 to-[#F9E2EE]/60 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                    <span className="text-xs font-black text-gray-900">✨ Travel Taste Blender</span>
                    <button
                      onClick={handleShuffleBlend}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5841] bg-white px-2.5 py-1 rounded-full border border-[#FFD3CC] shadow-2xs hover:bg-[#FFEAE6] transition-all"
                    >
                      <ShuffleIcon className="h-3 w-3" />
                      <span>Shuffle Vibes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-[#FF5841]">Traveler A</span>
                      <p className="text-xs font-black text-gray-800 truncate">{interactiveTasteA}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-[#C53678]">Traveler B</span>
                      <p className="text-xs font-black text-gray-800 truncate">{interactiveTasteB}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center space-y-1.5 shadow-2xs">
                    <div className="text-3xl font-black bg-gradient-to-r from-[#FF5841] to-[#C53678] bg-clip-text text-transparent">
                      {blendScore}% Match
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      High Compatibility: You both prioritize scenic aesthetics and local culinary hidden gems!
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                /* Step 4 Interactive: Daily Trivia & SEO Public Card */
                <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#FF5841]">
                      <SparklesIcon className="h-3.5 w-3.5" />
                      Public Guide Card
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Indexed by Google
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono text-gray-400">trackilio.com/l/paris-pastries</div>
                    <h4 className="text-sm font-black text-gray-900">Paris Food Bucket List: Pastries & Bistro Wine</h4>
                    <p className="text-xs text-gray-500">
                      Curated by @claire_paris • 14 spots saved • 182 upvotes
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#FFEAE6] to-[#FDF4F8] border border-[#FFD3CC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlameIcon className="h-4 w-4 text-[#FF5841]" />
                      <span className="text-xs font-bold text-gray-800">Daily Travel Fact Widget</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#C53678]">Interactive 🎲</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5841]">
            Why We Built Trackilio
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-black text-gray-900">
            Designed for Authentic Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-7 space-y-3 shadow-xs hover:border-[#FF5841]/30 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="font-sans text-lg font-black text-gray-900">Zero Generic Sponsored Content</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Unlike generic travel blogs saturated with paid promotions, Trackilio guides come directly from passionate travelers sharing actual favorite places.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-7 space-y-3 shadow-xs hover:border-[#FF5841]/30 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-[#F9E2EE] text-[#C53678] flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="font-sans text-lg font-black text-gray-900">1-Click Fast List Creation</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Type a destination and launch a new itinerary instantly with starter templates or curate custom spot categories on the fly.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-7 space-y-3 shadow-xs hover:border-[#FF5841]/30 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl">
              🌐
            </div>
            <h3 className="font-sans text-lg font-black text-gray-900">Open Sharing & Public SEO</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Every public list gets a clean, fast-loading, indexable link with OpenGraph cards, making sharing with friends or social followers frictionless.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF5841] to-[#C53678] p-8 sm:p-12 text-center text-white space-y-5 shadow-lg">
          <div className="relative z-10 space-y-4">
            <h3 className="font-sans text-3xl sm:text-4xl font-black">
              Ready to start your next journey?
            </h3>
            <p className="text-sm sm:text-base font-medium opacity-90 max-w-xl mx-auto">
              Join Trackilio and turn your dream destinations into collaborative, beautifully organized itineraries today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#FF5841] px-7 py-3.5 text-xs font-black shadow-md hover:shadow-lg transition-all active-press"
              >
                <PlusIcon className="h-4 w-4 stroke-[2.5]" />
                <span>Get Started Free</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 hover:border-white/80 text-white px-6 py-3.5 text-xs font-bold transition-all"
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
