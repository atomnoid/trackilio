'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackilioLogo } from './TrackilioLogo';
import { Plus, Search } from 'lucide-react';
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

          {/* Actions & CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="p-2 text-[#78726D] hover:text-[#2C2A29] hover:bg-[#F3ECE1] rounded-xl transition-colors"
              title="Search Places & Lists"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-sm font-bold text-[#4A4643] hover:text-[#2C2A29] px-3 py-2 transition-colors"
            >
              Log in
            </Link>

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
