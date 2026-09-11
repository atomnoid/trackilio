'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, AtSignIcon, PinIcon, MailIcon, SpinnerIcon, CheckCircleIcon, XCircleIcon, ExternalLinkIcon, SaveIcon } from '@/components/icons/Icons';
import Link from 'next/link';
import { Profile } from '@/types/database';
import { validateUsernameFormat, sanitizeUsername } from '@/lib/username';

interface SettingsFormProps {
  initialProfile: Profile | null;
  userEmail: string;
  userId: string;
}

export function SettingsForm({ initialProfile, userEmail, userId }: SettingsFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialProfile?.display_name || '');
  const [username, setUsername] = useState(initialProfile?.username || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [location, setLocation] = useState(initialProfile?.location || '');

  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'invalid' | 'taken' | 'same'
  >('same');
  const [usernameMessage, setUsernameMessage] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialCleanUsername = sanitizeUsername(initialProfile?.username || '');

  useEffect(() => {
    const raw = username.trim();
    const clean = sanitizeUsername(raw);

    if (!clean) {
      setUsernameStatus('invalid');
      setUsernameMessage('Username cannot be empty.');
      return;
    }

    if (clean === initialCleanUsername) {
      setUsernameStatus('same');
      setUsernameMessage('Your current username');
      return;
    }

    const validation = validateUsernameFormat(raw);
    if (!validation.valid) {
      setUsernameStatus('invalid');
      setUsernameMessage(validation.error || 'Invalid username format.');
      return;
    }

    setUsernameStatus('checking');
    setUsernameMessage('Checking availability…');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(validation.cleanUsername)}&excludeUserId=${encodeURIComponent(userId)}`
        );
        const data = await res.json();
        if (data.available) {
          setUsernameStatus('available');
          setUsernameMessage(`@${data.cleanUsername} is available!`);
        } else {
          setUsernameStatus('taken');
          setUsernameMessage(data.error || 'This username is unavailable.');
        }
      } catch {
        setUsernameStatus('idle');
        setUsernameMessage('');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, initialCleanUsername, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameStatus === 'invalid' || usernameStatus === 'taken') {
      return;
    }

    setSaving(true);
    setSuccessNotice(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          username: sanitizeUsername(username),
          bio: bio.trim(),
          location: location.trim(),
          avatarUrl: initialProfile?.avatar_url || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Failed to update profile settings.');
        setSaving(false);
        return;
      }

      setSuccessNotice('Profile settings saved successfully!');
      setSaving(false);
      router.refresh();
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch {
      setErrorMessage('Network error occurred. Please try again.');
      setSaving(false);
    }
  };

  const currentCleanHandle = sanitizeUsername(username) || initialCleanUsername || 'your_username';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successNotice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 flex items-center gap-2">
          <XCircleIcon className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-sans text-base font-black text-gray-900 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-[#FA8112]" /> Profile Details
          </h2>
          <Link
            href={`/u/${currentCleanHandle}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C53678] hover:text-[#FF5841] transition-colors"
          >
            <span>View Public Profile</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">
            Display Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Instagram-Style Username */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-800">
              Username Handle <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-semibold text-gray-400">Unique to you</span>
          </div>
          <div className="relative">
            <AtSignIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FA8112]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. elena_travels"
              autoComplete="username"
              spellCheck={false}
              className={`w-full rounded-2xl border pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white transition-all ${
                usernameStatus === 'available'
                  ? 'border-emerald-400 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500'
                  : usernameStatus === 'taken' || usernameStatus === 'invalid'
                  ? 'border-rose-300 bg-rose-50/40 focus:ring-2 focus:ring-rose-400'
                  : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50'
              }`}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {usernameStatus === 'checking' && <SpinnerIcon className="h-4 w-4 animate-spin text-gray-400" />}
              {usernameStatus === 'available' && <CheckCircleIcon className="h-4 w-4 text-emerald-600" />}
              {usernameStatus === 'same' && <span className="text-xs font-bold text-gray-400">Current</span>}
              {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                <XCircleIcon className="h-4 w-4 text-rose-500" />
              )}
            </div>
          </div>

          {usernameMessage ? (
            <p
              className={`text-xs font-semibold ${
                usernameStatus === 'available'
                  ? 'text-emerald-600'
                  : usernameStatus === 'same' || usernameStatus === 'checking'
                  ? 'text-gray-400'
                  : 'text-rose-500'
              }`}
            >
              {usernameMessage}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 font-medium">
              Letters, numbers, periods (.), and underscores (_). 3-30 characters.
            </p>
          )}

          {/* Profile URL Preview */}
          <div className="rounded-xl bg-[#FFEAE6] border border-[#FFD3CC] p-3 text-xs flex items-center gap-2">
            <span className="font-bold text-gray-700">Public Link:</span>
            <code className="text-[#FF5841] font-bold font-mono">
              /u/{currentCleanHandle}
            </code>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Bio / Travel Style</label>
          <div className="relative">
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Always looking for cozy cafes, art galleries, and serene coastal sunsets."
              maxLength={200}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all resize-none"
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] font-semibold text-gray-400">{bio.length}/200</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Home Base / Location</label>
          <div className="relative">
            <PinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FA8112]" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kyoto, Japan or Vancouver, Canada"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
            />
          </div>
        </div>


        {/* Email Address (Read-Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Email Address</label>
          <div className="relative">
            <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full rounded-2xl border border-gray-200 bg-gray-100 pl-10 pr-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || usernameStatus === 'invalid' || usernameStatus === 'taken' || !displayName.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5841] hover:bg-[#E84430] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 text-sm shadow-sm active-press transition-all"
        >
          {saving ? (
            <>
              <SpinnerIcon className="h-4 w-4 animate-spin" />
              <span>Saving Profile…</span>
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
