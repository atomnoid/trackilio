'use client';

import React, { useState } from 'react';
import { MemberRole } from '@/types/database';
import { UserPlus, Trash2, ChevronDown, Loader2, Users, Crown } from 'lucide-react';

interface MemberEntry {
  id: string;
  user_id: string;
  role: MemberRole;
  profile?: {
    display_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface MembersPanelProps {
  listId: string;
  ownerId: string;
  initialMembers: MemberEntry[];
  currentUserId: string;
}

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
};

export function MembersPanel({
  listId,
  ownerId,
  initialMembers,
  currentUserId,
}: MembersPanelProps) {
  const [members, setMembers] = useState<MemberEntry[]>(initialMembers);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isOwner = currentUserId === ownerId;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;

    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          username: inviteUsername.trim().replace(/^@/, ''),
          role: inviteRole,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setInviteError(data.error || 'Failed to invite member.');
      } else {
        const newMember: MemberEntry = {
          id: data.member.id,
          user_id: data.member.id,
          role: data.member.role,
          profile: {
            display_name: data.member.display_name,
            username: data.member.username,
            avatar_url: null,
          },
        };
        setMembers((prev) => [...prev, newMember]);
        setInviteUsername('');
        setInviteSuccess(`@${data.member.username || data.member.display_name} has been added as ${ROLE_LABELS[data.member.role as MemberRole] || data.member.role}.`);
        setTimeout(() => setInviteSuccess(null), 4000);
      }
    } catch {
      setInviteError('Network error. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: MemberRole) => {
    if (newRole === 'owner') return;
    setUpdatingId(userId);

    try {
      const res = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, userId, role: newRole }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.user_id === userId ? { ...m, role: newRole } : m))
        );
      }
    } catch {
      // silent fail — role displayed as-is
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    const prev = members;
    setMembers((m) => m.filter((x) => x.user_id !== userId));

    try {
      const res = await fetch('/api/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, userId }),
      });
      if (!res.ok) {
        setMembers(prev);
      }
    } catch {
      setMembers(prev);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E6DFD5] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E6DFD5] flex items-center gap-2">
        <Users className="h-4 w-4 text-[#4A6B5D]" />
        <h3 className="font-sans text-sm font-black text-[#2C2A29]">
          Collaborators ({members.length})
        </h3>
      </div>

      {/* Member List */}
      <ul className="divide-y divide-[#F3EFE6]">
        {members.map((m) => {
          const name = m.profile?.display_name || m.profile?.username || 'Traveler';
          const initials = name.slice(0, 2).toUpperCase();
          const isThisOwner = m.user_id === ownerId;

          return (
            <li
              key={m.user_id}
              className={`flex items-center gap-3 px-5 py-3 transition-opacity ${
                removingId === m.user_id ? 'opacity-40' : ''
              }`}
            >
              {/* Avatar */}
              <div className="h-8 w-8 rounded-xl bg-[#2C2A29] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                {initials}
              </div>

              {/* Name + username */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2C2A29] truncate">{name}</p>
                {m.profile?.username ? (
                  <a
                    href={`/u/${m.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#4A6B5D] hover:underline font-semibold"
                  >
                    @{m.profile.username}
                  </a>
                ) : (
                  <p className="text-[10px] text-[#9E968F] font-medium">Collaborator</p>
                )}
              </div>

              {/* Role badge / selector */}
              {isThisOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#2C2A29] text-white px-2.5 py-0.5 text-[10px] font-extrabold shrink-0">
                  <Crown className="h-2.5 w-2.5" /> Owner
                </span>
              ) : isOwner ? (
                <div className="relative shrink-0">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value as MemberRole)}
                    disabled={updatingId === m.user_id}
                    className="appearance-none rounded-lg border border-[#E6DFD5] bg-[#FAF6F0] pl-2.5 pr-6 py-1 text-[10px] font-bold text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] cursor-pointer disabled:opacity-50"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#78726D] pointer-events-none" />
                </div>
              ) : (
                <span className="text-[10px] font-bold text-[#78726D] bg-[#F3EFE6] rounded-full px-2.5 py-0.5 shrink-0">
                  {ROLE_LABELS[m.role as MemberRole] ?? m.role}
                </span>
              )}

              {/* Remove button (owner can remove others; member can remove themselves) */}
              {(isOwner && !isThisOwner) || (!isOwner && m.user_id === currentUserId) ? (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  disabled={removingId === m.user_id}
                  title={m.user_id === currentUserId ? 'Leave list' : 'Remove member'}
                  className="shrink-0 p-1 rounded-md text-[#C09090] hover:text-[#E0533C] hover:bg-[#FDF3F1] disabled:opacity-40 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Invite Form (owner only) */}
      {isOwner && (
        <div className="px-5 py-4 border-t border-[#E6DFD5] space-y-3">
          {inviteSuccess && (
            <p className="text-[11px] font-bold text-[#4A6B5D] bg-[#EDF5F0] border border-[#BFD9CA] rounded-lg px-3 py-2">
              ✓ {inviteSuccess}
            </p>
          )}
          {inviteError && (
            <p className="text-[11px] font-bold text-[#E0533C] bg-[#FDF3F1] border border-[#F0D5D5] rounded-lg px-3 py-2">
              {inviteError}
            </p>
          )}

          <form onSubmit={handleInvite} className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#78726D] flex items-center gap-1">
              <UserPlus className="h-3 w-3" /> Invite by username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="@username"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] px-3 py-2 text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] focus:bg-white transition-all"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                className="rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] px-2 py-2 text-xs font-bold text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] cursor-pointer shrink-0"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting || !inviteUsername.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 text-xs shadow-sm transition-all active-press"
            >
              {inviting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Inviting…
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite Collaborator
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
