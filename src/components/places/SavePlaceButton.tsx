'use client';

import React, { useState } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        // Rollback
        setSaved(!nextState);
      }
    } catch {
      // Rollback
      setSaved(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all active-press ${
        saved
          ? 'bg-[#FF5841] text-white shadow-sm hover:bg-[#E84430]'
          : 'bg-[#FFEAE6] hover:bg-[#FFDCD6] text-[#FF5841] border border-[#FFD3CC]'
      } ${className}`}
      title={saved ? 'Saved in your places' : 'Save place'}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      )}
      {showText && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
