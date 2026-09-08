import React from 'react';
import Link from 'next/link';
import { TrackilioLogo } from './TrackilioLogo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <TrackilioLogo />

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/explore" className="hover:text-violet-600 transition-colors">
              Explore Lists
            </Link>
            <Link href="/create" className="hover:text-violet-600 transition-colors">
              Create a List
            </Link>
            <Link href="/about" className="hover:text-violet-600 transition-colors">
              About Trackilio
            </Link>
            <Link href="/auth/signup" className="hover:text-violet-600 transition-colors">
              Sign Up
            </Link>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Trackilio. Collect places. Plan trips. Go explore.
          </div>
        </div>
      </div>
    </footer>
  );
}
