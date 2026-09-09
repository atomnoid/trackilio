'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserPlusIcon, CloseIcon, SpinnerIcon, CheckCircleIcon, XCircleIcon } from '@/components/icons/Icons';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

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

  const modal = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          border: '1px solid #f3f4f6',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.5rem',
            borderRadius: '9999px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
            (e.currentTarget as HTMLButtonElement).style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
          }}
        >
          <CloseIcon style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        {/* Header */}
        <div style={{ paddingRight: '2rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: '#FFEAE6',
              color: '#FF5841',
              fontSize: '0.75rem',
              fontWeight: 900,
              marginBottom: '0.75rem',
            }}
          >
            <UserPlusIcon style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>List Collaboration</span>
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.025em',
              margin: '0 0 0.375rem 0',
            }}
          >
            Invite Collaborator
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            Invite friends by @username to co-curate and plan this itinerary together.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              borderRadius: '1rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              padding: '0.875rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#9f1239',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <XCircleIcon style={{ width: '1rem', height: '1rem', flexShrink: 0, color: '#dc2626' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            style={{
              borderRadius: '1rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.875rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#14532d',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircleIcon style={{ width: '1rem', height: '1rem', flexShrink: 0, color: '#16a34a' }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleInvite}>
          {/* Username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
              Traveler Username
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: '#9ca3af',
                  pointerEvents: 'none',
                }}
              >
                @
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="sara_travels"
                autoComplete="off"
                spellCheck={false}
                autoFocus
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  paddingLeft: '2rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
              Permission Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
              style={{
                width: '100%',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#111827',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
                appearance: 'auto',
              }}
            >
              <option value="editor">Editor — Can add, edit, and organize places</option>
              <option value="viewer">Viewer — Can view and explore only</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4b5563',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviting || !username.trim()}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '1rem',
                border: 'none',
                background: 'linear-gradient(to right, #FF5841, #C53678)',
                color: '#ffffff',
                fontWeight: 900,
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                boxShadow: '0 4px 12px rgba(255, 88, 65, 0.35)',
                cursor: inviting || !username.trim() ? 'not-allowed' : 'pointer',
                opacity: inviting || !username.trim() ? 0.6 : 1,
              }}
            >
              {inviting ? (
                <>
                  <SpinnerIcon style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                  <span>Inviting…</span>
                </>
              ) : (
                <>
                  <UserPlusIcon style={{ width: '1rem', height: '1rem' }} />
                  <span>Send Invite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
