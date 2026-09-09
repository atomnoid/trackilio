'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, FolderHeart, Sparkles } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/create', label: 'Create', icon: PlusCircle, isPrimary: true },
    { href: '/dashboard', label: 'My Lists', icon: FolderHeart },
    { href: '/blend', label: 'Blend', icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-1 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-1 flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-4 group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#FF5841] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active-press transition-transform">
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-black text-[#FF5841] mt-1">Create</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#FF5841] font-bold' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive ? 'scale-105 text-[#FF5841]' : ''
                }`}
              />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
