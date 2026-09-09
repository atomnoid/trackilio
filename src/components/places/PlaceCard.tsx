'use client';

import React, { useState } from 'react';
import { ListPlace, VoteType } from '@/types/database';
import {
  MapPin,
  ExternalLink,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Flame,
  Compass,
  Send,
  Trash2,
} from 'lucide-react';

interface CommentShape {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  profile?: { display_name?: string } | null;
}

interface PlaceCardProps {
  listPlace: ListPlace;
  currentUserId?: string;
  canEdit?: boolean;
}

export function PlaceCard({ listPlace, currentUserId }: PlaceCardProps) {
  const place = listPlace.place;
  const [votesCount, setVotesCount] = useState(listPlace.votes_count ?? 0);
  const [userVote, setUserVote] = useState<VoteType | null>(
    listPlace.user_vote_type ?? (listPlace.user_has_voted ? 'up' : null)
  );
  const [comments, setComments] = useState<CommentShape[]>(
    (listPlace.comments ?? []) as CommentShape[]
  );
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [animateVote, setAnimateVote] = useState<'up' | 'down' | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const handleVote = async (targetType: VoteType) => {
    if (!currentUserId) {
      setVoteError('Please log in to vote on places.');
      setTimeout(() => setVoteError(null), 3000);
      return;
    }

    setVoteError(null);
    const prevVote = userVote;
    const prevCount = votesCount;

    let nextVote: VoteType | null = null;
    let nextCount = prevCount;

    if (prevVote === targetType) {
      // Toggle off
      nextVote = null;
      nextCount = targetType === 'up' ? prevCount - 1 : prevCount + 1;
    } else if (prevVote === null) {
      // New vote
      nextVote = targetType;
      nextCount = targetType === 'up' ? prevCount + 1 : prevCount - 1;
    } else {
      // Switch vote (up → down or down → up)
      nextVote = targetType;
      nextCount = targetType === 'up' ? prevCount + 2 : prevCount - 2;
    }

    setUserVote(nextVote);
    setVotesCount(nextCount);
    setAnimateVote(targetType);
    setTimeout(() => setAnimateVote(null), 300);

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listPlaceId: listPlace.id, voteType: targetType }),
      });

      if (!res.ok) {
        setUserVote(prevVote);
        setVotesCount(prevCount);
        setVoteError('Vote failed. Please try again.');
        setTimeout(() => setVoteError(null), 3000);
      }
    } catch {
      setUserVote(prevVote);
      setVotesCount(prevCount);
      setVoteError('Network error. Please try again.');
      setTimeout(() => setVoteError(null), 3000);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      setCommentError('Please log in to leave a comment.');
      setTimeout(() => setCommentError(null), 3000);
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setCommentError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listPlaceId: listPlace.id, content: newComment }),
      });
      const data = await res.json();

      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment('');
      } else {
        setCommentError(data.error || 'Failed to post comment. Please try again.');
      }
    } catch {
      setCommentError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (deletingCommentId) return; // Prevent duplicate delete

    const prevComments = comments;
    // Optimistic remove
    setDeletingCommentId(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        // Rollback
        setComments(prevComments);
        setCommentError('Could not delete comment. Please try again.');
        setTimeout(() => setCommentError(null), 3000);
      }
    } catch {
      setComments(prevComments);
      setCommentError('Network error. Please try again.');
      setTimeout(() => setCommentError(null), 3000);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'must_visit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF3F1] text-[#E0533C] px-2.5 py-0.5 text-[11px] font-extrabold border border-[#F0D5D5]">
            <Flame className="h-3 w-3 fill-[#E0533C]" /> Must Visit
          </span>
        );
      case 'want_to_visit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold border border-amber-200">
            <Compass className="h-3 w-3" /> Want to Visit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-[#71717A] px-2.5 py-0.5 text-[11px] font-bold">
            Maybe
          </span>
        );
    }
  };

  return (
    <div className="editorial-card p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {getPriorityBadge(listPlace.priority)}
            {place?.category && (
              <span className="rounded-md bg-[#F3EFE6] text-[#18181B] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                {place.category}
              </span>
            )}
          </div>

          <h4 className="font-sans text-xl font-extrabold text-[#18181B]">
            {place?.name || 'Unnamed Place'}
          </h4>

          {place?.location && (
            <p className="flex items-center gap-1 text-xs text-[#71717A] font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#E0533C]" />
              {place.location}
              {place.country ? `, ${place.country}` : ''}
            </p>
          )}
        </div>

        {place?.maps_url && (
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#E8E3D8] bg-[#FAF8F3] px-3 py-1.5 text-xs font-bold text-[#18181B] hover:border-[#18181B] active-press transition-colors self-start shrink-0"
          >
            Open in Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {listPlace.note && (
        <p className="text-xs text-[#18181B] font-medium italic border-l-2 border-[#E0533C] pl-3 py-1 bg-[#FDF3F1]/60 rounded-r-md">
          &ldquo;{listPlace.note}&rdquo;
        </p>
      )}

      {/* Vote error message */}
      {voteError && (
        <p className="text-[11px] text-[#E0533C] font-bold bg-[#FDF3F1] border border-[#F0D5D5] rounded-lg px-3 py-1.5">
          {voteError}
        </p>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E8E3D8] flex items-center justify-between gap-4 text-xs">
        <div className="inline-flex items-center rounded-xl bg-[#F5F1E8] border border-[#E6DFD5] p-0.5 shadow-2xs">
          {/* Upvote Button */}
          <button
            onClick={() => handleVote('up')}
            title="Upvote this spot"
            aria-label="Upvote"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold transition-all active-press ${
              userVote === 'up'
                ? 'bg-[#FF5841] text-white shadow-xs'
                : 'text-gray-500 hover:text-[#FF5841] hover:bg-white/60'
            } ${animateVote === 'up' ? 'scale-110' : ''}`}
          >
            <ArrowBigUp className={`h-4 w-4 ${userVote === 'up' ? 'fill-current' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Upvote</span>
          </button>

          {/* Net Score */}
          <span
            className={`px-2 py-1 font-mono font-black text-xs ${
              votesCount > 0
                ? 'text-[#FF5841]'
                : votesCount < 0
                ? 'text-[#E0533C]'
                : 'text-gray-400'
            }`}
          >
            {votesCount > 0 ? `+${votesCount}` : votesCount}
          </span>

          {/* Downvote Button */}
          <button
            onClick={() => handleVote('down')}
            title="Downvote this spot"
            aria-label="Downvote"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold transition-all active-press ${
              userVote === 'down'
                ? 'bg-[#E0533C] text-white shadow-xs'
                : 'text-[#5C5652] hover:text-[#E0533C] hover:bg-white/60'
            } ${animateVote === 'down' ? 'scale-110' : ''}`}
          >
            <ArrowBigDown className={`h-4 w-4 ${userVote === 'down' ? 'fill-current' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Downvote</span>
          </button>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-bold px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="pt-3 border-t border-[#E8E3D8] space-y-2.5">
          {comments.length > 0 ? (
            comments.map((c) => {
              const isOwn = currentUserId && c.user_id === currentUserId;
              return (
                <div
                  key={c.id}
                  className={`bg-[#FAF8F3] p-3 rounded-xl text-xs space-y-0.5 border border-[#E8E3D8] transition-opacity ${
                    deletingCommentId === c.id ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center justify-between flex-1 font-bold text-[#18181B]">
                      <span>{c.profile?.display_name || 'Traveler'}</span>
                      <span className="text-[10px] text-[#71717A] font-normal">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {isOwn && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        disabled={deletingCommentId === c.id}
                        title="Delete your comment"
                        aria-label="Delete comment"
                        className="shrink-0 p-1 rounded-md text-[#C09090] hover:text-[#E0533C] hover:bg-[#FDF3F1] disabled:opacity-40 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-[#3F3F46] font-medium">{c.content}</p>
                </div>
              );
            })
          ) : (
            <p className="text-[11px] text-[#71717A] text-center py-1 font-medium">
              No comments yet. Leave a recommendation!
            </p>
          )}

          {/* Comment error */}
          {commentError && (
            <p className="text-[11px] text-[#E0533C] font-bold bg-[#FDF3F1] border border-[#F0D5D5] rounded-lg px-3 py-1.5">
              {commentError}
            </p>
          )}

          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add a travel tip or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-3.5 py-1.5 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-xl bg-[#18181B] text-white p-2 text-xs font-bold hover:bg-[#C8422C] disabled:opacity-50 active-press transition-colors shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
