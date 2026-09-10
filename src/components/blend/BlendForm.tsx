'use client';

import React, { useState } from 'react';
import { LinkIcon, SpinnerIcon, CheckIcon, CopyIcon, SparklesIcon } from '@/components/icons/Icons';

export function BlendForm() {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setInviteUrl(null);
    setCopied(false);

    try {
      const res = await fetch('/api/blend/invite', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to generate invite link.');
        return;
      }
      setInviteUrl(data.url);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  if (inviteUrl) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
          <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
            <CheckIcon className="h-4 w-4" />
            Blend invite link created! Share it with your travel buddy.
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={inviteUrl}
              className="flex-1 min-w-0 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-mono text-gray-700 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2.5 text-xs transition-colors"
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            This link expires in 7 days. When your friend clicks it and accepts, your Blend score will be calculated automatically.
          </p>
        </div>
        <button
          onClick={() => { setInviteUrl(null); setError(null); }}
          className="w-full text-xs font-bold text-[#78726D] hover:text-[#222222] transition-colors py-1"
        >
          Generate a new link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-800">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold px-8 py-4 text-sm shadow-xs active-press transition-all"
      >
        {loading ? (
          <>
            <SpinnerIcon className="h-4 w-4 animate-spin" />
            <span>Creating link…</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            <span>Generate Blend Invite Link</span>
            <SparklesIcon className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-[#78726D] font-medium">
        Share the link ? they accept ? see your compatibility score instantly.
      </p>
    </div>
  );
}
