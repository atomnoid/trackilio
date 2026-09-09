'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

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

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAE6] text-[#FF5841] text-xs font-black">
            <Edit3 className="h-3.5 w-3.5" />
            <span>List Settings</span>
          </div>
          <h2 className="font-sans text-2xl font-black text-gray-900 tracking-tight">
            Edit Guide & Itinerary
          </h2>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-sm font-black text-rose-900">
                  Are you sure you want to delete this list?
                </h4>
                <p className="text-xs text-rose-700 font-medium leading-relaxed">
                  This action cannot be undone. All places, notes, and collaborator links in this list will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Keep List
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 px-4 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>{deleting ? 'Deleting…' : 'Yes, Delete Permanently'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">List Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best Coffee & Food in Tokyo"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Destination / Region</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Curated itinerary for weekend coffee lovers..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-900">Public Discoverability</span>
                <p className="text-[11px] text-gray-500">Allow other travelers to discover this list.</p>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded accent-[#FF5841] cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-50 text-white font-black py-3 px-5 text-xs shadow-md active-press transition-all cursor-pointer"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>{loading ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
