'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MapPin, Calendar, HeartHandshake } from 'lucide-react';
import { BlendSession, Profile } from '@/types/database';
import { getBlendInterpretation } from '@/lib/blend.utils';

interface BlendHistoryCardProps {
  blend: BlendSession & { otherUser?: Profile };
}

export function BlendHistoryCard({ blend }: BlendHistoryCardProps) {
  const otherUser = blend.otherUser;
  const otherName = otherUser?.display_name || otherUser?.username || 'Traveler';
  const otherHandle = otherUser?.username ? `@${otherUser.username}` : null;
  const initial = otherName.charAt(0).toUpperCase();
  const label = getBlendInterpretation(blend.score);

  const sharedPlacesCount = Array.isArray(blend.shared_places) ? blend.shared_places.length : 0;
  const sharedDestsCount = Array.isArray(blend.shared_destinations) ? blend.shared_destinations.length : 0;

  return (
    <Link
      href={`/blend/${blend.id}`}
      className="group block bg-white rounded-3xl border border-gray-100 hover:border-[#FF5841]/30 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
    >
      <div className="flex items-start justify-between gap-4">
        {/* User Info & Score */}
        <div className="flex items-center gap-3.5 min-w-0">
          {otherUser?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={otherUser.avatar_url}
              alt={otherName}
              className="h-12 w-12 rounded-2xl object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blend with</span>
            </div>
            <h3 className="font-sans text-base font-black text-gray-900 truncate group-hover:text-[#FF5841] transition-colors">
              {otherName}
            </h3>
            {otherHandle && <p className="text-xs font-semibold text-[#C53678]">{otherHandle}</p>}
          </div>
        </div>

        {/* Score Ring / Pill */}
        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFEAE6] to-[#F9E2EE] border border-[#FFD3CC] text-[#FF5841] text-xs font-black">
            <Sparkles className="h-3 w-3" />
            <span>{blend.score}% Match</span>
          </div>
        </div>
      </div>

      {/* Overlap Summary Badges */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-600">
            <HeartHandshake className="h-3 w-3 text-[#C53678]" />
            {label}
          </span>
          {sharedPlacesCount > 0 && (
            <span className="text-[11px] text-gray-400">
              {sharedPlacesCount} shared spot{sharedPlacesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C53678] group-hover:translate-x-0.5 transition-transform">
          View Blend <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
