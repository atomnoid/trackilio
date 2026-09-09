'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { EditIcon, TrashIcon, CloseIcon, SpinnerIcon, AlertTriangleIcon } from '@/components/icons/Icons';

interface EditListModalProps {
  listId: string;
  initialTitle: string;
  initialDescription?: string | null;
  initialDestination?: string | null;
  initialIsPublic: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditListModal({
  listId,
  initialTitle,
  initialDescription = '',
  initialDestination = '',
  initialIsPublic,
  isOpen,
  onClose,
  onSuccess,
}: EditListModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || '');
  const [destination, setDestination] = useState(initialDestination || '');
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/lists/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          title: title.trim(),
          description: description.trim(),
          destination: destination.trim(),
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update list.');
      } else {
        if (onSuccess) onSuccess();
        onClose();
        router.refresh();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch('/api/lists/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete list.');
        setDeleting(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Network error while deleting.');
      setDeleting(false);
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
          maxWidth: '32rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          border: '1px solid #f3f4f6',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            <EditIcon style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>List Settings</span>
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            Edit Guide &amp; Itinerary
          </h2>
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
            }}
          >
            {error}
          </div>
        )}

        {showDeleteConfirm ? (
          <div
            style={{
              borderRadius: '1rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertTriangleIcon style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626', flexShrink: 0, marginTop: '0.125rem' }} />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 900, color: '#7f1d1d', margin: '0 0 0.25rem 0' }}>
                  Are you sure you want to delete this list?
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: 0, lineHeight: 1.6 }}>
                  This action cannot be undone. All places, notes, and collaborator links will be permanently removed.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '0.625rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #fecdd3',
                  backgroundColor: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Keep List
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  padding: '0.625rem 1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? <SpinnerIcon style={{ width: '0.875rem', height: '0.875rem', animation: 'spin 1s linear infinite' }} /> : <TrashIcon style={{ width: '0.875rem', height: '0.875rem' }} />}
                <span>{deleting ? 'Deleting…' : 'Yes, Delete Permanently'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            {/* Title */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                List Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best Coffee & Food in Tokyo"
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Destination */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                Destination / Region
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Curated itinerary for weekend coffee lovers..."
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  padding: '0.75rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#111827',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Public toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem',
                borderRadius: '1rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', display: 'block' }}>Public Discoverability</span>
                <p style={{ fontSize: '0.6875rem', color: '#6b7280', margin: 0 }}>Allow other travelers to discover this list.</p>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ width: '1rem', height: '1rem', cursor: 'pointer', accentColor: '#FF5841' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.75rem 0.875rem',
                  borderRadius: '1rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                <span>Delete</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
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
                  disabled={loading || !title.trim()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderRadius: '1rem',
                    border: 'none',
                    background: 'linear-gradient(to right, #FF5841, #C53678)',
                    color: '#ffffff',
                    fontWeight: 900,
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 12px rgba(255, 88, 65, 0.35)',
                    cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !title.trim() ? 0.6 : 1,
                  }}
                >
                  {loading ? <SpinnerIcon style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} /> : null}
                  <span>{loading ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
