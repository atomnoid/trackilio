'use client';

import React, { useState } from 'react';
import { MemberRole } from '@/types/database';
import { UserPlus, Trash2, ChevronDown, Loader2, Users, Crown, Sparkles, ExternalLink } from 'lucide-react';
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
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#E7E0EE] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E7E0EE] bg-gradient-to-r from-[#F6F1F6] to-[#F1F3FB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#6469AC]" />
          <h3 className="font-sans text-sm font-black text-[#2A2735]">
            Collaborators ({members.length})
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#8E6D8E]">Shared Workspace</span>
      </div>

      {/* Member List */}
      <ul className="divide-y divide-[#F3EFF7]">
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
                  className="h-8 w-8 rounded-xl object-cover border border-[#E7E0EE] shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#C5ADC5] to-[#B2B5E0] text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                  {initials}
                </div>
              )}

              {/* Name + username */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2A2735] truncate">{name}</p>
                {m.profile?.username ? (
                  <a
                    href={`/u/${m.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#6469AC] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    @{m.profile.username}
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                ) : (
                  <p className="text-[10px] text-[#847F95] font-medium">Collaborator</p>
                )}
              </div>

              {/* Role badge / selector */}
              {isThisOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-2.5 py-0.5 text-[10px] font-extrabold shrink-0 shadow-2xs">
                  <Crown className="h-2.5 w-2.5" /> Owner
                </span>
              ) : isOwner ? (
                <div className="relative shrink-0 flex items-center gap-1.5">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value as MemberRole)}
                    disabled={updatingId === m.user_id}
                    className="rounded-lg border border-[#E7E0EE] bg-[#FAF9FC] px-2 py-1 text-[11px] font-bold text-[#2A2735] focus:outline-none focus:ring-1 focus:ring-[#C5ADC5] cursor-pointer"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {updatingId === m.user_id && (
                    <Loader2 className="h-3 w-3 animate-spin text-[#6469AC]" />
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#F1F3FB] border border-[#DFE1F5] text-[#6469AC] px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                  {ROLE_LABELS[m.role] || m.role}
                </span>
              )}

              {/* Remove button */}
              {(isOwner && !isThisOwner) || (!isOwner && m.user_id === currentUserId) ? (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  disabled={removingId === m.user_id}
                  title={m.user_id === currentUserId ? 'Leave list' : 'Remove member'}
                  className="shrink-0 p-1.5 rounded-lg text-[#847F95] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors"
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
        <div className="px-5 py-4 border-t border-[#E7E0EE] bg-[#FAF9FC] space-y-3">
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
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#847F95] flex items-center gap-1">
              <UserPlus className="h-3 w-3 text-[#6469AC]" /> Invite by @username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="e.g. sara_travels"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 rounded-xl border border-[#E7E0EE] bg-white px-3 py-2 text-xs font-medium text-[#2A2735] focus:outline-none focus:ring-2 focus:ring-[#C5ADC5] transition-all"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                className="rounded-xl border border-[#E7E0EE] bg-white px-2.5 py-2 text-xs font-bold text-[#2A2735] focus:outline-none focus:ring-2 focus:ring-[#C5ADC5] cursor-pointer shrink-0"
              >
                <option value="editor">Editor (Can add/edit)</option>
                <option value="viewer">Viewer (View only)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting || !inviteUsername.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-2 text-xs shadow-xs transition-all active-press"
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
