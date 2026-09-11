'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  SpinnerIcon,
  LinkIcon,
  UserPlusIcon,
  AtSignIcon,
  ArrowRightIcon,
} from '@/components/icons/Icons';
import { sanitizeUsername } from '@/lib/username';

interface BlendFormProps {
  prefillUsername?: string;
}

export function BlendForm({ prefillUsername = '' }: BlendFormProps) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'link' | 'username'>(
    prefillUsername ? 'username' : 'link'
  );

  // Link state
  const [generatingLink, setGeneratingLink] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Username state
  const [targetUsername, setTargetUsername] = useState(prefillUsername);
  const [calculating, setCalculating] = useState(false);

  // Error state
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

  const handleUsernameBlend = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeUsername(targetUsername);
    if (!clean || calculating) return;

    setCalculating(true);
    setError(null);

    try {
      const res = await fetch('/api/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withUsername: clean }),
      });

      const data = await res.json();

      if (!res.ok || !data.blendId) {
        setError(data.error || 'Failed to calculate Blend. Please check the @username.');
        setCalculating(false);
        return;
      }

      router.push(`/blend/${data.blendId}`);
    } catch {
      setError('Network error. Please try again.');
      setCalculating(false);
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
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF3E1] border border-[#E8DECA] rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveMode('link');
            setError(null);
          }}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeMode === 'link'
              ? 'bg-[#222222] text-white shadow-xs'
              : 'text-[#6B6862] hover:text-[#222222]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>1-Click Invite Link</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('username');
            setError(null);
          }}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeMode === 'username'
              ? 'bg-[#222222] text-white shadow-xs'
              : 'text-[#6B6862] hover:text-[#222222]'
          }`}
        >
          <AtSignIcon className="w-3.5 h-3.5" />
          <span>Blend by @Username</span>
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800"
        >
          {error}
        </motion.div>
      )}

      {/* Tab 1: 1-Click Invite Link */}
      <AnimatePresence mode="wait">
        {activeMode === 'link' && (
          <motion.div
            key="link-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {inviteUrl ? (
              <div className="rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#222222]">
                  <SparklesIcon className="h-4 w-4 text-[#FA8112]" />
                  <span>Your Blend Invitation Link is Ready!</span>
                </div>

                <p className="text-xs text-[#6B6862] leading-relaxed">
                  Send this link to a friend. As soon as they open and accept it, your Blend match
                  percentage and overlapping travel spots will instantly be revealed and saved for both
                  of you.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 min-w-0 rounded-xl border border-[#E8DECA] bg-white px-4 py-3 text-xs font-mono text-[#222222] focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-5 py-3 text-xs shadow-xs active-press transition-colors cursor-pointer"
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
                    Generate another link
                  </button>
                </div>
              </div>
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
                      <SparklesIcon className="h-4 w-4 text-[#FA8112]" />
                      <span>Generate 1-Click Blend Invite Link</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#6B6862] leading-relaxed">
                  No username required — anyone with the link can compare travel tastes with you.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Direct @Username Blend */}
        {activeMode === 'username' && (
          <motion.form
            key="username-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleUsernameBlend}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#222222]">
                Traveler @Username
              </label>
              <div className="relative">
                <AtSignIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FA8112]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. elena_travels or aarav_explores"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  disabled={calculating}
                  className="w-full rounded-2xl border border-[#E8DECA] bg-[#FAF3E1]/60 pl-11 pr-4 py-3 text-xs font-medium text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating || !targetUsername.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-black py-4 text-sm shadow-md active-press transition-all cursor-pointer disabled:opacity-50"
            >
              {calculating ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin text-[#FA8112]" />
                  <span>Calculating Travel Overlap…</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 text-[#FA8112]" />
                  <span>Calculate Blend Match</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#6B6862]">
              Compares public lists and itineraries to calculate an instant compatibility match.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
