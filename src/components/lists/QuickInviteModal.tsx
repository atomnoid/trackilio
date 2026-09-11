'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlusIcon,
  CloseIcon,
  SpinnerIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  AtSignIcon,
  CopyIcon,
  CheckIcon,
} from '@/components/icons/Icons';
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
  const [activeTab, setActiveTab] = useState<'link' | 'username'>('link');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');

  // Link Invite State
  const [generatingLink, setGeneratingLink] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Username Invite State
  const [username, setUsername] = useState('');
  const [invitingUser, setInvitingUser] = useState(false);

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setSuccess(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError(null);
    setInviteUrl(null);
    setCopied(false);

    try {
      const res = await fetch('/api/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate invite link.');
      } else {
        setInviteUrl(data.url);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeUsername(username);
    if (!cleanUser) return;

    setInvitingUser(true);
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
      setInvitingUser(false);
    }
  };

  const whatsappUrl = inviteUrl
    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
        'Join my travel list on Trackilio to plan and save places together!'
      )}%20${encodeURIComponent(inviteUrl)}`
    : '';

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E8DECA] p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6B6862] hover:text-[#222222] hover:bg-[#FAF3E1] transition-colors cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-3.5 py-1 text-xs font-black text-[#222222]">
            <UserPlusIcon className="w-3.5 h-3.5 text-[#FA8112]" />
            <span>List Collaboration</span>
          </div>
          <h2 className="font-sans text-2xl font-black text-[#222222] tracking-tight">
            Invite Collaborators
          </h2>
          <p className="text-xs text-[#6B6862] leading-relaxed">
            Invite friends to co-curate places, build itineraries, and vote on must-visit spots.
          </p>
        </div>

        {/* Tabs: Link vs Username */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF3E1] border border-[#E8DECA] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('link');
              setError(null);
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-[#222222] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#222222]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#FA8112]" />
            <span>1-Click Invite Link</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('username');
              setError(null);
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'username'
                ? 'bg-[#222222] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#222222]'
            }`}
          >
            <AtSignIcon className="w-3.5 h-3.5" />
            <span>Invite by @Username</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800 flex items-center gap-2">
            <XCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#222222]">
            Collaborator Permission Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('editor')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'editor'
                  ? 'border-[#222222] bg-[#FAF3E1]'
                  : 'border-[#E8DECA] bg-white hover:border-[#222222]'
              }`}
            >
              <div className="text-xs font-black text-[#222222]">Editor</div>
              <div className="text-[11px] text-[#6B6862] leading-tight mt-0.5">
                Can add, edit &amp; organize places
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'viewer'
                  ? 'border-[#222222] bg-[#FAF3E1]'
                  : 'border-[#E8DECA] bg-white hover:border-[#222222]'
              }`}
            >
              <div className="text-xs font-black text-[#222222]">Viewer</div>
              <div className="text-[11px] text-[#6B6862] leading-tight mt-0.5">
                Can view and vote only
              </div>
            </button>
          </div>
        </div>

        {/* TAB 1: 1-Click Link Generator */}
        <AnimatePresence mode="wait">
          {activeTab === 'link' && (
            <motion.div
              key="link-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4 pt-1"
            >
              {inviteUrl ? (
                <div className="rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-[#222222]">
                    <CheckIcon className="w-4 h-4 text-[#FA8112]" />
                    <span>Collaborator Invite Link Ready!</span>
                  </div>

                  <p className="text-xs text-[#6B6862] leading-relaxed">
                    Send this link to anyone. Opening it adds them directly as an{' '}
                    <strong>{role}</strong> to this list.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteUrl}
                      className="flex-1 min-w-0 rounded-xl border border-[#E8DECA] bg-white px-3.5 py-2.5 text-xs font-mono text-[#222222] focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-4 py-2.5 text-xs shadow-xs active-press transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? <CheckIcon className="w-3.5 h-3.5 text-[#FA8112]" /> : <CopyIcon className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E8DECA]/60">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#2E7D32] hover:underline"
                    >
                      💬 Share via WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setInviteUrl(null);
                        setError(null);
                      }}
                      className="font-bold text-[#FA8112] hover:underline cursor-pointer"
                    >
                      Generate another link
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={generatingLink}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-black py-3.5 text-xs shadow-xs active-press transition-all cursor-pointer disabled:opacity-50"
                >
                  {generatingLink ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 animate-spin text-[#FA8112]" />
                      <span>Generating Unique Invite Link…</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 text-[#FA8112]" />
                      <span>Generate {role === 'editor' ? 'Editor' : 'Viewer'} Invite Link</span>
                    </>
                  )}
                </button>
              )}
            </motion.div>
          )}

          {/* TAB 2: Direct Username Invite */}
          {activeTab === 'username' && (
            <motion.form
              key="user-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onSubmit={handleInviteUser}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#222222]">
                  Traveler @Username
                </label>
                <div className="relative">
                  <AtSignIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FA8112]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. sara_travels"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={invitingUser}
                    className="w-full rounded-2xl border border-[#E8DECA] bg-[#FAF3E1]/50 pl-10 pr-4 py-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={invitingUser || !username.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-black py-3.5 text-xs shadow-xs active-press transition-all cursor-pointer disabled:opacity-50"
              >
                {invitingUser ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 animate-spin text-[#FA8112]" />
                    <span>Adding Collaborator…</span>
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="w-4 h-4 text-[#FA8112]" />
                    <span>Add @{username.trim() || 'user'} as {role}</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}
