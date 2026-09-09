import type { Metadata } from 'next';
import Link from 'next/link';
import { FileTextIcon, ShieldIcon, SparklesIcon, MailIcon, CheckCircleIcon } from '@/components/icons/Icons';

export const metadata: Metadata = {
  title: 'Terms of Service | Trackilio',
  description: 'Read the terms and conditions governing the use of the Trackilio travel platform and community guides.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-4 py-1.5 text-xs font-black text-[#FF5841]">
          <FileTextIcon className="h-3.5 w-3.5" />
          Platform Guidelines
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">
          Last Updated: September 9, 2026
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">1</span>
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong>Trackilio</strong> (&ldquo;the Service&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">2</span>
            User Accounts & Authenticity
          </h2>
          <p>
            When creating an account or claiming a unique @username, you agree to provide accurate information. You are responsible for safeguarding your account credentials and for all activities that take place under your profile.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">3</span>
            Content Ownership & Community Conduct
          </h2>
          <p>
            You retain full ownership of the text, travel recommendations, custom notes, and list titles you publish on Trackilio. By publishing public lists, you grant Trackilio a non-exclusive license to index, display, and share your guide with other travelers.
          </p>
          <p className="text-gray-600 font-medium">
            You agree not to post spam, abusive, defamatory, or unlawful travel recommendations or infringe upon third-party copyrights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">4</span>
            Disclaimer of Travel Accuracy
          </h2>
          <p>
            While Trackilio strives to empower travelers with authentic community insights, venue opening hours, prices, and travel conditions may change. We encourage travelers to verify local operational details before departure.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
             <MailIcon className="h-5 w-5 text-[#FF5841]" />
            Contact & Legal Inquiries
          </h2>
          <p>
            For any questions or legal notices regarding these terms:
          </p>
          <div className="pt-2">
            <a
              href="mailto:trackiliocontact@gmail.com"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFEAE6] hover:bg-[#FFD3CC] border border-[#FFD3CC] text-[#FF5841] font-black px-6 py-3 text-xs shadow-2xs transition-all"
            >
              <MailIcon className="h-4 w-4" />
              <span>trackiliocontact@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
