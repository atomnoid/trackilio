import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons/Icons';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-5 bg-[#FAF3E1]">
      <div className="h-16 w-16 rounded-2xl bg-[#F5E7C6] border border-[#E8DECA] text-[#222222] flex items-center justify-center mx-auto text-2xl">
        📍
      </div>
      <div className="space-y-1.5">
        <h1 className="font-sans text-2xl font-black text-[#222222]">
          This destination seems to have wandered off.
        </h1>
        <p className="text-xs text-[#6B6862]">
          The Trackilio list you are looking for does not exist or may be set to private.
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-bold px-6 py-2.5 text-xs active-press transition-colors shadow-xs"
        >
          <span>Discover Public Lists</span>
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
