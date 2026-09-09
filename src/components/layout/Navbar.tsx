'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { Plus, Search, User, LogOut, Settings, Users, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data } = await (supabase as any)
          .from('profiles')
          .select('username, display_name, avatar_url')
          .eq('id', userId)
          .maybeSingle();

        if (data) {
          if (data.username) setUsername(data.username);
          if (data.display_name) setDisplayName(data.display_name);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      } catch {
        // Fallback to auth metadata
      }
    };

    // Fetch initial user auth state
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        fetchUserProfile(data.user.id);
      }
      setLoading(false);
    });

    // Listen to real-time auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.id);
      } else {
        setUsername(null);
        setDisplayName(null);
        setAvatarUrl(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUsername(null);
    setDisplayName(null);
    setAvatarUrl(null);
    router.push('/auth/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/discover', label: 'Discover' },
    { href: '/blend', label: '✨ Blend' },
    { href: '/dashboard', label: 'My Lists' },
    { href: '/about', label: 'About' },
  ];

  const profileHref = username ? `/u/${username}` : user ? `/u/${user.id}` : '/dashboard';
  const nameToShow = displayName || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Profile';
  const initialChar = nameToShow.charAt(0).toUpperCase();

  return (
    <header
      className={`sticky top-0 z-40 h-16 sm:h-20 flex items-center transition-colors duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100/80 shadow-xs'
          : 'bg-white/40 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <TrackilioLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all py-1.5 px-3 rounded-xl ${
                    isActive
                      ? 'text-[#FF5841] bg-[#FF5841]/10 font-bold'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Dynamic Auth Button */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/discover"
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
              title="Search Places & Lists"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            {!loading && (
              <>
                {user ? (
                  /* Authenticated User Actions */
                  <div className="flex items-center gap-2">
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#FF5841]/40 hover:bg-gray-50 transition-all shadow-2xs"
                      title="View Public Profile"
                    >
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={nameToShow}
                          className="h-6 w-6 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                          {initialChar}
                        </div>
                      )}
                      <span className="hidden sm:inline text-xs font-bold text-gray-900 max-w-[110px] truncate">
                        {nameToShow}
                      </span>
                    </Link>

                    <Link
                      href="/settings"
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                      title="Account & Profile Settings"
                    >
                      <Settings className="h-4.5 w-4.5" />
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ) : (
                  /* Unauthenticated Visitor Actions */
                  <Link
                    href="/auth/login"
                    className="hidden sm:inline-block text-sm font-bold text-gray-600 hover:text-black px-3.5 py-2 rounded-xl transition-colors"
                  >
                    Log in
                  </Link>
                )}
              </>
            )}

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5841] hover:bg-[#FF4328] text-white px-4.5 py-2.5 text-xs font-black shadow-xs active-press transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Create list</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
