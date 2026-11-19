'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from '@/components/icons/Icons';
import { GoogleAuthButton } from './GoogleAuthButton';

interface LoginFormProps {
  redirectUrl: string;
}

export function LoginForm({ redirectUrl }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* 1-Click Fast Google Sign In */}
      <div className="space-y-2">
        <GoogleAuthButton
          text="Continue with Google"
          redirectUrl={redirectUrl}
        />
        <p className="text-[11px] text-center text-gray-400 font-medium">
          Fast, 1-click access with your Google account
        </p>
      </div>

      {/* Modern Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          or sign in with email
        </div>
      </div>

      {/* Email + Password Form */}
      <form action="/auth/login/action" method="POST" className="space-y-4">
        <input type="hidden" name="redirectUrl" value={redirectUrl} />

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Email Address</label>
          <div className="relative">
            <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-800">Password</label>
          </div>
          <div className="relative">
            <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-11 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#FF5841] hover:bg-[#E84430] text-white font-black py-3.5 text-sm shadow-sm active:scale-[0.99] transition-all cursor-pointer mt-2"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
