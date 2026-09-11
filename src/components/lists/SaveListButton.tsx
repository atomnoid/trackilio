'use client';

import React, { useState, useEffect } from 'react';
import { BookmarkIcon, SpinnerIcon } from '@/components/icons/Icons';
import { useRouter } from 'next/navigation';

interface SaveListButtonProps {
  listId: string;
  initialSaved?: boolean;
  className?: string;
  variant?: 'button' | 'icon';
}

export function SaveListButton({
  listId,
  initialSaved = false,
  className = '',
  variant = 'button',
}: SaveListButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !saved;
    setSaved(nextState);
    setLoading(true);

    try {
      const res = await fetch('/api/lists/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId }),
      });

      if (res.status === 401) {
        router.push(`/auth/login?redirect=/l/${listId}`);
        setSaved(!nextState);
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(data.saved);
      } else {
        setSaved(!nextState); // rollback
      }
    } catch {
      setSaved(!nextState); // rollback
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        title={saved ? 'Saved to your lists' : 'Save this list'}
        className={`p-2 rounded-xl transition-all duration-200 active-press cursor-pointer ${
          saved
            ? 'bg-[#18181B] text-white border border-[#18181B] hover:bg-black shadow-xs'
            : 'bg-white/90 text-[#4F4B5E] hover:text-[#18181B] hover:bg-white border border-[#EFE9EC]'
        } ${className}`}
      >
        {loading ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <BookmarkIcon className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} filled={saved} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black shadow-xs active-press transition-all duration-200 cursor-pointer ${
        saved
          ? 'bg-[#18181B] text-white border border-[#18181B] hover:bg-black'
          : 'bg-white hover:bg-[#FAF8F3] text-[#1A1723] hover:text-[#18181B] border border-[#E8DECA] hover:border-[#18181B]'
      } ${className}`}
    >
      {loading ? (
        <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <BookmarkIcon className="h-3.5 w-3.5" filled={saved} />
      )}
      <span>{saved ? 'Saved in My Lists' : 'Save List'}</span>
    </button>
  );
}
