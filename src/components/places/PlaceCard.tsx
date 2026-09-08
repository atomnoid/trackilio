'use client';

import React, { useState } from 'react';
import { ListPlace } from '@/types/database';
import { MapPin, ExternalLink, ThumbsUp, MessageSquare, Flame, Compass } from 'lucide-react';

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

  const handleVote = async () => {
    if (!currentUserId) {
      alert('Please log in to vote on places.');
      return;
    }
    const prevCount = votesCount;
    const prevVoted = hasVoted;

    setHasVoted(!prevVoted);
    setVotesCount(prevVoted ? prevCount - 1 : prevCount + 1);

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
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-semibold">
            <Flame className="h-3 w-3" /> Must Visit
          </span>
        );
      case 'want_to_visit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-medium">
            <Compass className="h-3 w-3" /> Want to Visit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 text-stone-700 px-2.5 py-0.5 text-xs">
            Maybe
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-sm hover:border-amber-200 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {getPriorityBadge(listPlace.priority)}
            {place?.category && (
              <span className="rounded-md bg-stone-100 text-stone-600 px-2 py-0.5 text-xs font-medium uppercase tracking-wider">
                {place.category}
              </span>
            )}
          </div>
          <h4 className="text-xl font-bold text-stone-900">{place?.name || 'Unnamed Place'}</h4>
          {place?.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-amber-700" />
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors self-start"
          >
            Google Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {listPlace.note && (
        <p className="mt-3 text-sm text-stone-700 italic border-l-2 border-amber-500/40 pl-3 py-1 bg-amber-50/30 rounded-r-md">
          &ldquo;{listPlace.note}&rdquo;
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-4 text-xs">
        <button
          onClick={handleVote}
          className={`inline-flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg transition-colors ${
            hasVoted
              ? 'bg-amber-100 text-amber-900 font-semibold'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-amber-700 text-amber-700' : ''}`} />
          <span>{votesCount} Upvotes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium px-2 py-1"
        >
          <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
          <span>{comments.length} Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-stone-50 p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-stone-800">
                <span>{c.profile?.display_name || 'Traveler'}</span>
                <span className="text-stone-400 font-normal">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-stone-700">{c.content}</p>
            </div>
          ))}

          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a travel tip or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-lg bg-stone-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
              >
                Comment
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
