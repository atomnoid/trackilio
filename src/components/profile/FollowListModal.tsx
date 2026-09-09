'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CloseIcon, SpinnerIcon } from '@/components/icons/Icons';
import type { Profile } from '@/types/database';

interface FollowListModalProps {
  userId: string;
  type: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
  titleName?: string;
}

export function FollowListModal({
  userId,
  type,
  isOpen,
  onClose,
  titleName = 'Traveler',
}: FollowListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !userId) return;

    setLoading(true);
    fetch(`/api/follows?userId=${encodeURIComponent(userId)}&type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data.profiles || []);
      })
      .catch((err) => {
        console.error('Failed to fetch follow list:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, userId, type]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const title = type === 'followers' ? 'Followers' : 'Following';

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(34, 34, 34, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FAF3E1',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(34, 34, 34, 0.2)',
          border: '1px solid #E8DECA',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8DECA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F5E7C6',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#222222', margin: 0 }}>
              {title}
            </h3>
            <p style={{ fontSize: '11px', color: '#6B6862', margin: '2px 0 0 0' }}>
              {titleName}&apos;s {title.toLowerCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#FAF3E1',
              border: '1px solid #E8DECA',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#222222',
            }}
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '14px 16px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {loading ? (
            <div style={{ padding: '36px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SpinnerIcon className="w-6 h-6 animate-spin text-[#FA8112]" />
            </div>
          ) : profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6B6862', fontSize: '13px' }}>
              {type === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
            </div>
          ) : (
            profiles.map((p) => {
              const name = p.display_name || p.username || 'Traveler';
              const initial = name.charAt(0).toUpperCase();

              return (
                <Link
                  key={p.id}
                  href={`/u/${p.username || p.id}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8DECA',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5E7C6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {p.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.avatar_url}
                      alt={name}
                      style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#222222',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {initial}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#222222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name}
                    </div>
                    {p.username && (
                      <div style={{ fontSize: '11px', color: '#6B6862' }}>
                        @{p.username}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
