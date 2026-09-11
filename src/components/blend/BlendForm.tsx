'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  SpinnerIcon,
  LinkIcon,
} from '@/components/icons/Icons';

export function BlendForm() {
  // Link state
  const [generatingLink, setGeneratingLink] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError(null);
    setInviteUrl(null);
    setCopied(false);

    try {
      const res = await fetch('/api/blend/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create invite link. Please try again.');
      } else {
        setInviteUrl(data.url);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const shareText = encodeURIComponent(
    'Compare our travel tastes and find our compatibility match on Trackilio Blend!'
  );
  const whatsappUrl = inviteUrl
    ? `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(inviteUrl)}`
    : '';

  return (
    <div className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800"
        >
          {error}
        </motion.div>
      )}

      {/* 1-Click Invite Link Generator */}
      <div className="space-y-4">
        {inviteUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-[#FAF3E1] border border-[#E8DECA] p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-black text-[#222222]">
              <SparklesIcon className="h-4 w-4 text-[#FA8112]" />
              <span>Your Blend Invitation Link is Ready!</span>
            </div>

            <p className="text-xs text-[#6B6862] leading-relaxed">
              Send this link to a travel buddy. When they open it, Trackilio will compare your public itineraries, shared spots, and calculate your mutual Travel Blend score.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 min-w-0 rounded-2xl border border-[#E8DECA] bg-white px-4 py-3 text-xs font-mono text-[#222222] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-5 py-3 text-xs shadow-xs active-press transition-colors cursor-pointer shrink-0"
              >
                {copied ? <CheckIcon className="h-4 w-4 text-[#FA8112]" /> : <CopyIcon className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8DECA]/60 text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#2E7D32] hover:underline"
              >
                <span>💬 Share via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setInviteUrl(null);
                  setError(null);
                }}
                className="font-bold text-[#FA8112] hover:underline cursor-pointer"
              >
                Generate a fresh link
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={generatingLink}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-black py-4 text-sm shadow-md active-press transition-all cursor-pointer disabled:opacity-50"
            >
              {generatingLink ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin text-[#FA8112]" />
                  <span>Generating Unique Invite Link…</span>
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 text-[#FA8112]" />
                  <span>Generate 1-Click Blend Invite Link</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#6B6862] leading-relaxed">
              Anyone with your invite link can compare travel tastes with you in 1 click.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
