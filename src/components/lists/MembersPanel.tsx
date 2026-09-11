'use client';

import React, { useState } from 'react';
import { MemberRole } from '@/types/database';
import {
  UserPlusIcon,
  TrashIcon,
  SpinnerIcon,
  UsersIcon,
  CrownIcon,
  ExternalLinkIcon,
  LinkIcon,
  CheckIcon,
  CopyIcon,
} from '@/components/icons/Icons';

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
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isOwner = currentUserId === ownerId;

  const handleGenerateLink = async () => {
    setGenerating(true);
    setInviteError(null);
    setInviteUrl(null);
    setCopied(false);
    try {
      const res = await fetch('/api/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.error || 'Failed to generate invite link.');
      } else {
        setInviteUrl(data.url);
      }
    } catch {
      setInviteError('Network error. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silent
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
    <div className="rounded-3xl bg-white border border-[#E8DECA] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8DECA] bg-[#FAF3E1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-[#FA8112]" />
          <h3 className="font-sans text-sm font-black text-[#222222]">
            Collaborators ({members.length})
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#6B6862]">Shared Itinerary</span>
      </div>

      {/* Member List */}
      <ul className="divide-y divide-[#E8DECA]/50">
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
                  className="h-8 w-8 rounded-xl object-cover border border-[#E8DECA] shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-[#222222] text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                  {initials}
                </div>
              )}

              {/* Name + username */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#222222] truncate">{name}</p>
                {m.profile?.username ? (
                  <a
                    href={`/u/${m.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#FA8112] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    @{m.profile.username}
                    <ExternalLinkIcon className="h-2.5 w-2.5 opacity-60" />
                  </a>
                ) : (
                  <p className="text-[10px] text-[#6B6862] font-medium">Collaborator</p>
                )}
              </div>

              {/* Role badge / selector */}
              {isThisOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#222222] text-white px-2.5 py-0.5 text-[10px] font-extrabold shrink-0 shadow-xs">
                  <CrownIcon className="h-2.5 w-2.5 text-[#FA8112]" /> Owner
                </span>
              ) : isOwner ? (
                <div className="relative shrink-0 flex items-center gap-1.5">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value as MemberRole)}
                    disabled={updatingId === m.user_id}
                    className="rounded-lg border border-[#E8DECA] bg-[#FAF3E1]/60 px-2 py-1 text-[11px] font-bold text-[#222222] focus:outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {updatingId === m.user_id && (
                    <SpinnerIcon className="h-3 w-3 animate-spin text-[#FA8112]" />
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#F5E7C6] border border-[#E8DECA] text-[#222222] px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                  {ROLE_LABELS[m.role] || m.role}
                </span>
              )}

              {/* Remove button */}
              {(isOwner && !isThisOwner) || (!isOwner && m.user_id === currentUserId) ? (
                <button
                  onClick={() => handleRemove(m.user_id)}
                  disabled={removingId === m.user_id}
                  title={m.user_id === currentUserId ? 'Leave list' : 'Remove member'}
                  className="shrink-0 p-1.5 rounded-lg text-[#6B6862] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors cursor-pointer"
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
        <div className="px-5 py-4 border-t border-[#E8DECA] bg-[#FAF3E1]/40 space-y-3">
          {inviteError && (
            <p className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {inviteError}
            </p>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6862] flex items-center gap-1">
              <LinkIcon className="h-3 w-3 text-[#FA8112]" /> 1-Click Invite Link
            </label>

            {inviteUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="flex-1 min-w-0 rounded-xl border border-[#E8DECA] bg-white px-3 py-2 text-[10px] font-mono text-[#222222] focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-bold px-3 py-2 text-[11px] transition-colors cursor-pointer"
                  >
                    {copied ? <CheckIcon className="h-3 w-3 text-[#FA8112]" /> : <CopyIcon className="h-3 w-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#6B6862] font-medium">Valid for 7 days · Anyone with link can join</p>
                <button
                  onClick={() => {
                    setInviteUrl(null);
                    setInviteError(null);
                  }}
                  className="text-[10px] font-bold text-[#FA8112] hover:underline cursor-pointer"
                >
                  Generate another link
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="rounded-xl border border-[#E8DECA] bg-white px-2.5 py-2 text-xs font-bold text-[#222222] focus:outline-none focus:border-[#222222] cursor-pointer shrink-0"
                >
                  <option value="editor">Editor (Can add/edit)</option>
                  <option value="viewer">Viewer (View only)</option>
                </select>
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={generating}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#222222] hover:bg-[#FA8112] disabled:opacity-50 text-white font-extrabold py-2 text-xs shadow-xs transition-all active-press cursor-pointer"
                >
                  {generating ? (
                    <>
                      <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-[#FA8112]" />
                      <span>Generating…</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-3.5 w-3.5 text-[#FA8112]" />
                      <span>Get Invite Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
