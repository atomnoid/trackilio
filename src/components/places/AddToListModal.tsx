'use client';

import React, { useState } from 'react';
import { Plus, Check, Loader2, FolderHeart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WanderList } from '@/types/database';

interface AddToListModalProps {
  placeId: string;
  placeName: string;
  currentUserId?: string;
  className?: string;
}

export function AddToListModal({
  placeId,
  placeName,
  currentUserId,
  className = '',
}: AddToListModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [lists, setLists] = useState<WanderList[]>([]);
  const [addedListIds, setAddedListIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const openModal = async () => {
    if (!currentUserId) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await (supabase as any)
        .from('wander_lists')
        .select('id, title, destination, is_public')
        .eq('owner_id', currentUserId)
        .order('created_at', { ascending: false });

      setLists((data ?? []) as WanderList[]);
    } catch {
      setError('Could not load your lists.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (listId: string) => {
    setSubmittingId(listId);
    setError(null);

    try {
      const res = await fetch('/api/places/add-to-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, placeId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAddedListIds((prev) => new Set([...prev, listId]));
      } else {
        setError(data.error || 'Failed to add place to list.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E6DFD5] hover:bg-[#F3ECE1] text-[#2C2A29] px-3.5 py-2 text-xs font-bold shadow-2xs active-press transition-colors ${className}`}
      >
        <Plus className="h-4 w-4 text-[#4A6B5D]" />
        <span>Add to List</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E6DFD5] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#F0F5F2] text-[#4A6B5D] flex items-center justify-center">
                  <FolderHeart className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-black text-[#2C2A29]">
                    Add to Collection
                  </h3>
                  <p className="text-xs text-[#78726D] font-medium truncate max-w-[240px]">
                    {placeName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#78726D] hover:bg-[#F3ECE1] transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-[#FDF2F2] border border-[#F5C2C2] p-3 text-xs text-[#9E2A2B] font-semibold">
                {error}
              </div>
            )}

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-[#78726D] flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#4A6B5D]" />
                  Loading your collections...
                </div>
              ) : lists.length > 0 ? (
                lists.map((list) => {
                  const isAdded = addedListIds.has(list.id);
                  const isSubmitting = submittingId === list.id;

                  return (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-[#EAE4D9] hover:border-[#D5E3DC] bg-[#FAF8F5] transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="text-xs font-bold text-[#2C2A29] truncate">
                          {list.title}
                        </div>
                        {list.destination && (
                          <div className="text-[10px] text-[#78726D]">
                            {list.destination}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => !isAdded && handleAdd(list.id)}
                        disabled={isAdded || isSubmitting}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-[#EBF5EE] text-[#3B594B] border border-[#CDE5D6]'
                            : 'bg-[#4A6B5D] hover:bg-[#3B594B] text-white shadow-2xs active-press'
                        }`}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs text-[#78726D]">
                    You haven&apos;t created any lists yet.
                  </p>
                  <button
                    onClick={() => router.push('/create')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6B5D] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Create your first list
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E6DFD5] flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#F3ECE1] hover:bg-[#EAE4D9] text-xs font-bold text-[#2C2A29] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
