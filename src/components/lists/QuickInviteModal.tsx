'use client';

import React, { useState } from 'react';
import { UserPlus, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { sanitizeUsername } from '@/lib/username';

interface QuickInviteModalProps {
  listId: string;
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess?: () => void;
}

export function QuickInviteModal({
  listId,
  isOpen,
  onClose,
  onInviteSuccess,
}: QuickInviteModalProps) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeUsername(username);
    if (!cleanUser) return;

    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, username: cleanUser, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to invite member.');
      } else {
        setSuccess(`@${data.member.username || cleanUser} added as ${role}!`);
        setUsername('');
        if (onInviteSuccess) onInviteSuccess();
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1500);
      }
    } catch {
      setError('Network error occurred.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#EFE9EC] p-6 sm:p-8 shadow-xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#7E7890] hover:text-[#1A1723] hover:bg-[#F6F4F8] rounded-xl transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAE6] text-[#FF5841] text-xs font-bold">
            <UserPlus className="h-3.5 w-3.5" />
            <span>List Collaboration</span>
          </div>
          <h2 className="font-sans text-xl font-black text-[#1A1723]">Invite Collaborator</h2>
          <p className="text-xs text-[#4F4B5E] font-medium">
            Collaborate on this trip in real-time. Invite any traveler by @username.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A1723]">Traveler Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sara_travels"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-2xl border border-[#EFE9EC] bg-[#FAFAFC] px-4 py-3 text-sm font-medium text-[#1A1723] focus:outline-none focus:ring-2 focus:ring-[#FF5841] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A1723]">Permission Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
              className="w-full rounded-2xl border border-[#EFE9EC] bg-[#FAFAFC] px-4 py-3 text-xs font-bold text-[#1A1723] focus:outline-none focus:ring-2 focus:ring-[#FF5841] cursor-pointer"
            >
              <option value="editor">Editor — Can add, edit, and organize places</option>
              <option value="viewer">Viewer — Can view, upvote, and comment only</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-[#EFE9EC] text-xs font-bold text-[#4F4B5E] hover:bg-[#F6F4F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviting || !username.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-50 text-white font-extrabold py-3 px-4 text-xs shadow-xs active-press transition-all"
            >
              {inviting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Inviting…</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Send Invite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
