import React from 'react';
import Link from 'next/link';
import { Compass, PlusCircle, User, LogOut, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-terracotta" />
          <span className="font-editorial text-xl font-bold tracking-tight text-charcoal">
            MyWanderLists
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Search className="h-4 w-4 text-stone-400" />
            <span>Explore</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Dashboard
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create List</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1 rounded-full bg-terracotta px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
