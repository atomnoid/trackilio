'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
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
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <span className="text-gray-900 font-black">{initialFollowersCount}</span>
          <span className="text-gray-500 font-medium">Followers</span>
        </button>

        <button
          type="button"
          onClick={() => setModalType('following')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <span className="text-gray-900 font-black">{initialFollowingCount}</span>
          <span className="text-gray-500 font-medium">Following</span>
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
