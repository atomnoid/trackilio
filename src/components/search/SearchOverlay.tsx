'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Search, X, MapPin, Layers, User, Sparkles, ArrowRight, Loader2, Compass } from 'lucide-react';
import type { PlaceSearchResult, ListSearchResult, UserSearchResult } from '@/types/database';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'places' | 'lists' | 'users';

const TRENDING_QUERIES = [
  'Best cafes in Kolkata',
  'Goa hidden gems',
  'Romantic date spots',
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

  // Handle ESC key and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus input on open
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  // Fetch search results debounced
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px',
        paddingTop: 'clamp(20px, 8vh, 80px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh',
          overflow: 'hidden',
        }}
      >
        {/* Search Header Input */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search style={{ width: '20px', height: '20px', color: '#94A3B8', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search places, lists, travelers, or 'best cafes in Kolkata'..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                fontWeight: 500,
                color: '#0F172A',
                backgroundColor: 'transparent',
              }}
            />
            {loading && <Loader2 style={{ width: '18px', height: '18px', color: '#FF5841', animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
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
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              ESC
            </button>
          </form>

          {/* Smart Intent Badges */}
          {(intentCategory || intentLocation) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Detected Intent:
              </span>
              {intentCategory && (
                <span
                  style={{
                    backgroundColor: '#FFEAE6',
                    border: '1px solid #FFD3CC',
                    color: '#FF5841',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '8px',
                  }}
                >
                  Category: {intentCategory}
                </span>
              )}
              {intentLocation && (
                <span
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '8px',
                  }}
                >
                  Location: {intentLocation}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tab Filter Bar (When query exists) */}
        {query.trim() && hasResults && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderBottom: '1px solid #F8FAFC',
              backgroundColor: '#FDFEFE',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'all', label: `All (${totalResults})` },
              { id: 'places', label: `Places (${places.length})` },
              { id: 'lists', label: `Lists (${lists.length})` },
              { id: 'users', label: `Travelers (${users.length})` },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: active ? 800 : 600,
                    color: active ? '#FFFFFF' : '#64748B',
                    background: active ? 'linear-gradient(to right, #FF5841, #C53678)' : 'transparent',
                    border: active ? 'none' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results / Empty / Trending Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!query.trim() ? (
            /* Trending Searches Default View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: '15px', height: '15px', color: '#FF5841' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Trending Searches
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TRENDING_QUERIES.map((tq) => (
                  <button
                    key={tq}
                    type="button"
                    onClick={() => handleTrendingClick(tq)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF5841';
                      e.currentTarget.style.color = '#FF5841';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.color = '#1E293B';
                    }}
                  >
                    <Search style={{ width: '12px', height: '12px', color: '#94A3B8' }} />
                    {tq}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults && !loading ? (
            /* No Results Found */
            <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: '#FFEAE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF5841',
                }}
              >
                <Compass style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>No exact matches found</h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Try searching on the full discover page with broader terms.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSearchSubmit}
                style={{
                  marginTop: '6px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, #FF5841, #C53678)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Search on Discover Page &rarr;
              </button>
            </div>
          ) : (
            /* Results Display */
            <>
              {/* Places Section */}
              {showPlaces && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Places & Spots
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {places.map((place) => (
                      <Link
                        key={place.id}
                        href={`/place/${place.slug || place.id}`}
                        onClick={onClose}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '14px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFF5F3';
                          e.currentTarget.style.borderColor = '#FFD3CC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#F1F5F9';
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: '#FFEAE6',
                            color: '#FF5841',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <MapPin style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {place.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            {place.city && <span>{place.city}</span>}
                            {place.city && place.category && <span>•</span>}
                            {place.category && <span style={{ textTransform: 'capitalize' }}>{place.category}</span>}
                            {(place.upvotes_count || 0) > 0 && (
                              <>
                                <span>•</span>
                                <span style={{ color: '#FF5841', fontWeight: 700 }}>▲ {place.upvotes_count}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Lists Section */}
              {showLists && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Curated Lists
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {lists.map((list) => (
                      <Link
                        key={list.id}
                        href={`/l/${list.slug || list.id}`}
                        onClick={onClose}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '14px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FDF2F8';
                          e.currentTarget.style.borderColor = '#FBCFE8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#F1F5F9';
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: '#FCE7F3',
                            color: '#C53678',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Layers style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {list.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            {list.creator && <span>by @{list.creator.username || list.creator.display_name}</span>}
                            {list.destination && (
                              <>
                                <span>•</span>
                                <span>{list.destination}</span>
                              </>
                            )}
                            {(list.places_count || 0) > 0 && (
                              <>
                                <span>•</span>
                                <span>{list.places_count} places</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Section */}
              {showUsers && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Travelers & Creators
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/u/${user.username || user.id}`}
                        onClick={onClose}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '14px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F0FDF4';
                          e.currentTarget.style.borderColor = '#BBF7D0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#F1F5F9';
                        }}
                      >
                        {user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar_url}
                            alt={user.display_name || user.username}
                            style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: 'linear-gradient(to bottom right, #FF5841, #C53678)',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {(user.display_name || user.username || 'T').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.display_name || user.username}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span>@{user.username}</span>
                            {(user.followers_count || 0) > 0 && (
                              <>
                                <span>•</span>
                                <span>{user.followers_count} followers</span>
                              </>
                            )}
                            {(user.public_lists_count || 0) > 0 && (
                              <>
                                <span>•</span>
                                <span>{user.public_lists_count} lists</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {query.trim() && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #F1F5F9',
              backgroundColor: '#FAFAFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Press <kbd style={{ background: '#E2E8F0', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>Enter</kbd> to see all results
            </span>
            <button
              type="button"
              onClick={handleSearchSubmit}
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#FF5841',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View on Discover <ArrowRight style={{ width: '12px', height: '12px' }} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
