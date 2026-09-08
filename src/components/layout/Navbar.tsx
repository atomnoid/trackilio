'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { Compass, Plus, Search, User, FolderHeart } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/dashboard', label: 'My Lists', icon: FolderHeart },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-violet-100/60 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <TrackilioLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-full px-3 py-1.5 shadow-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50/80'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Search trigger */}
            <Link
              href="/explore"
              className="p-2.5 rounded-full text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              title="Search Places & Lists"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Create List CTA Button */}
            <Link
              href="/create"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 hover:scale-[1.02] active-press transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Create List
            </Link>

            {/* Profile Avatar link */}
            <Link
              href="/dashboard"
              className="relative p-1 rounded-full border-2 border-violet-200 hover:border-violet-600 transition-colors"
              title="User Profile & Dashboard"
            >
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
                <User className="h-4 w-4 text-violet-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
