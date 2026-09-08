'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

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
        await navigator.share({ title: 'Trackilio Blend', text, url });
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
      className="inline-flex items-center gap-2 rounded-xl bg-[#2C2A29] hover:bg-black text-white font-bold px-6 py-3 text-sm shadow-sm active-press transition-all"
    >
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
      {copied ? 'Copied link!' : 'Share your Blend'}
      {!copied && <Copy className="h-3.5 w-3.5 opacity-60" />}
    </button>
  );
}
