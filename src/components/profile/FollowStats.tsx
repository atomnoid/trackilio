'use client';

import { useState } from 'react';
import { FollowListModal } from './FollowListModal';

interface FollowStatsProps {
  userId: string;
  initialFollowersCount: number;
  initialFollowingCount: number;
  displayName: string;
}

export function FollowStats({
  userId,
  initialFollowersCount,
  initialFollowingCount,
  displayName,
}: FollowStatsProps) {
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setModalType('followers')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#F5E7C6] border border-[#E8DECA] px-3 py-1 text-[#222222] font-bold text-xs transition-colors cursor-pointer"
        >
          <span className="text-[#222222] font-black">{initialFollowersCount}</span>
          <span className="text-[#6B6862] font-medium">Followers</span>
        </button>

        <button
          type="button"
          onClick={() => setModalType('following')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#F5E7C6] border border-[#E8DECA] px-3 py-1 text-[#222222] font-bold text-xs transition-colors cursor-pointer"
        >
          <span className="text-[#222222] font-black">{initialFollowingCount}</span>
          <span className="text-[#6B6862] font-medium">Following</span>
        </button>
      </div>

      {modalType && (
        <FollowListModal
          userId={userId}
          type={modalType}
          isOpen={true}
          onClose={() => setModalType(null)}
          titleName={displayName}
        />
      )}
    </>
  );
}
