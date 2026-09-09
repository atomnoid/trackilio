'use client';

import React, { useState } from 'react';
import { MemberRole } from '@/types/database';
import { UserPlusIcon, TrashIcon, SpinnerIcon, UsersIcon, CrownIcon, ExternalLinkIcon } from '@/components/icons/Icons';
import { sanitizeUsername } from '@/lib/username';

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
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isOwner = currentUserId === ownerId;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeUsername(inviteUsername);
    if (!cleanUser) return;

    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          username: cleanUser,
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
        setInviteSuccess(
          `@${data.member.username || data.member.display_name} added as ${
            ROLE_LABELS[data.member.role as MemberRole] || data.member.role
          }!`
        );
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
      // silent fail
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
    <div className="rounded-3xl bg-white border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFEAE6] to-[#F9E2EE] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-[#FA8112]" />
          <h3 className="font-sans text-sm font-black text-gray-900">
            Collaborators ({members.length})
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#C53678]">Shared Workspace</span>
      </div>

      {/* Member List */}
      <ul className="divide-y divide-gray-50">
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
              {m.profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.profile.avatar_url}
                  alt={name}
                  className="h-8 w-8 rounded-xl object-cover border border-gray-200 shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                  {initials}
                </div>
              )}

              {/* Name + username */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
                {m.profile?.username ? (
                  <a
                    href={`/u/${m.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#FF5841] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    @{m.profile.username}
                    <ExternalLinkIcon className="h-2.5 w-2.5 opacity-60" />
                  </a>
                ) : (
                  <p className="text-[10px] text-gray-400 font-medium">Collaborator</p>
                )}
              </div>

              {/* Role badge / selector */}
              {isThisOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-2.5 py-0.5 text-[10px] font-extrabold shrink-0 shadow-sm">
                  <CrownIcon className="h-2.5 w-2.5" /> Owner
                </span>
              ) : isOwner ? (
                <div className="relative shrink-0 flex items-center gap-1.5">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value as MemberRole)}
                    disabled={updatingId === m.user_id}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 cursor-pointer"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {updatingId === m.user_id && (
                    <SpinnerIcon className="h-3 w-3 animate-spin text-[#FA8112]" />
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#FFEAE6] border border-[#FFD3CC] text-[#FF5841] px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                  {ROLE_LABELS[m.role] || m.role}
                </span>
              )}

              {/* Remove button */}
              {(isOwner && !isThisOwner) || (!isOwner && m.user_id === currentUserId) ? (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  disabled={removingId === m.user_id}
                  title={m.user_id === currentUserId ? 'Leave list' : 'Remove member'}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Invite Form (owner only) */}
      {isOwner && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 space-y-3">
          {inviteSuccess && (
            <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              ✓ {inviteSuccess}
            </p>
          )}
          {inviteError && (
            <p className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {inviteError}
            </p>
          )}

          <form onSubmit={handleInvite} className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <UserPlusIcon className="h-3 w-3 text-[#FA8112]" /> Invite by @username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="e.g. sara_travels"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 transition-all"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 cursor-pointer shrink-0"
              >
                <option value="editor">Editor (Can add/edit)</option>
                <option value="viewer">Viewer (View only)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting || !inviteUsername.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-2 text-xs shadow-xs transition-all active-press"
            >
              {inviting ? (
                <>
                  <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                  Inviting…
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-3.5 w-3.5" />
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
