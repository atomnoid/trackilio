import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BlendInviteAccept } from "@/components/blend/BlendInviteAccept";

export const dynamic = "force-dynamic";

interface BlendInvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: BlendInvitePageProps): Promise<Metadata> {
  const { token } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${siteUrl}/api/blend/invite?token=${token}`, { cache: "no-store" });
    if (!res.ok) return { title: "Blend Invite | Trackilio", robots: { index: false, follow: false } };
    const { invite } = await res.json();
    const inviterName = invite?.inviter?.display_name || invite?.inviter?.username || "A traveler";
    return {
      title: `${inviterName} wants to Blend with you! | Trackilio`,
      description: `Accept the Blend invite from ${inviterName} and discover your travel compatibility score on Trackilio.`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: "Blend Invite | Trackilio", robots: { index: false, follow: false } };
  }
}

export default async function BlendInvitePage({ params }: BlendInvitePageProps) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let invite: any = null;
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${siteUrl}/api/blend/invite?token=${token}`, { cache: "no-store" });
    const data = await res.json();
    if (res.status === 409 && data.blendId) { redirect(`/blend/${data.blendId}`); }
    if (!res.ok) { fetchError = data.error || "This Blend invite link is invalid or has expired."; }
    else { invite = data.invite; }
  } catch { fetchError = "Failed to load invite."; }

  if (fetchError || !invite) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🔗</div>
        <h1 className="font-sans text-2xl font-black text-[#222222]">Invalid Invite</h1>
        <p className="text-sm text-[#6B6862]">{fetchError}</p>
        <Link href="/blend" className="inline-block mt-2 text-sm font-bold text-[#FF5841] hover:underline">Create your own Blend →</Link>
      </div>
    );
  }

  const inviterName = invite.inviter?.display_name || invite.inviter?.username || "A traveler";
  const initials = inviterName.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-md px-4 py-16 space-y-6">
      <div className="rounded-3xl bg-white border border-[#E8DECA] p-8 shadow-sm text-center space-y-5">
        <div className="flex justify-center">
          {invite.inviter?.avatar_url ? (
            <img src={invite.inviter.avatar_url} alt={inviterName} className="h-20 w-20 rounded-2xl object-cover border border-[#E8DECA]" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-black text-3xl flex items-center justify-center shadow-sm">{initials}</div>
          )}
        </div>
        <div className="space-y-1.5">
          <h1 className="font-sans text-2xl font-black text-[#222222]">{inviterName} wants to Blend! ✨</h1>
          {invite.inviter?.username && <p className="text-sm text-[#6B6862]">@{invite.inviter.username}</p>}
          <p className="text-sm text-[#6B6862] pt-1 max-w-xs mx-auto">Find out your travel compatibility score based on shared saved places.</p>
        </div>
        <BlendInviteAccept token={token} isLoggedIn={!!user} inviterName={inviterName} />
      </div>
      <p className="text-center text-xs text-[#78726D]">Only your <strong>public</strong> travel lists are compared. Private guides stay private.</p>
    </div>
  );
}