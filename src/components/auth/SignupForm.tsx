'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, AtSign, User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { validateUsernameFormat } from '@/lib/username';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Username status: 'idle' | 'checking' | 'available' | 'invalid' | 'taken'
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

  return (
    <form action="/auth/signup/action" method="POST" className="bg-white border border-[#E6DFD5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
      {/* Display Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#2C2A29]">
          Display Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
          <input
            type="text"
            name="displayName"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Elena Rostova"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-10 pr-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Unique Username */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#2C2A29]">
            Choose Username <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-[#78726D]">Unique handle</span>
        </div>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
          <input
            type="text"
            name="username"
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
            {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
              <XCircle className="h-4 w-4 text-rose-500" />
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
                ? 'text-[#78726D]'
                : 'text-rose-500'
            }`}
          >
            {usernameMessage}
          </p>
        ) : (
          <p className="text-[11px] text-[#78726D] font-medium">
            3-30 characters, lowercase letters, numbers, periods (.), and underscores (_). Used for your public link, Blend matches, and list invites.
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#2C2A29]">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-10 pr-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#2C2A29]">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78726D]" />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-10 pr-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || usernameStatus === 'invalid' || usernameStatus === 'taken'}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A6B5D] hover:bg-[#3B594B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 text-sm shadow-2xs active-press transition-all mt-2"
      >
        <Sparkles className="h-4 w-4" />
        <span>Create Account</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
