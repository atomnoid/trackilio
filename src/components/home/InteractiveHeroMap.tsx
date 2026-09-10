'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  CheckIcon,
  PlusIcon,
} from '@/components/icons/Icons';

export interface Spot {
  id: string;
  name: string;
  category: 'cafe' | 'food' | 'view' | 'gem';
  categoryLabel: string;
  emoji: string;
  x: number; // 0 - 640
  y: number; // 0 - 360
  priority: 'Must Visit' | 'Want to Visit' | 'Secret Spot';
  curator: {
    name: string;
    avatar: string;
    note: string;
  };
  upvotes: number;
  bestTime: string;
  walkTimeFromPrev?: string;
  address: string;
}

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  coordinates: string;
  waterPath: string;
  landPath: string;
  contourPath: string;
  routeD: string;
  spots: Spot[];
}

const CITY_PRESETS: CityPreset[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    tagline: 'Matcha pavillons, morning shrines & bamboo alleys',
    coordinates: '35.0116° N, 135.7681° E',
    waterPath: 'M 210,0 C 230,80 200,160 250,240 C 270,280 260,320 280,360 L 320,360 C 300,320 310,270 280,230 C 240,160 270,70 240,0 Z',
    landPath: 'M 40,60 C 120,20 200,50 300,20 C 420,-10 520,40 590,90 C 640,150 610,260 550,310 C 460,370 340,320 230,340 C 120,360 40,290 20,200 C 0,130 0,90 40,60 Z',
    contourPath: 'M 90,110 C 160,80 250,110 350,70 C 450,40 530,120 500,200 C 470,270 380,260 290,280 C 190,300 110,250 80,180 C 60,140 70,120 90,110 Z',
    routeD: 'M 130,220 Q 200,140 260,110 T 380,140 T 490,200 T 360,270',
    spots: [
      {
        id: 'k-1',
        name: 'Wabi Secret Tea Pavilion',
        category: 'gem',
        categoryLabel: 'Hidden Gem',
        emoji: '🍵',
        x: 130,
        y: 220,
        priority: 'Secret Spot',
        curator: {
          name: 'Elena Rostova',
          avatar: 'ER',
          note: 'Hidden behind a wooden garden gate. The iced ceremonial matcha and handmade dorayaki are unmatched.',
        },
        upvotes: 184,
        bestTime: '9:00 AM — quiet morning light',
        address: 'Higashiyama Ward, Kyoto',
      },
      {
        id: 'k-2',
        name: 'Sagano Bamboo Grove Path',
        category: 'view',
        categoryLabel: 'Scenic View',
        emoji: '🌿',
        x: 260,
        y: 110,
        priority: 'Must Visit',
        curator: {
          name: 'Kenji Sato',
          avatar: 'KS',
          note: 'Reach by 7:15 AM before tour groups. Listen to the wind rustling through towering green stalks.',
        },
        upvotes: 312,
        bestTime: 'Sunrise / Early Morning',
        walkTimeFromPrev: '14 min bike ride',
        address: 'Arashiyama, Ukyo Ward, Kyoto',
      },
      {
        id: 'k-3',
        name: '% Arabica Kyoto Higashiyama',
        category: 'cafe',
        categoryLabel: 'Roastery & Cafe',
        emoji: '☕',
        x: 380,
        y: 140,
        priority: 'Must Visit',
        curator: {
          name: 'Claire Dubois',
          avatar: 'CD',
          note: 'Signature Spanish Latte with a direct view of Yasaka Pagoda. Sip on the stone steps.',
        },
        upvotes: 245,
        bestTime: '10:30 AM',
        walkTimeFromPrev: '8 min walk',
        address: '87-5 Hoshinocho, Higashiyama',
      },
      {
        id: 'k-4',
        name: 'Kamo River Sunset Steps',
        category: 'view',
        categoryLabel: 'Sunset Spot',
        emoji: '🌅',
        x: 490,
        y: 200,
        priority: 'Want to Visit',
        curator: {
          name: 'Aarav Mehta',
          avatar: 'AM',
          note: 'Locals gather on the stepping stones with cold brew to watch the golden twilight reflect on water.',
        },
        upvotes: 198,
        bestTime: '5:45 PM (Sunset)',
        walkTimeFromPrev: '12 min walk',
        address: 'Kamogawa Riverbank, Kyoto',
      },
      {
        id: 'k-5',
        name: 'Gion Duck Noodles',
        category: 'food',
        categoryLabel: 'Artisan Ramen',
        emoji: '🍜',
        x: 360,
        y: 270,
        priority: 'Must Visit',
        curator: {
          name: 'Marcus Vance',
          avatar: 'MV',
          note: 'No English sign — look for the duck emoji neon. Rich smoked duck broth and sansho pepper noodles.',
        },
        upvotes: 276,
        bestTime: '7:30 PM (Dinner)',
        walkTimeFromPrev: '9 min walk',
        address: 'Gionmachi Kitagawa, Higashiyama',
      },
    ],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    flag: '🇮🇳',
    tagline: 'Heritage roasteries, colonial bookstores & riverside sunsets',
    coordinates: '22.5726° N, 88.3639° E',
    waterPath: 'M 140,0 C 160,100 130,200 160,280 C 180,330 170,360 190,360 L 230,360 C 210,330 220,270 190,210 C 170,130 190,50 170,0 Z',
    landPath: 'M 50,40 C 140,10 240,40 360,20 C 470,0 560,50 610,110 C 650,180 620,290 540,330 C 440,380 300,340 190,350 C 90,360 30,280 15,190 C 5,120 10,70 50,40 Z',
    contourPath: 'M 100,90 C 200,60 310,100 420,70 C 510,50 560,140 520,230 C 470,290 350,280 250,290 C 140,300 80,230 70,160 C 60,110 80,95 100,90 Z',
    routeD: 'M 110,160 Q 230,80 320,130 T 460,110 T 520,220 T 340,280',
    spots: [
      {
        id: 'kol-1',
        name: 'Princep Ghat Riverbank',
        category: 'view',
        categoryLabel: 'Scenic Ghat',
        emoji: '🌅',
        x: 110,
        y: 160,
        priority: 'Must Visit',
        curator: {
          name: 'Aarav Mehta',
          avatar: 'AM',
          note: 'Wooden boat ride along the Hooghly as the Vidyasagar Setu bridges light up into the orange sky.',
        },
        upvotes: 289,
        bestTime: '5:00 PM Golden Hour',
        address: 'Strand Rd, Vidyasagar Setu, Kolkata',
      },
      {
        id: 'kol-2',
        name: 'Blue Tokai Roastery — Park St',
        category: 'cafe',
        categoryLabel: 'Specialty Coffee',
        emoji: '☕',
        x: 320,
        y: 130,
        priority: 'Must Visit',
        curator: {
          name: 'Elena Rostova',
          avatar: 'ER',
          note: 'Single-origin pour-over paired with a fresh sourdough croissant. Great calm work environment.',
        },
        upvotes: 215,
        bestTime: '11:00 AM',
        walkTimeFromPrev: '15 min cab',
        address: 'Park Street, Kolkata',
      },
      {
        id: 'kol-3',
        name: 'College Street Heritage Books',
        category: 'gem',
        categoryLabel: 'Historic Alley',
        emoji: '📚',
        x: 460,
        y: 110,
        priority: 'Secret Spot',
        curator: {
          name: 'Ria Sen',
          avatar: 'RS',
          note: 'Miles of vintage wooden bookstalls and Indian Coffee House where Nobel laureates debated.',
        },
        upvotes: 340,
        bestTime: '2:30 PM Afternoon',
        walkTimeFromPrev: '12 min drive',
        address: 'College Street, Kolkata',
      },
      {
        id: 'kol-4',
        name: 'Sienna Store & Cafe',
        category: 'food',
        categoryLabel: 'Farm-to-Table',
        emoji: '🥗',
        x: 520,
        y: 220,
        priority: 'Must Visit',
        curator: {
          name: 'Samir Roy',
          avatar: 'SR',
          note: 'Handcrafted ceramic studio upstairs, incredible Gondhoraj lime tossed salad and seasonal bites below.',
        },
        upvotes: 310,
        bestTime: '1:00 PM Lunch',
        walkTimeFromPrev: '18 min drive',
        address: 'Hindustan Park, Gariahat, Kolkata',
      },
      {
        id: 'kol-5',
        name: 'Flurys Heritage Tea Room',
        category: 'cafe',
        categoryLabel: 'Colonial Tearoom',
        emoji: '🍰',
        x: 340,
        y: 280,
        priority: 'Want to Visit',
        curator: {
          name: 'Claire Dubois',
          avatar: 'CD',
          note: 'Since 1927. Famous for English breakfast tea, rum balls, and strawberry cubes.',
        },
        upvotes: 195,
        bestTime: '4:30 PM High Tea',
        walkTimeFromPrev: '10 min walk',
        address: '18A Park St, Kolkata',
      },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    tagline: 'Artisan bakeries, natural wine caves & cobblestone views',
    coordinates: '48.8566° N, 2.3522° E',
    waterPath: 'M 0,210 C 120,240 260,190 360,170 C 470,150 560,190 640,160 L 640,190 C 550,220 460,180 350,200 C 240,220 110,270 0,240 Z',
    landPath: 'M 40,50 C 130,20 280,30 400,20 C 530,10 610,60 620,140 C 630,220 590,300 510,340 C 390,380 250,330 150,340 C 60,350 20,270 15,180 C 10,100 20,60 40,50 Z',
    contourPath: 'M 80,90 C 190,60 320,80 440,60 C 540,50 570,130 540,220 C 500,290 380,270 280,280 C 170,290 100,240 70,170 C 50,120 60,100 80,90 Z',
    routeD: 'M 140,120 Q 250,90 320,140 T 470,110 T 510,240 T 260,260',
    spots: [
      {
        id: 'par-1',
        name: 'Du Pain et des Idées',
        category: 'food',
        categoryLabel: 'Artisan Boulangerie',
        emoji: '🥐',
        x: 140,
        y: 120,
        priority: 'Must Visit',
        curator: {
          name: 'Claire Dubois',
          avatar: 'CD',
          note: 'The Escargot Pistache-Chocolat straight out of the 1875 stone oven is worth the morning queue.',
        },
        upvotes: 410,
        bestTime: '8:30 AM fresh batch',
        address: '34 Rue Yves Toudic, 10th arr.',
      },
      {
        id: 'par-2',
        name: 'Square du Vert-Galant',
        category: 'view',
        categoryLabel: 'Seine Secret Tip',
        emoji: '🌿',
        x: 320,
        y: 140,
        priority: 'Secret Spot',
        curator: {
          name: 'Elena Rostova',
          avatar: 'ER',
          note: 'The western tip of Île de la Cité. Weeping willows kissing the water, perfect for cheese & baguette picnics.',
        },
        upvotes: 328,
        bestTime: '6:30 PM Sunset',
        walkTimeFromPrev: '15 min walk',
        address: '15 Place du Pont Neuf, 1st arr.',
      },
      {
        id: 'par-3',
        name: 'Boot Café',
        category: 'cafe',
        categoryLabel: 'Micro Espresso Bar',
        emoji: '☕',
        x: 470,
        y: 110,
        priority: 'Must Visit',
        curator: {
          name: 'Marcus Vance',
          avatar: 'MV',
          note: 'A former 19th century cobbler shop converted into Paris’s tiniest cafe with stellar flat whites.',
        },
        upvotes: 260,
        bestTime: '10:00 AM',
        walkTimeFromPrev: '11 min walk',
        address: '19 Rue du Pont aux Choux, Le Marais',
      },
      {
        id: 'par-4',
        name: 'Septime La Cave',
        category: 'gem',
        categoryLabel: 'Natural Wine Bar',
        emoji: '🍷',
        x: 510,
        y: 240,
        priority: 'Must Visit',
        curator: {
          name: 'Samir Roy',
          avatar: 'SR',
          note: 'Standing-room natural wine cave with smoked ricotta, anchovy toasts, and orange pet-nats.',
        },
        upvotes: 375,
        bestTime: '7:00 PM Aperitif',
        walkTimeFromPrev: '16 min walk',
        address: '3 Rue Basfroi, 11th arr.',
      },
      {
        id: 'par-5',
        name: 'Montmartre Hidden Vineyard',
        category: 'view',
        categoryLabel: 'Secret Vineyard',
        emoji: '🍇',
        x: 260,
        y: 260,
        priority: 'Secret Spot',
        curator: {
          name: 'Kenji Sato',
          avatar: 'KS',
          note: 'Clos Montmartre — Paris’s only working urban vineyard tucked behind the bustling Sacré-Cœur alleys.',
        },
        upvotes: 220,
        bestTime: '3:00 PM Golden Light',
        walkTimeFromPrev: '20 min metro',
        address: 'Rue des Saules, 18th arr.',
      },
    ],
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    flag: '🇮🇹',
    tagline: 'Cliffside sunset terraces, lemon groves & sea coves',
    coordinates: '40.6340° N, 14.6027° E',
    waterPath: 'M 0,230 C 130,260 270,180 390,220 C 500,260 570,220 640,240 L 640,360 L 0,360 Z',
    landPath: 'M 30,30 C 150,10 270,40 410,20 C 530,10 610,70 615,160 C 620,230 550,260 450,240 C 340,220 220,260 110,240 C 40,220 10,140 15,80 C 20,50 25,35 30,30 Z',
    contourPath: 'M 80,70 C 180,50 310,70 430,50 C 520,40 560,110 540,180 C 490,210 380,190 280,200 C 170,210 110,180 80,130 C 65,100 70,80 80,70 Z',
    routeD: 'M 120,100 Q 230,60 330,120 T 480,90 T 530,190 T 250,210',
    spots: [
      {
        id: 'am-1',
        name: 'Villa Cimbrone Infinity Terrace',
        category: 'view',
        categoryLabel: 'Infinite Vista',
        emoji: '🏛️',
        x: 120,
        y: 100,
        priority: 'Must Visit',
        curator: {
          name: 'Elena Rostova',
          avatar: 'ER',
          note: 'Marble busts lined above the endless turquoise Mediterranean. Breathtaking cliff drop view.',
        },
        upvotes: 480,
        bestTime: '9:30 AM before crowd',
        address: 'Ravello, Amalfi Coast',
      },
      {
        id: 'am-2',
        name: 'Lemon Garden Trattoria',
        category: 'food',
        categoryLabel: 'Lemon Orchard Dining',
        emoji: '🍋',
        x: 330,
        y: 120,
        priority: 'Secret Spot',
        curator: {
          name: 'Claire Dubois',
          avatar: 'CD',
          note: 'Dine directly underneath hanging yellow Amalfi sfusato lemons. Handmade scialatielli pasta.',
        },
        upvotes: 355,
        bestTime: '1:30 PM Lunch',
        walkTimeFromPrev: '15 min walk down',
        address: 'Amalfi Town',
      },
      {
        id: 'am-3',
        name: 'Fiordo di Furore Cove',
        category: 'gem',
        categoryLabel: 'Hidden Sea Fjord',
        emoji: '💎',
        x: 480,
        y: 90,
        priority: 'Must Visit',
        curator: {
          name: 'Aarav Mehta',
          avatar: 'AM',
          note: 'A dramatic natural sea gorge beneath an arched bridge. Crystal emerald swimming water.',
        },
        upvotes: 390,
        bestTime: '11:00 AM Mid-day swim',
        walkTimeFromPrev: '20 min scooter',
        address: 'Furore, Amalfi Coast',
      },
      {
        id: 'am-4',
        name: 'Il San Pietro Cliff Bar',
        category: 'cafe',
        categoryLabel: 'Cliff Sunset Lounge',
        emoji: '🍸',
        x: 530,
        y: 190,
        priority: 'Must Visit',
        curator: {
          name: 'Marcus Vance',
          avatar: 'MV',
          note: 'Carved bench in the cliff wall overlooking Positano twinkling lights at dusk.',
        },
        upvotes: 430,
        bestTime: '6:15 PM Sunset Aperitivo',
        walkTimeFromPrev: '15 min ride',
        address: 'Via Laurito, Positano',
      },
      {
        id: 'am-5',
        name: 'Arienzo Beach Club Path',
        category: 'view',
        categoryLabel: 'Orange Umbrella Cove',
        emoji: '🏖️',
        x: 250,
        y: 210,
        priority: 'Want to Visit',
        curator: {
          name: 'Samir Roy',
          avatar: 'SR',
          note: '300 stone steps down to the secluded beach with private shuttle boat back to main pier.',
        },
        upvotes: 260,
        bestTime: '2:00 PM Afternoon sun',
        walkTimeFromPrev: '10 min boat',
        address: 'Positano, Amalfi Coast',
      },
    ],
  },
];

export function InteractiveHeroMap({ className = '' }: { className?: string }) {
  const [activeCityId, setActiveCityId] = useState<string>('kyoto');
  const [selectedSpotId, setSelectedSpotId] = useState<string>('k-1');
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [showRoute, setShowRoute] = useState<boolean>(true);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState<string | null>(null);

  const activeCity = useMemo(
    () => CITY_PRESETS.find((c) => c.id === activeCityId) || CITY_PRESETS[0],
    [activeCityId]
  );

  // Filter spots by category
  const filteredSpots = useMemo(() => {
    if (activeCategoryFilter === 'all') return activeCity.spots;
    return activeCity.spots.filter((s) => s.category === activeCategoryFilter);
  }, [activeCity, activeCategoryFilter]);

  // Selected spot object
  const activeSpot = useMemo(() => {
    return (
      activeCity.spots.find((s) => s.id === (hoveredSpotId || selectedSpotId)) ||
      activeCity.spots[0]
    );
  }, [activeCity, selectedSpotId, hoveredSpotId]);

  // Handle city change
  const handleSelectCity = (cityId: string) => {
    setActiveCityId(cityId);
    const city = CITY_PRESETS.find((c) => c.id === cityId) || CITY_PRESETS[0];
    setSelectedSpotId(city.spots[0].id);
    setIsPlayingTour(false);
  };

  // Auto-play tour effect
  useEffect(() => {
    let interval: any;
    if (isPlayingTour) {
      interval = setInterval(() => {
        setSelectedSpotId((currentId) => {
          const currentIndex = activeCity.spots.findIndex((s) => s.id === currentId);
          const nextIndex = (currentIndex + 1) % activeCity.spots.length;
          return activeCity.spots[nextIndex].id;
        });
      }, 3200);
    }
    return () => clearInterval(interval);
  }, [isPlayingTour, activeCity]);

  // Upvote toggle
  const toggleUpvote = (spotId: string) => {
    setUpvotedMap((prev) => {
      const isUp = !prev[spotId];
      if (isUp) {
        triggerToast('Upvoted recommendation!');
      }
      return { ...prev, [spotId]: isUp };
    });
  };

  // Save to list toggle
  const toggleSave = (spotId: string) => {
    setSavedMap((prev) => {
      const isSaved = !prev[spotId];
      triggerToast(isSaved ? 'Saved to "My Dream Outings" list' : 'Removed from list');
      return { ...prev, [spotId]: isSaved };
    });
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.85), 1.35));
  };

  const categories = [
    { id: 'all', label: 'All Spots', icon: '📍' },
    { id: 'cafe', label: 'Cafés', icon: '☕' },
    { id: 'food', label: 'Food & Bites', icon: '🥐' },
    { id: 'view', label: 'Views', icon: '🌅' },
    { id: 'gem', label: 'Hidden Gems', icon: '💎' },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl border transition-colors duration-500 shadow-xl overflow-hidden ${
        isNightMode
          ? 'bg-[#18181B] border-[#2E2E33] text-zinc-100'
          : 'bg-[#FAF3E1] border-[#E8DECA] text-[#222222]'
      } ${className}`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div
        className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          isNightMode ? 'bg-[#1F1F23] border-[#2E2E33]' : 'bg-[#F5E7C6]/80 border-[#E8DECA]'
        }`}
      >
        {/* City Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CITY_PRESETS.map((city) => {
            const isActive = city.id === activeCityId;
            return (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap active-press ${
                  isActive
                    ? 'bg-[#FA8112] text-white shadow-xs scale-102 ring-2 ring-[#FA8112]/30'
                    : isNightMode
                    ? 'bg-[#27272A] hover:bg-[#323238] text-zinc-300'
                    : 'bg-white hover:bg-[#FAF3E1] text-[#222222] border border-[#E8DECA]'
                }`}
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
                {isActive && (
                  <span className="hidden sm:inline-block text-[10px] opacity-85 font-medium">
                    ({city.spots.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View mode & Auto-play controls */}
        <div className="flex items-center gap-2">
          {/* Day / Night Map Switch */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            title="Toggle Day/Night Map Palette"
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isNightMode
                ? 'bg-[#27272A] border-[#3F3F46] text-amber-300 hover:bg-[#323238]'
                : 'bg-white border-[#E8DECA] text-[#6B6862] hover:text-[#222222]'
            }`}
          >
            <span>{isNightMode ? '🌙 Night' : '☀️ Day'}</span>
          </button>

          {/* Route toggle */}
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showRoute
                ? 'bg-[#FA8112]/10 border-[#FA8112] text-[#FA8112]'
                : isNightMode
                ? 'bg-[#27272A] border-[#3F3F46] text-zinc-400'
                : 'bg-white border-[#E8DECA] text-[#6B6862]'
            }`}
          >
            <span>🧭</span>
            <span>Route</span>
          </button>

          {/* Tour Play Button */}
          <button
            onClick={() => setIsPlayingTour(!isPlayingTour)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer active-press shadow-xs ${
              isPlayingTour
                ? 'bg-[#222222] text-[#FAF3E1] ring-2 ring-[#FA8112]'
                : 'bg-[#222222] hover:bg-[#FA8112] text-white'
            }`}
          >
            <span>{isPlayingTour ? '⏸️ Pause Tour' : '▶️ Play Day Tour'}</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-BAR: CATEGORY PILLS & CITY COORDINATE STATUS */}
      <div
        className={`px-4 sm:px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
          isNightMode ? 'bg-[#141416] border-[#27272A]' : 'bg-[#FAF3E1] border-[#E8DECA]'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isCatActive = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isCatActive
                    ? isNightMode
                      ? 'bg-zinc-200 text-zinc-900 shadow-2xs'
                      : 'bg-[#222222] text-white shadow-2xs'
                    : isNightMode
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#222225]'
                    : 'text-[#6B6862] hover:text-[#222222] hover:bg-[#F5E7C6]'
                }`}
              >
                <span>{cat.icon} </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Collaborators & Location Tag */}
        <div className="hidden lg:flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'}>
              {activeCity.coordinates}
            </span>
          </div>
          <div className="flex items-center -space-x-1.5">
            <div className="h-5 w-5 rounded-full bg-[#FA8112] text-white text-[9px] font-black flex items-center justify-center border border-white">
              ER
            </div>
            <div className="h-5 w-5 rounded-full bg-[#222222] text-white text-[9px] font-black flex items-center justify-center border border-white">
              AM
            </div>
            <div className="h-5 w-5 rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center border border-white">
              CD
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE MAP CANVAS CONTAINER */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[360px] sm:min-h-[420px] max-h-[540px] overflow-hidden select-none">
        {/* Animated Canvas Motion Wrap */}
        <motion.div
          animate={{ scale: zoomScale }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="absolute inset-0 w-full h-full origin-center"
        >
          {/* Detailed Aesthetic SVG Map Background */}
          <svg
            viewBox="0 0 640 360"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <defs>
              {/* Topographic Dot Matrix Grid */}
              <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle
                  cx="16"
                  cy="16"
                  r="1"
                  fill={isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(34, 34, 34, 0.07)'}
                />
              </pattern>
              {/* Route Glow Filter */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Canvas Base Grid */}
            <rect
              width="640"
              height="360"
              fill={isNightMode ? '#18181B' : '#FAF3E1'}
            />
            <rect width="640" height="360" fill="url(#mapGrid)" />

            {/* Stylized Urban/Topographic Contour Background Shapes */}
            <motion.path
              key={`land-${activeCity.id}-${isNightMode}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              d={activeCity.landPath}
              fill={isNightMode ? '#222226' : '#F5E7C6'}
              stroke={isNightMode ? '#2F2F36' : '#E8DECA'}
              strokeWidth="2"
            />

            <motion.path
              key={`contour-${activeCity.id}-${isNightMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              d={activeCity.contourPath}
              fill="none"
              stroke={isNightMode ? 'rgba(250, 129, 18, 0.2)' : 'rgba(232, 222, 202, 0.9)'}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* River / Water Channel with Fluid Organic Feel */}
            <motion.path
              key={`water-${activeCity.id}-${isNightMode}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              d={activeCity.waterPath}
              fill={isNightMode ? '#121A24' : '#E2EDF8'}
              stroke={isNightMode ? '#1E2D3D' : '#BFDBFE'}
              strokeWidth="2"
            />

            {/* Decorative Map Lat/Long Crosshairs */}
            <g opacity={isNightMode ? 0.25 : 0.4} stroke={isNightMode ? '#71717A' : '#A8A29E'} strokeWidth="1">
              <line x1="160" y1="20" x2="160" y2="40" />
              <line x1="150" y1="30" x2="170" y2="30" />
              <line x1="480" y1="320" x2="480" y2="340" />
              <line x1="470" y1="330" x2="490" y2="330" />
            </g>

            {/* Decorative Compass Rose */}
            <g
              transform="translate(42, 45) scale(0.7)"
              opacity={isNightMode ? 0.35 : 0.5}
            >
              <circle cx="20" cy="20" r="18" fill="none" stroke={isNightMode ? '#52525B' : '#D6C7AF'} strokeWidth="1.5" />
              <polygon points="20,4 24,20 20,18" fill="#FA8112" />
              <polygon points="20,4 16,20 20,18" fill={isNightMode ? '#71717A' : '#A8A29E'} />
              <polygon points="20,36 24,20 20,22" fill={isNightMode ? '#71717A' : '#A8A29E'} />
              <polygon points="20,36 16,20 20,22" fill={isNightMode ? '#52525B' : '#D6C7AF'} />
              <text x="20" y="0" textAnchor="middle" fontSize="9" fontWeight="900" fill={isNightMode ? '#A1A1AA' : '#6B6862'}>N</text>
            </g>

            {/* Animated Day Tour / Itinerary Route Line */}
            {showRoute && (
              <g>
                {/* Route Glow Shadow */}
                <motion.path
                  key={`route-glow-${activeCity.id}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  d={activeCity.routeD}
                  fill="none"
                  stroke="#FA8112"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                />

                {/* Main Animated Dashed Route */}
                <motion.path
                  key={`route-${activeCity.id}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  d={activeCity.routeD}
                  fill="none"
                  stroke="#FA8112"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* Animated Traveling Wanderer Dot */}
                <motion.circle
                  r="6"
                  fill="#FA8112"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  animate={{
                    offsetDistance: ['0%', '100%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12,
                    ease: 'linear',
                  }}
                  style={{
                    offsetPath: `path('${activeCity.routeD}')`,
                  }}
                />
              </g>
            )}
          </svg>

          {/* Interactive Spot Pins Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {filteredSpots.map((spot, index) => {
              const isSelected = spot.id === selectedSpotId;
              const isHovered = spot.id === hoveredSpotId;
              const isSaved = !!savedMap[spot.id];

              const leftPct = (spot.x / 640) * 100;
              const topPct = (spot.y / 360) * 100;

              return (
                <div
                  key={spot.id}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10"
                >
                  <div className="relative group">
                    {/* Glowing Pulsing Radar Wave on Active Pin */}
                    {(isSelected || isHovered) && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: [1, 2.2, 2.6], opacity: [0.8, 0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                        className="absolute -inset-2 rounded-full bg-[#FA8112] pointer-events-none"
                      />
                    )}

                    {/* Interactive Marker Pin Button */}
                    <button
                      onClick={() => {
                        setSelectedSpotId(spot.id);
                        setIsPlayingTour(false);
                      }}
                      onMouseEnter={() => setHoveredSpotId(spot.id)}
                      onMouseLeave={() => setHoveredSpotId(null)}
                      className={`relative flex items-center gap-1.5 p-1 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg active-press ${
                        isSelected
                          ? 'bg-[#FA8112] text-white scale-115 ring-4 ring-[#FA8112]/35 z-30'
                          : isHovered
                          ? isNightMode
                            ? 'bg-[#27272A] text-white scale-108 ring-2 ring-zinc-500'
                            : 'bg-white text-[#222222] scale-108 ring-2 ring-[#FA8112]'
                          : isNightMode
                          ? 'bg-[#222226] text-zinc-200 hover:scale-105 border border-[#3F3F46]'
                          : 'bg-white text-[#222222] hover:scale-105 border border-[#E8DECA]'
                      }`}
                    >
                      {/* Step index badge or Category emoji */}
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm transition-transform shadow-xs ${
                          isSelected
                            ? 'bg-[#222222] text-white'
                            : isNightMode
                            ? 'bg-[#18181B] text-zinc-100'
                            : 'bg-[#F5E7C6] text-[#222222]'
                        }`}
                      >
                        <span>{spot.emoji}</span>
                      </div>

                      {/* Pill Title Label on Pin */}
                      <div className="pr-2 hidden sm:block text-left">
                        <div
                          className={`text-[11px] font-extrabold leading-tight truncate max-w-[110px] md:max-w-[130px] ${
                            isSelected ? 'text-white' : isNightMode ? 'text-zinc-100' : 'text-[#222222]'
                          }`}
                        >
                          {spot.name}
                        </div>
                        <div
                          className={`text-[9px] font-bold flex items-center gap-1 ${
                            isSelected
                              ? 'text-orange-100'
                              : isNightMode
                              ? 'text-zinc-400'
                              : 'text-[#6B6862]'
                          }`}
                        >
                          <span>#{index + 1}</span>
                          <span>•</span>
                          <span className="truncate">{spot.categoryLabel}</span>
                        </div>
                      </div>

                      {/* Saved Star Indicator */}
                      {isSaved && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 text-[#222222] text-[9px] font-black flex items-center justify-center shadow-xs border border-white">
                          ★
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 4. FLOATING INTERACTIVE PLACE DETAIL CARD (Bottom Left Popover) */}
        <AnimatePresence mode="wait">
          {activeSpot && (
            <motion.div
              key={activeSpot.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute left-3 right-3 sm:right-auto sm:left-4 bottom-3 sm:bottom-4 z-20 sm:max-w-sm pointer-events-auto"
            >
              <div
                className={`rounded-2xl p-4 sm:p-5 border shadow-2xl backdrop-blur-md transition-all ${
                  isNightMode
                    ? 'bg-[#1F1F23]/95 border-[#3F3F46] text-zinc-100'
                    : 'bg-white/95 border-[#E8DECA] text-[#222222]'
                }`}
              >
                {/* Header row: Status + Priority tags */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-inherit">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{activeSpot.emoji}</span>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#FA8112]">
                        {activeSpot.priority}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isNightMode ? 'bg-[#27272A] text-zinc-300' : 'bg-[#FAF3E1] text-[#6B6862]'
                    }`}
                  >
                    ⏰ {activeSpot.bestTime}
                  </span>
                </div>

                {/* Spot Title & Location */}
                <div className="pt-2.5 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-sans text-sm sm:text-base font-black leading-snug">
                      {activeSpot.name}
                    </h4>
                  </div>
                  <p
                    className={`text-[11px] font-medium flex items-center gap-1 truncate ${
                      isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'
                    }`}
                  >
                    <span>📍</span>
                    <span>{activeSpot.address}</span>
                  </p>
                </div>

                {/* Curator Quote Box */}
                <div
                  className={`mt-2.5 p-2.5 rounded-xl border text-[11px] leading-relaxed relative ${
                    isNightMode
                      ? 'bg-[#18181B]/80 border-[#2E2E33] text-zinc-300'
                      : 'bg-[#FAF3E1]/80 border-[#E8DECA] text-[#4A4843]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 pb-1">
                    <div className="h-4 w-4 rounded-full bg-[#FA8112] text-white text-[8px] font-black flex items-center justify-center">
                      {activeSpot.curator.avatar}
                    </div>
                    <span className="font-extrabold text-[10px]">
                      {activeSpot.curator.name}
                    </span>
                  </div>
                  <p className="italic font-normal">
                    &ldquo;{activeSpot.curator.note}&rdquo;
                  </p>
                </div>

                {/* Interactive Action Bar: Upvote + Save + Directions */}
                <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Upvote Button */}
                    <button
                      onClick={() => toggleUpvote(activeSpot.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active-press ${
                        upvotedMap[activeSpot.id]
                          ? 'bg-[#FA8112] text-white shadow-xs'
                          : isNightMode
                          ? 'bg-[#27272A] hover:bg-[#323238] text-zinc-300'
                          : 'bg-[#FAF3E1] hover:bg-[#F5E7C6] text-[#222222]'
                      }`}
                    >
                      <span>▲</span>
                      <span>
                        {activeSpot.upvotes + (upvotedMap[activeSpot.id] ? 1 : 0)}
                      </span>
                    </button>

                    {/* Quick Save to List */}
                    <button
                      onClick={() => toggleSave(activeSpot.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active-press ${
                        savedMap[activeSpot.id]
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#222222] hover:bg-[#FA8112] text-white shadow-xs'
                      }`}
                    >
                      {savedMap[activeSpot.id] ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add to list</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Next Stop Indicator */}
                  {activeSpot.walkTimeFromPrev && (
                    <div
                      className={`text-[10px] font-bold ${
                        isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'
                      }`}
                    >
                      🚶 {activeSpot.walkTimeFromPrev}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. FLOATING MAP NAVIGATION CONTROLS (Top Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
          {/* Zoom Buttons */}
          <div
            className={`rounded-2xl p-1 border shadow-md flex flex-col gap-1 ${
              isNightMode ? 'bg-[#1F1F23]/90 border-[#3F3F46]' : 'bg-white/90 border-[#E8DECA]'
            }`}
          >
            <button
              onClick={() => handleZoom(0.1)}
              title="Zoom In"
              className={`h-7 w-7 rounded-xl flex items-center justify-center font-black text-sm transition-colors cursor-pointer ${
                isNightMode
                  ? 'hover:bg-[#2A2A2E] text-zinc-100'
                  : 'hover:bg-[#FAF3E1] text-[#222222]'
              }`}
            >
              +
            </button>
            <div
              className={`h-[1px] w-full ${isNightMode ? 'bg-[#2E2E33]' : 'bg-[#E8DECA]'}`}
            />
            <button
              onClick={() => handleZoom(-0.1)}
              title="Zoom Out"
              className={`h-7 w-7 rounded-xl flex items-center justify-center font-black text-sm transition-colors cursor-pointer ${
                isNightMode
                  ? 'hover:bg-[#2A2A2E] text-zinc-100'
                  : 'hover:bg-[#FAF3E1] text-[#222222]'
              }`}
            >
              -
            </button>
          </div>

          {/* Reset Zoom Indicator */}
          {zoomScale !== 1 && (
            <button
              onClick={() => setZoomScale(1)}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold border shadow-xs transition-colors cursor-pointer ${
                isNightMode
                  ? 'bg-[#27272A] border-[#3F3F46] text-zinc-300 hover:bg-[#323238]'
                  : 'bg-white border-[#E8DECA] text-[#222222] hover:bg-[#FAF3E1]'
              }`}
            >
              Reset 100%
            </button>
          )}
        </div>

        {/* 6. TEMPORARY INTERACTIVE TOAST */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            >
              <div className="bg-[#222222] text-[#FAF3E1] px-4 py-2 rounded-2xl shadow-xl border border-white/10 text-xs font-black flex items-center gap-2">
                <SparklesIcon className="w-3.5 h-3.5 text-[#FA8112]" />
                <span>{showToast}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. BOTTOM SPOTS DECK (Synced horizontal carousel) */}
      <div
        className={`p-3 sm:p-4 border-t ${
          isNightMode ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#F5E7C6]/60 border-[#E8DECA]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 px-1">
          <span
            className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
              isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'
            }`}
          >
            <span>🗺️ Curated Day Plan in {activeCity.name}</span>
            <span className="text-[10px] font-normal">({activeCity.spots.length} spots)</span>
          </span>

          <div
            className={`text-[11px] font-bold hidden sm:block ${
              isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'
            }`}
          >
            Click any card or pin to inspect
          </div>
        </div>

        {/* Scrollable list of cards synced with map pins */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar py-1">
          {activeCity.spots.map((spot, i) => {
            const isSelected = spot.id === selectedSpotId;
            return (
              <button
                key={spot.id}
                onClick={() => {
                  setSelectedSpotId(spot.id);
                  setIsPlayingTour(false);
                }}
                onMouseEnter={() => setHoveredSpotId(spot.id)}
                onMouseLeave={() => setHoveredSpotId(null)}
                className={`flex-shrink-0 w-48 sm:w-56 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer active-press ${
                  isSelected
                    ? 'bg-[#222222] text-white border-[#222222] shadow-md scale-102 ring-2 ring-[#FA8112]'
                    : isNightMode
                    ? 'bg-[#1F1F23] hover:bg-[#27272A] border-[#2E2E33] text-zinc-200'
                    : 'bg-white hover:bg-[#FAF3E1] border-[#E8DECA] text-[#222222]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{spot.emoji}</span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isSelected ? 'text-[#FA8112]' : isNightMode ? 'text-zinc-400' : 'text-[#FA8112]'
                      }`}
                    >
                      Stop {i + 1}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold ${
                      isSelected ? 'text-zinc-300' : isNightMode ? 'text-zinc-500' : 'text-[#6B6862]'
                    }`}
                  >
                    ▲ {spot.upvotes}
                  </span>
                </div>

                <div className="font-sans text-xs font-black truncate leading-tight mt-1">
                  {spot.name}
                </div>

                <div
                  className={`text-[10px] font-medium truncate mt-0.5 ${
                    isSelected ? 'text-zinc-300' : isNightMode ? 'text-zinc-400' : 'text-[#6B6862]'
                  }`}
                >
                  {spot.categoryLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
