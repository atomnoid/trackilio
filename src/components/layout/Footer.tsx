import React from 'react';
import Link from 'next/link';
import { TrackilioLogo } from './TrackilioLogo';
import { MailIcon } from '@/components/icons/Icons';

export function Footer() {
  return (
    <footer className="border-t border-[#E8DECA] bg-[#FAF3E1] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E8DECA]">
          <div className="space-y-1.5 text-center md:text-left">
            <TrackilioLogo />
            <p className="text-xs text-[#6B6862] font-medium">
              Find places worth going to. Save them. Share them.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#222222]">
            <Link href="/discover" className="hover:text-[#FA8112] transition-colors">
              Discover
            </Link>
            <Link href="/blend" className="hover:text-[#FA8112] transition-colors">
              Blend
            </Link>
            <Link href="/create" className="hover:text-[#FA8112] transition-colors">
              Create List
            </Link>
            <Link href="/about" className="hover:text-[#FA8112] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#FA8112] transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-[#FA8112] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FA8112] transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6862]">
          <div>
            &copy; {new Date().getFullYear()} Trackilio. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:trackiliocontact@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#222222] hover:text-[#FA8112] font-semibold transition-colors"
            >
              <MailIcon className="w-3.5 h-3.5 text-[#6B6862]" />
              <span>trackiliocontact@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
