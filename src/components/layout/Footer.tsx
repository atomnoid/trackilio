import React from 'react';
import Link from 'next/link';
import { TrackilioLogo } from './TrackilioLogo';

export function Footer() {
  return (
    <footer className="border-t border-[#E8E3D8] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <TrackilioLogo />

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#3F3F46]">
            <Link href="/discover" className="hover:text-[#E0533C] transition-colors">
              Discover Lists
            </Link>
            <Link href="/create" className="hover:text-[#E0533C] transition-colors">
              Create a List
            </Link>
            <Link href="/about" className="hover:text-[#E0533C] transition-colors">
              About Trackilio
            </Link>
            <Link href="/auth/signup" className="hover:text-[#E0533C] transition-colors">
              Sign Up
            </Link>
          </div>

          <div className="text-[11px] text-[#71717A] font-medium">
            © {new Date().getFullYear()} Trackilio. Collect places. Plan trips. Go explore.
          </div>
        </div>
      </div>
    </footer>
  );
}
