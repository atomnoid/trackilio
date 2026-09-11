'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon, SpinnerIcon } from '@/components/icons/Icons';

interface SavePlaceButtonProps {
  placeId: string;
  initialSaved?: boolean;
  currentUserId?: string;
  className?: string;
  showText?: boolean;
}

export function SavePlaceButton({
  placeId,
  initialSaved = false,
  currentUserId,
  className = '',
  showText = false,
}: SavePlaceButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const nextState = !saved;
    setSaved(nextState);
    setLoading(true);

    try {
      const res = await fetch('/api/places/save', {
        method: nextState ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });

      if (!res.ok) {
        setSaved(!nextState);
      }
    } catch {
      setSaved(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active-press cursor-pointer ${
        saved
          ? 'bg-[#18181B] text-white border border-[#18181B] hover:bg-black shadow-xs'
          : 'bg-[#F5E7C6] hover:bg-[#EFE2C2] text-[#222222] border border-[#E8DECA]'
      } ${className}`}
      title={saved ? 'Saved in your places' : 'Save place'}
    >
      {loading ? (
        <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <BookmarkIcon className="w-3.5 h-3.5" filled={saved} />
      )}
      {showText && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
