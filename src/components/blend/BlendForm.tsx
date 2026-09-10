'use client';

import { useState } from 'react';
import { SparklesIcon, CopyIcon, CheckIcon, SpinnerIcon, LinkIcon } from '@/components/icons/Icons';

interface BlendFormProps {
  prefillUsername?: string;
}

export function BlendForm({ prefillUsername = '' }: BlendFormProps) {
  const [generating, setGenerating] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setGenerating(true);
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
      setGenerating(false);
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

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      {inviteUrl ? (
        <div className="rounded-xl bg-[#FAF3E1] border border-[#E8DECA] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#222222]">
            <LinkIcon className="h-4 w-4 text-[#FA8112]" />
            <span>Your Blend Invitation Link is Ready!</span>
          </div>

          <p className="text-xs text-[#6B6862] leading-relaxed">
            Send this link to your friend. Once they open and accept it, your Blend match score and shared places will be instantly revealed and saved for both of you.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 min-w-0 rounded-xl border border-[#E8DECA] bg-white px-3.5 py-2.5 text-xs font-mono text-[#222222] focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 text-white font-extrabold px-4 py-2.5 text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B6862] pt-1">
            <span>Valid for 7 days</span>
            <button
              type="button"
              onClick={() => {
                setInviteUrl(null);
                setError(null);
              }}
              className="font-bold text-[#FF5841] hover:underline"
            >
              Generate another link
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-50 text-white font-extrabold px-6 py-3.5 text-sm shadow-md transition-all active:scale-[0.98]"
            >
              {generating ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                  <span>Generating Invite Link...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  <span>Generate Blend Invite Link</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-[#6B6862]">
            No need to remember usernames — simply share your unique invite link with anyone.
          </p>
        </div>
      )}
    </div>
  );
}
