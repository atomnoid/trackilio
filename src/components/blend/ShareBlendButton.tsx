'use client';

import React, { useState } from 'react';
import { ShareIcon, CheckIcon, CopyIcon } from '@/components/icons/Icons';

interface ShareBlendButtonProps {
  blendId: string;
  score: number;
  label: string;
  nameA: string;
  nameB: string;
}

export function ShareBlendButton({ blendId, score, label, nameA, nameB }: ShareBlendButtonProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${siteUrl}/blend/${blendId}`;
  const text = `${nameA} and ${nameB} got a ${score}% travel match on Trackilio! "${label}" — check your Blend 🌍`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Trackilio Blend Match', text, url });
        return;
      } catch {
        // fallthrough to copy
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-6 py-3 text-xs shadow-xs active-press transition-colors cursor-pointer"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-[#FA8112]" /> : <ShareIcon className="h-4 w-4" />}
      <span>{copied ? 'Copied Link!' : 'Share Blend'}</span>
      {!copied && <CopyIcon className="h-3.5 w-3.5 opacity-60" />}
    </button>
  );
}
