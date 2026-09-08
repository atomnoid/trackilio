'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { Plus, Search, User, LogOut, FolderHeart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
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

    // Fetch initial user auth state
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen to real-time auth state changes (login, signup, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
    router.push('/auth/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/discover', label: 'Discover' },
    { href: '/dashboard', label: 'My Lists' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E6DFD5] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <TrackilioLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? 'text-[#4A6B5D] font-bold'
                      : 'text-[#4A4643] hover:text-[#2C2A29]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Dynamic Auth Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="p-2 text-[#78726D] hover:text-[#2C2A29] hover:bg-[#F3ECE1] rounded-xl transition-colors"
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
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0F5F2] border border-[#D5E3DC] hover:bg-[#E2EFE9] transition-colors"
                      title="User Profile & Dashboard"
                    >
                      <div className="h-6 w-6 rounded-lg bg-[#4A6B5D] text-white font-bold text-[10px] flex items-center justify-center">
                        {user.user_metadata?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold text-[#2C2A29] max-w-[100px] truncate">
                        {user.user_metadata?.display_name || user.email?.split('@')[0]}
                      </span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="p-2 text-[#78726D] hover:text-[#C87A7A] hover:bg-[#FBF0F0] rounded-xl transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ) : (
                  /* Unauthenticated Visitor Actions */
                  <Link
                    href="/auth/login"
                    className="hidden sm:inline-block text-sm font-bold text-[#4A4643] hover:text-[#2C2A29] px-3 py-2 transition-colors"
                  >
                    Log in
                  </Link>
                )}
              </>
            )}

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white px-4.5 py-2.5 text-xs font-bold shadow-2xs active-press transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              Create a list
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
