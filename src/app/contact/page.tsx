import type { Metadata } from 'next';
import { Mail, Shield, Sparkles, MapPin, Compass, Users, CheckCircle2, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us & Support | Trackilio',
  description: 'Get in touch with the Trackilio team for support, feature ideas, community partnerships, or feedback. Email us at trackiliocontact@gmail.com.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-4 py-1.5 text-xs font-black text-[#FF5841]">
          <MessageSquare className="h-3.5 w-3.5" />
          We would love to hear from you
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
          Have a question, feedback, feature suggestion, or want to partner with Trackilio? We’re always here to help travelers build better guides.
        </p>
      </div>

      {/* Main Contact Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FFF8F7] to-[#FDF4F8] border border-[#FFD3CC] p-8 sm:p-12 shadow-lg hover:shadow-xl transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF5841]/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="font-sans text-2xl font-black text-gray-900">
              Direct Email Support
            </h2>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed font-medium">
              Reach out directly to our team for platform support, bug reports, or partnership inquiries. We aim to respond within 24-48 hours.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <a
              href="mailto:trackiliocontact@gmail.com"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 text-white font-black px-8 py-4 text-sm shadow-md hover:shadow-lg transition-all active-press"
            >
              <Mail className="h-4.5 w-4.5" />
              <span>trackiliocontact@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-2xs hover:border-[#FF5841]/30 transition-all">
          <div className="h-10 w-10 rounded-xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-sans text-base font-black text-gray-900">Feature Requests</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-normal">
            Have an idea for collaborative itinerary tools or Travel Blend algorithms? Tell us what you want to see built next!
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-2xs hover:border-[#FF5841]/30 transition-all">
          <div className="h-10 w-10 rounded-xl bg-[#F9E2EE] text-[#C53678] flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-sans text-base font-black text-gray-900">Creator Partnerships</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-normal">
            Are you a travel creator, blogger, or local guide curator? Collaborate with us to feature your curated itineraries.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-2xs hover:border-[#FF5841]/30 transition-all">
          <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-sans text-base font-black text-gray-900">Privacy & Accounts</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-normal">
            Questions regarding data privacy, account deletion, or content moderation? Contact us anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
