'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, FolderHeart, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/create', label: 'Create', icon: PlusCircle, isPrimary: true },
    { href: '/dashboard', label: 'My Lists', icon: FolderHeart },
    { href: '/settings', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-1 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="h-13 w-13 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/40 group-hover:scale-105 active-press transition-transform">
                  <Icon className="h-7 w-7 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-violet-700 mt-1">Create</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-violet-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive ? 'scale-110 text-violet-600' : ''
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
