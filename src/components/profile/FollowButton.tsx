'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SpinnerIcon, CheckIcon, PlusIcon } from '@/components/icons/Icons';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onFollowChange,
  className = '',
  size = 'md',
}: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const toggleFollow = async () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (onFollowChange) onFollowChange(nextState);

    startTransition(async () => {
      try {
        const method = nextState ? 'POST' : 'DELETE';
        const res = await fetch('/api/follows', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId: targetUserId }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 401) {
            router.push('/auth/login');
            setIsFollowing(!nextState);
            if (onFollowChange) onFollowChange(!nextState);
            return;
          }
          throw new Error(errData.error || `Follow request failed with status ${res.status}`);
        }

        router.refresh();
      } catch (err: any) {
        console.error('Follow error:', err?.message || err);
        setIsFollowing(!nextState);
        if (onFollowChange) onFollowChange(!nextState);
      }
    });
  };

  const isSmall = size === 'sm';

  if (isFollowing) {
    return (
      <button
        type="button"
        onClick={toggleFollow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isPending}
        className={`inline-flex items-center justify-center gap-1.5 font-extrabold rounded-xl transition-all active-press cursor-pointer ${
          isHovered
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-[#F5E7C6] text-[#222222] border border-[#E8DECA] hover:bg-[#EFE2C2]'
        } ${
          isSmall
            ? 'px-3 py-1.5 text-xs'
            : 'px-4 py-2.5 text-xs sm:text-sm'
        } ${className}`}
      >
        {isPending ? (
          <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-[#222222]" />
        ) : isHovered ? (
          <span>Unfollow</span>
        ) : (
          <>
            <CheckIcon className="w-3.5 h-3.5 text-[#FA8112]" />
            <span>Following</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-1.5 font-extrabold rounded-xl text-white bg-[#FA8112] hover:bg-[#E4720A] shadow-xs active-press transition-all cursor-pointer ${
        isSmall
          ? 'px-3 py-1.5 text-xs'
          : 'px-4 py-2.5 text-xs sm:text-sm'
      } ${className}`}
    >
      {isPending ? (
        <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-white" />
      ) : (
        <>
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
