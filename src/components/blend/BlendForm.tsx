'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, User, Sparkles } from 'lucide-react';

interface BlendFormProps {
  prefillUsername?: string;
}

export function BlendForm({ prefillUsername }: BlendFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(prefillUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withUsername: username.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      router.push(`/blend/${data.blendId}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#78726D]" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a username (e.g. sara_travels)"
          className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] pl-11 pr-4 py-4 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] focus:bg-white transition-all"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A6B5D] hover:bg-[#3B594B] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-4 text-sm shadow-sm active-press transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculating Blend…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Blend
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
