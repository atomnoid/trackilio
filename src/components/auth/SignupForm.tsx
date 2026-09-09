'use client';

import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckCircleIcon, XCircleIcon, AtSignIcon, UserIcon, MailIcon, LockIcon, ArrowRightIcon } from '@/components/icons/Icons';
import { validateUsernameFormat } from '@/lib/username';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'invalid' | 'taken'>('idle');
  const [usernameMessage, setUsernameMessage] = useState<string>('');

  useEffect(() => {
    const raw = username.trim();
    if (!raw) {
      setUsernameStatus('idle');
      setUsernameMessage('');
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
        const res = await fetch(`/api/username/check?username=${encodeURIComponent(validation.cleanUsername)}`);
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
  }, [username]);

  const isFormValid =
    displayName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    (usernameStatus === 'available' || (username.trim() && usernameStatus !== 'invalid' && usernameStatus !== 'taken'));

  const inputBase = "w-full rounded-2xl border bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white transition-all";
  const inputNormal = `${inputBase} border-gray-200 focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50`;

  return (
    <form action="/auth/signup/action" method="POST" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      {/* Display Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-800">
          Display Name <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="displayName"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Elena Rostova"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Unique Username */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-800">
            Choose Handle <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] font-semibold text-gray-400">Unique @username</span>
        </div>
        <div className="relative">
          <AtSignIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF5841]" />
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. elena_travels"
            autoComplete="username"
            spellCheck={false}
            className={`w-full rounded-2xl border pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white transition-all ${
              usernameStatus === 'available'
                ? 'border-emerald-400 bg-emerald-50/40 focus:ring-2 focus:ring-emerald-500'
                : usernameStatus === 'taken' || usernameStatus === 'invalid'
                ? 'border-rose-300 bg-rose-50/40 focus:ring-2 focus:ring-rose-400'
                : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50'
            }`}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {usernameStatus === 'checking' && <SpinnerIcon className="h-4 w-4 animate-spin text-gray-400" />}
            {usernameStatus === 'available' && <CheckCircleIcon className="h-4 w-4 text-emerald-600" />}
            {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
              <XCircleIcon className="h-4 w-4 text-rose-500" />
            )}
          </div>
        </div>

        {/* Username helper / status message */}
        {usernameMessage ? (
          <p
            className={`text-xs font-semibold ${
              usernameStatus === 'available'
                ? 'text-emerald-600'
                : usernameStatus === 'checking'
                ? 'text-gray-400'
                : 'text-rose-500'
            }`}
          >
            {usernameMessage}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400 font-medium">
            Letters, numbers, periods (.), and underscores (_). Used for your public link, Blend matches, and list invites.
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-800">
          Email Address <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-800">
          Password <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5841] hover:bg-[#E84430] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 text-sm shadow-sm active-press transition-all mt-2"
      >
        <span>Create Account</span>
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
