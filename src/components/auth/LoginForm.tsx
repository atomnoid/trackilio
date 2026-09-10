'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from '@/components/icons/Icons';

interface LoginFormProps {
  redirectUrl: string;
}

export function LoginForm({ redirectUrl }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action="/auth/login/action"
      method="POST"
      className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-5"
    >
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
        <label className="block text-xs font-bold text-gray-800">Password</label>
        <div className="relative">
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="..."
            autoComplete="current-password"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-11 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
        className="w-full rounded-2xl bg-[#FF5841] hover:bg-[#E84430] text-white font-black py-3.5 text-sm shadow-sm active-press transition-all"
      >
        Log In
      </button>
    </form>
  );
}
