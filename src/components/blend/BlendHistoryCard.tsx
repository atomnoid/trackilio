'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon, PinIcon } from '@/components/icons/Icons';
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
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/blend/${blend.id}`}
        className="group block bg-white rounded-3xl border border-[#E8DECA] hover:border-[#222222] p-5 sm:p-6 transition-all duration-200 shadow-2xs hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          {/* User Info & Score */}
          <div className="flex items-center gap-3.5 min-w-0">
            {otherUser?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={otherUser.avatar_url}
                alt={otherName}
                className="h-12 w-12 rounded-2xl object-cover border border-[#E8DECA] shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-[#222222] text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#6B6862] uppercase tracking-wider">
                  Blend match
                </span>
              </div>
              <h3 className="font-sans text-base font-black text-[#222222] truncate group-hover:text-[#FA8112] transition-colors">
                {otherName}
              </h3>
              {otherHandle && <p className="text-xs font-bold text-[#6B6862]">{otherHandle}</p>}
            </div>
          </div>

          {/* Score Ring / Pill */}
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E1] border border-[#E8DECA] text-[#222222] text-xs font-black">
              <SparklesIcon className="h-3 w-3 text-[#FA8112]" />
              <span className="text-[#FA8112] font-black">{blend.score}%</span>
            </div>
          </div>
        </div>

        {/* Overlap Summary Badges */}
        <div className="mt-4 pt-3.5 border-t border-[#E8DECA]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#6B6862] font-medium">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF3E1] border border-[#E8DECA] text-[11px] font-bold text-[#222222]">
              {label}
            </span>
            {sharedPlacesCount > 0 && (
              <span className="text-[11px] text-[#6B6862] font-semibold flex items-center gap-1">
                <PinIcon className="w-3 h-3 text-[#FA8112]" />
                {sharedPlacesCount} spot{sharedPlacesCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#222222] group-hover:text-[#FA8112] group-hover:translate-x-0.5 transition-all">
            View Blend <ArrowRightIcon className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
