'use client';

import React, { useState } from 'react';
import { ListPlace } from '@/types/database';
import { MapPin, ExternalLink, ThumbsUp, MessageSquare, Flame, Compass, Sparkles, Send } from 'lucide-react';

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
    setTimeout(() => setAnimateVote(false), 400);

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 px-3 py-0.5 text-xs font-extrabold">
            <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> Must Visit
          </span>
        );
      case 'want_to_visit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 text-violet-700 border border-violet-500/20 px-3 py-0.5 text-xs font-extrabold">
            <Compass className="h-3.5 w-3.5 text-violet-600" /> Want to Visit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 px-3 py-0.5 text-xs font-semibold">
            Maybe
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 card-tactile transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {getPriorityBadge(listPlace.priority)}
            {place?.category && (
              <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider">
                {place.category}
              </span>
            )}
          </div>

          <h4 className="font-display text-2xl font-black text-slate-900">
            {place?.name || 'Unnamed Place'}
          </h4>

          {place?.location && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
              <MapPin className="h-4 w-4 text-violet-600" />
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
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-violet-200 bg-violet-50/50 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 active-press transition-all self-start shrink-0"
          >
            Open in Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {listPlace.note && (
        <p className="mt-4 text-xs text-slate-700 font-medium italic border-l-4 border-violet-500/60 pl-3 py-1.5 bg-violet-50/40 rounded-r-xl">
          &ldquo;{listPlace.note}&rdquo;
        </p>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
        <button
          onClick={handleVote}
          className={`inline-flex items-center gap-2 font-extrabold px-4 py-2 rounded-full active-press transition-all ${
            animateVote ? 'scale-115' : ''
          } ${
            hasVoted
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-white text-white' : ''}`} />
          <span>{votesCount} Upvotes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 font-bold px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <MessageSquare className="h-4 w-4 text-slate-400" />
          <span>{comments.length} Comments</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1 border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{c.profile?.display_name || 'Traveler'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{c.content}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2 font-medium">No comments yet. Leave the first tip!</p>
          )}

          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a tip or recommendation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-full bg-violet-600 text-white p-2 text-xs font-bold hover:bg-violet-700 disabled:opacity-50 active-press transition-colors shadow-md shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
