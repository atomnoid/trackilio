'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SearchIcon, CloseIcon, PinIcon, ListIcon, UserIcon, SpinnerIcon, ArrowRightIcon } from '@/components/icons/Icons';
import type { PlaceSearchResult, ListSearchResult, UserSearchResult } from '@/types/database';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'places' | 'lists' | 'users';

const TRENDING_QUERIES = [
  'Best cafes in Kolkata',
  'Goa hidden gems',
  'Date spots in Mumbai',
  'Tokyo ramen bars',
  'Weekend road trips',
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [lists, setLists] = useState<ListSearchResult[]>([]);
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [intentCategory, setIntentCategory] = useState<string | null>(null);
  const [intentLocation, setIntentLocation] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setPlaces([]);
      setLists([]);
      setUsers([]);
      setIntentCategory(null);
      setIntentLocation(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&type=all&limit=8`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setPlaces(data.places || []);
      setLists(data.lists || []);
      setUsers(data.users || []);
      setIntentCategory(data.intent?.category || null);
      setIntentLocation(data.intent?.location || null);
    } catch (err) {
      console.error('SearchOverlay error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchResults(val);
    }, 250);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTrendingClick = (trendingQ: string) => {
    setQuery(trendingQ);
    fetchResults(trendingQ);
  };

  if (!mounted || !isOpen) return null;

  const totalResults = places.length + lists.length + users.length;
  const hasResults = totalResults > 0;

  const showPlaces = (activeTab === 'all' || activeTab === 'places') && places.length > 0;
  const showLists = (activeTab === 'all' || activeTab === 'lists') && lists.length > 0;
  const showUsers = (activeTab === 'all' || activeTab === 'users') && users.length > 0;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(34, 34, 34, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px',
        paddingTop: 'clamp(20px, 8vh, 70px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: '#FAF3E1',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(34, 34, 34, 0.3)',
          border: '1px solid #E8DECA',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          overflow: 'hidden',
        }}
      >
        {/* Search Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8DECA', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SearchIcon className="w-5 h-5 text-[#6B6862]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search spots, coffee, food, 'best cafes in Kolkata'..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                fontWeight: 600,
                color: '#222222',
                backgroundColor: 'transparent',
              }}
            />
            {loading && <SpinnerIcon className="w-4 h-4 animate-spin text-[#FA8112]" />}
            {query && !loading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setPlaces([]);
                  setLists([]);
                  setUsers([]);
                  inputRef.current?.focus();
                }}
                style={{
                  background: '#F5E7C6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#222222',
                }}
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #E8DECA',
                borderRadius: '8px',
                padding: '3px 7px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#6B6862',
                cursor: 'pointer',
              }}
            >
              ESC
            </button>
          </form>

          {/* Smart Intent Badges */}
          {(intentCategory || intentLocation) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B6862', textTransform: 'uppercase' }}>
                Detected:
              </span>
              {intentCategory && (
                <span style={{ backgroundColor: '#F5E7C6', border: '1px solid #E8DECA', color: '#222222', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                  {intentCategory}
                </span>
              )}
              {intentLocation && (
                <span style={{ backgroundColor: '#F5E7C6', border: '1px solid #E8DECA', color: '#222222', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                  {intentLocation}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tab Filter */}
        {query.trim() && hasResults && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderBottom: '1px solid #E8DECA', backgroundColor: '#F5E7C6' }}>
            {[
              { id: 'all', label: `All (${totalResults})` },
              { id: 'places', label: `Places (${places.length})` },
              { id: 'lists', label: `Lists (${lists.length})` },
              { id: 'users', label: `People (${users.length})` },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: active ? 900 : 700,
                    color: active ? '#FFFFFF' : '#222222',
                    background: active ? '#222222' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!query.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B6862', textTransform: 'uppercase' }}>
                Popular Searches
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TRENDING_QUERIES.map((tq) => (
                  <button
                    key={tq}
                    type="button"
                    onClick={() => handleTrendingClick(tq)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#222222',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8DECA',
                      cursor: 'pointer',
                    }}
                  >
                    {tq}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults && !loading ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: '#6B6862', fontSize: '13px' }}>
              No exact matches found. Press enter to search across all public guides.
            </div>
          ) : (
            <>
              {/* Places */}
              {showPlaces && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B6862', textTransform: 'uppercase' }}>
                    Places
                  </span>
                  {places.map((place) => (
                    <Link
                      key={place.id}
                      href={`/place/${place.slug || place.id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8DECA',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#222222' }}>{place.name}</div>
                        <div style={{ fontSize: '11px', color: '#6B6862' }}>{place.city} {place.category && `• ${place.category}`}</div>
                      </div>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-[#6B6862]" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Lists */}
              {showLists && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B6862', textTransform: 'uppercase' }}>
                    Lists
                  </span>
                  {lists.map((list) => (
                    <Link
                      key={list.id}
                      href={`/l/${list.slug || list.id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8DECA',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#222222' }}>{list.title}</div>
                        <div style={{ fontSize: '11px', color: '#6B6862' }}>{list.destination || 'Travel List'} • {list.places_count || 0} places</div>
                      </div>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-[#6B6862]" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Users */}
              {showUsers && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B6862', textTransform: 'uppercase' }}>
                    People
                  </span>
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/u/${user.username || user.id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8DECA',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#222222' }}>{user.display_name || user.username}</div>
                        <div style={{ fontSize: '11px', color: '#6B6862' }}>@{user.username}</div>
                      </div>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-[#6B6862]" />
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid #E8DECA', backgroundColor: '#F5E7C6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#6B6862' }}>Press Enter to view all results</span>
            <button
              type="button"
              onClick={handleSearchSubmit}
              style={{ fontSize: '11px', fontWeight: 800, color: '#FA8112', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Open in Discover &rarr;
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
