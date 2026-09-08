'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { Compass, Plus, Search, User, FolderHeart, Info } from 'lucide-react';
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
    { href: '/discover', label: 'Discover' },
    { href: '/dashboard', label: 'My Lists' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#E8E3D8] py-3'
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
                      ? 'text-[#E0533C] font-bold'
                      : 'text-[#3F3F46] hover:text-[#18181B]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] rounded-xl transition-colors"
              title="Search Places & Lists"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-sm font-bold text-[#3F3F46] hover:text-[#18181B] px-3 py-2 transition-colors"
            >
              Log in
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] hover:bg-[#C8422C] text-white px-4.5 py-2.5 text-xs font-bold shadow-sm active-press transition-all"
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
