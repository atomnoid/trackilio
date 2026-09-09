'use client';

import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from '@/components/icons/Icons';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`Copy URL manually: ${shareUrl}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm hover:border-stone-300 hover:bg-stone-50 transition-all"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : <ShareIcon className="h-4 w-4 text-stone-600" />}
      <span>{copied ? 'Link Copied!' : 'Share List'}</span>
    </button>
  );
}
