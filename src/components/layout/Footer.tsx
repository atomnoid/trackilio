import React from 'react';
import Link from 'next/link';
import { TrackilioLogo } from './TrackilioLogo';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#EFE9EC] bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#EFE9EC]">
          <div className="space-y-2 text-center md:text-left">
            <TrackilioLogo />
            <p className="text-xs text-gray-500 font-medium">
              Collect places. Plan trips. Blend travel taste with friends.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-600">
            <Link href="/discover" className="hover:text-[#FF5841] transition-colors">
              Discover Lists
            </Link>
            <Link href="/blend" className="hover:text-[#FF5841] transition-colors">
              ✨ Blend
            </Link>
            <Link href="/create" className="hover:text-[#FF5841] transition-colors">
              Create a List
            </Link>
            <Link href="/about" className="hover:text-[#FF5841] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#FF5841] transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-[#FF5841] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FF5841] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-medium">
          <div>
            © {new Date().getFullYear()} Trackilio. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:trackiliocontact@gmail.com"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#FF5841] transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>trackiliocontact@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
