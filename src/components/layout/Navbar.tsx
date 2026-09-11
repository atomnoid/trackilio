'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { SearchIcon, PlusIcon } from '@/components/icons/Icons';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        fetchUserProfile(data.user.id);
      }
      setLoading(false);
    });

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
    { href: '/blend', label: 'Blend' },
    { href: '/dashboard', label: 'My Lists' },
    { href: '/about', label: 'About' },
  ];

  const profileHref = username ? `/u/${username}` : user ? `/u/${user.id}` : '/dashboard';
  const nameToShow = displayName || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Profile';
  const initialChar = nameToShow.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-16 sm:h-18 flex items-center transition-all duration-200 will-change-auto ${
          scrolled
            ? 'bg-[#FAF3E1]/95 backdrop-blur-md border-b border-[#E8DECA] shadow-2xs'
            : 'bg-[#FAF3E1] border-b border-transparent'
        }`}
      >
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Brand Logo */}
            <TrackilioLogo />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
                const isActive = mounted && pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className={`transition-all duration-100 py-1.5 px-3 rounded-xl ${
                      isActive
                        ? 'text-[#222222] bg-[#F5E7C6] font-extrabold'
                        : 'text-[#6B6862] hover:text-[#222222] hover:bg-[#F5E7C6]/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions & Dynamic Auth Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#6B6862] hover:text-[#222222] hover:bg-[#F5E7C6] rounded-xl transition-colors cursor-pointer"
                title="Search Places, Lists & Travelers"
              >
                <SearchIcon className="w-4.5 h-4.5" />
              </button>

              {mounted && !loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={profileHref}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] transition-colors"
                        title="View Public Profile"
                      >
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarUrl}
                            alt={nameToShow}
                            className="h-5 w-5 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-lg bg-[#FA8112] text-white font-bold text-[10px] flex items-center justify-center">
                            {initialChar}
                          </div>
                        )}
                        <span className="hidden sm:inline text-xs font-bold text-[#222222] max-w-[100px] truncate">
                          {nameToShow}
                        </span>
                      </Link>

                      <Link
                        href="/settings"
                        className="hidden sm:inline-block px-2.5 py-1.5 text-xs font-bold text-[#6B6862] hover:text-[#222222] transition-colors"
                      >
                        Settings
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="px-2 py-1.5 text-xs font-bold text-[#6B6862] hover:text-rose-600 transition-colors"
                        title="Sign Out"
                      >
                        Exit
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="hidden sm:inline-block text-xs font-extrabold text-[#222222] hover:text-[#FA8112] px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Log in
                    </Link>
                  )}
                </>
              )}

              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] text-white px-4 py-2 text-xs font-extrabold active-press transition-colors shadow-xs"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Create</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Command Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
