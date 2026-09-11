'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' },
    { href: '/create', label: 'Create', isPrimary: true },
    { href: '/dashboard', label: 'Lists' },
    { href: '/blend', label: 'Blend' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-1 bg-gradient-to-t from-[#FAF3E1] via-[#FAF3E1]/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-sm bg-[#FAF3E1] border border-[#E8DECA] rounded-2xl shadow-lg p-1.5 flex items-center justify-around">
        {links.map((link) => {
          const isActive = mounted && pathname === link.href;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-center px-4 py-2 rounded-xl bg-[#FA8112] text-white font-black text-xs active-press shadow-xs"
              >
                + Create
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                isActive ? 'text-[#FA8112] bg-[#F5E7C6]' : 'text-[#6B6862] hover:text-[#222222]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
