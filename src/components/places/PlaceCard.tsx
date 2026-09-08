'use client';

import React, { useState } from 'react';
import { ListPlace } from '@/types/database';
import { MapPin, ExternalLink, ThumbsUp, MessageSquare, Flame, Compass, Send } from 'lucide-react';

interface CommentShape {
  id: string;
  content: string;
  created_at: string;
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
  const [hasVoted, setHasVoted] = useState(listPlace.user_has_voted ?? false);
  const [comments, setComments] = useState<CommentShape[]>((listPlace.comments ?? []) as CommentShape[]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateVote, setAnimateVote] = useState(false);

  const handleVote = async () => {
    if (!currentUserId) {
      alert('Please log in to vote on places.');
      return;
    }
    const prevCount = votesCount;
    const prevVoted = hasVoted;

    setHasVoted(!prevVoted);
    setVotesCount(prevVoted ? prevCount - 1 : prevCount + 1);
    setAnimateVote(true);
    setTimeout(() => setAnimateVote(false), 300);

    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listPlaceId: listPlace.id }),
    });

    if (!res.ok) {
      setHasVoted(prevVoted);
      setVotesCount(prevCount);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      alert('Please log in to leave a comment.');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listPlaceId: listPlace.id, content: newComment }),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (res.ok && data.comment) {
      setComments((prev) => [...prev, data.comment]);
      setNewComment('');
    } else {
      alert(data.error || 'Failed to post comment');
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

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E8E3D8] flex items-center justify-between gap-4 text-xs">
        <button
          onClick={handleVote}
          className={`inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg active-press transition-all ${
            animateVote ? 'scale-105' : ''
          } ${
            hasVoted
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'bg-[#F3EFE6] text-[#18181B] hover:bg-[#E2DAC8]'
          }`}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-white' : ''}`} />
          <span>{votesCount} Upvotes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] font-bold px-2 py-1"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{comments.length} Comments</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="pt-3 border-t border-[#E8E3D8] space-y-2.5">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="bg-[#FAF8F3] p-3 rounded-xl text-xs space-y-0.5 border border-[#E8E3D8]">
                <div className="flex items-center justify-between font-bold text-[#18181B]">
                  <span>{c.profile?.display_name || 'Traveler'}</span>
                  <span className="text-[10px] text-[#71717A] font-normal">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#3F3F46] font-medium">{c.content}</p>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-[#71717A] text-center py-1 font-medium">No comments yet. Leave a recommendation!</p>
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
