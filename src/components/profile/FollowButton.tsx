'use client';

import { useState, useTransition } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    // Optimistic UI update
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
        // Rollback state on failure
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
        className={`inline-flex items-center justify-center gap-1.5 font-extrabold rounded-xl transition-all active-press ${
          isHovered
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
        } ${
          isSmall
            ? 'px-3 py-1.5 text-xs'
            : 'px-4 py-2.5 text-xs sm:text-sm'
        } ${className}`}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
        ) : isHovered ? (
          <span>Unfollow</span>
        ) : (
          <>
            <UserCheck className="h-3.5 w-3.5 text-[#FF5841]" />
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
      className={`inline-flex items-center justify-center gap-1.5 font-extrabold rounded-xl text-white bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 shadow-xs active-press transition-all ${
        isSmall
          ? 'px-3 py-1.5 text-xs'
          : 'px-4 py-2.5 text-xs sm:text-sm'
      } ${className}`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
