import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Mail, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Trackilio',
  description: 'Understand how Trackilio collects, protects, and respects your travel data, itineraries, and personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-4 py-1.5 text-xs font-black text-[#FF5841]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Transparency & Security
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Privacy Policy
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
            Introduction & Commitment
          </h2>
          <p>
            At <strong>Trackilio</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we value and respect your privacy. This Privacy Policy explains how your information is collected, used, and safeguarded when you use our website, mobile interface, collaborative travel lists, and taste-matching tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">2</span>
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Account Information:</strong> When you register via email or third-party OAuth, we collect your display name, username, email address, and optional bio/avatar.
            </li>
            <li>
              <strong>User-Generated Travel Content:</strong> The travel lists you create, curated spots, notes, categories, priorities, comments, and place upvotes.
            </li>
            <li>
              <strong>Collaboration & Blends:</strong> Invited collaborators on your travel lists and session results generated through our Travel Taste Blend tool.
            </li>
            <li>
              <strong>Usage & Analytics:</strong> Anonymous aggregated page views, search queries, and interaction statistics to improve list recommendations and user experience.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">3</span>
            Public vs. Private Lists
          </h2>
          <p>
            By default, Trackilio gives you full control over the privacy of your itineraries:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Public Lists:</strong> Discoverable by the community, indexed by search engines, and viewable by anyone with the link.
            </li>
            <li>
              <strong>Private Lists:</strong> Only accessible by you and collaborators you explicitly invite by @username.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">4</span>
            Data Storage & Third Parties
          </h2>
          <p>
            Your data is stored securely using industry-standard encryption protocols (such as Supabase PostgreSQL with Row Level Security). We never sell your personal data or itineraries to third-party data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#FFEAE6] text-[#FF5841] text-xs font-black">5</span>
            Your Rights & Account Deletion
          </h2>
          <p>
            You have the right to edit your profile, adjust list privacy, or request complete deletion of your account and personal data at any time.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#FF5841]" />
            Questions or Concerns?
          </h2>
          <p>
            If you have any questions about this Privacy Policy or data security, please email our privacy team directly:
          </p>
          <div className="pt-2">
            <a
              href="mailto:trackiliocontact@gmail.com"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFEAE6] hover:bg-[#FFD3CC] border border-[#FFD3CC] text-[#FF5841] font-black px-6 py-3 text-xs shadow-2xs transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>trackiliocontact@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
