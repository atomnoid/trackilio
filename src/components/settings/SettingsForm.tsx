'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  AtSign,
  MapPin,
  FileText,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Save,
} from 'lucide-react';
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
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '');

  // Username status: 'idle' | 'checking' | 'available' | 'invalid' | 'taken' | 'same'
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
          avatarUrl: avatarUrl.trim(),
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
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white border border-[#E6DFD5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3EFE6]">
          <h2 className="font-sans text-base font-black text-[#2C2A29] flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-[#4A6B5D]" /> Profile Information
          </h2>
          <Link
            href={`/u/${currentCleanHandle}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A6B5D] hover:underline"
          >
            <span>View Public Profile</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2C2A29]">
            Display Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-10 pr-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Instagram-Style Username */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#2C2A29]">
              Username Handle <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-semibold text-[#78726D]">Unique to you</span>
          </div>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. elena_travels"
              autoComplete="username"
              spellCheck={false}
              className={`w-full rounded-2xl border pl-10 pr-10 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:bg-white transition-all ${
                usernameStatus === 'available'
                  ? 'border-emerald-400 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500'
                  : usernameStatus === 'taken' || usernameStatus === 'invalid'
                  ? 'border-rose-300 bg-rose-50/40 focus:ring-2 focus:ring-rose-400'
                  : 'border-[#E6DFD5] bg-[#FAF6F0] focus:ring-2 focus:ring-[#4A6B5D]'
              }`}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-[#78726D]" />}
              {usernameStatus === 'available' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {usernameStatus === 'same' && <span className="text-xs font-bold text-[#78726D]">Current</span>}
              {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                <XCircle className="h-4 w-4 text-rose-500" />
              )}
            </div>
          </div>

          {usernameMessage ? (
            <p
              className={`text-xs font-semibold ${
                usernameStatus === 'available'
                  ? 'text-emerald-600'
                  : usernameStatus === 'same'
                  ? 'text-[#78726D]'
                  : usernameStatus === 'checking'
                  ? 'text-[#78726D]'
                  : 'text-rose-500'
              }`}
            >
              {usernameMessage}
            </p>
          ) : (
            <p className="text-[11px] text-[#78726D] font-medium">
              Letters, numbers, periods (.), and underscores (_). 3-30 characters.
            </p>
          )}

          {/* Profile URL Preview */}
          <div className="rounded-xl bg-[#F5F1E8] border border-[#E6DFD5] p-3 text-xs flex items-center gap-2 text-[#78726D]">
            <span className="font-bold text-[#2C2A29]">Public URL:</span>
            <code className="text-[#4A6B5D] font-bold font-mono">
              /u/{currentCleanHandle}
            </code>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2C2A29]">Bio / Travel Philosophy</label>
          <div className="relative">
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Always looking for the coziest third-wave coffee shops and mountain ridges."
              maxLength={200}
              className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] p-3.5 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all resize-none"
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] font-semibold text-[#78726D]">{bio.length}/200</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2C2A29]">Home Base / Location</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kyoto, Japan or Berlin, Germany"
              className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-10 pr-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Avatar Image URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2C2A29]">Avatar URL (Optional)</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
          />
        </div>

        {/* Email Address (Read-Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2C2A29]">Email Address (Account Login)</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full rounded-2xl border border-[#E6DFD5] bg-[#F5F1E8] pl-10 pr-4 py-3 text-sm font-medium text-[#78726D] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || usernameStatus === 'invalid' || usernameStatus === 'taken' || !displayName.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A6B5D] hover:bg-[#3B594B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 text-sm shadow-2xs active-press transition-all pt-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Profile…</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
