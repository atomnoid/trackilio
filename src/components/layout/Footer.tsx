import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-terracotta" />
            <span className="font-editorial text-lg font-bold text-stone-900">
              MyWanderLists
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-600">
            <Link href="/explore" className="hover:text-stone-900 transition-colors">
              Explore WanderLists
            </Link>
            <Link href="/about" className="hover:text-stone-900 transition-colors">
              About & Editorial
            </Link>
            <Link href="/auth/signup" className="hover:text-stone-900 transition-colors">
              Create an Account
            </Link>
          </div>

          <div className="text-xs text-stone-400">
            © {new Date().getFullYear()} MyWanderLists. Places worth remembering.
          </div>
        </div>
      </div>
    </footer>
  );
}
