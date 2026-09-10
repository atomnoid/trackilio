import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListInviteAccept } from "@/components/lists/ListInviteAccept";

export const dynamic = "force-dynamic";

interface ListInvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: ListInvitePageProps): Promise<Metadata> {
  const { token } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const supabase = await createClient();
    const { data: invite } = await (supabase as any)
      .from("list_invites")
      .select("role, list:wander_lists(title)")
      .eq("token", token)
      .maybeSingle();
    const listTitle = invite?.list?.title || "a travel list";
    return {
      title: `Join ${listTitle} as ${invite?.role || "collaborator"} | Trackilio`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: "List Invite | Trackilio", robots: { index: false, follow: false } };
  }
}

export default async function ListInvitePage({ params }: ListInvitePageProps) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: invite, error } = await (supabase as any)
    .from("list_invites")
    .select("*, list:wander_lists(title, slug, destination), owner:profiles!invited_by(display_name, username)")
    .eq("token", token)
    .maybeSingle();

  if (error || !invite) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🔗</div>
        <h1 className="font-sans text-2xl font-black text-[#222222]">Invalid Invite</h1>
        <p className="text-sm text-[#6B6862]">This list invite link is invalid or has expired.</p>
        <Link href="/discover" className="inline-block mt-2 text-sm font-bold text-[#FF5841] hover:underline">Explore lists instead →</Link>
      </div>
    );
  }

  const isExpired = new Date(invite.expires_at) < new Date();
  const isMaxed = invite.uses >= invite.max_uses;

  if (isExpired || isMaxed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="text-4xl">⏰</div>
        <h1 className="font-sans text-2xl font-black text-[#222222]">Invite Expired</h1>
        <p className="text-sm text-[#6B6862]">{isExpired ? "This invite link has expired." : "This invite link has reached its usage limit."}</p>
        <Link href="/discover" className="inline-block mt-2 text-sm font-bold text-[#FF5841] hover:underline">Explore lists instead →</Link>
      </div>
    );
  }

  const listTitle = invite.list?.title || "a travel list";
  const ownerName = invite.owner?.display_name || invite.owner?.username || "A traveler";
  const roleLabel = invite.role === "editor" ? "Editor (can add & edit places)" : "Viewer (view only)";

  return (
    <div className="mx-auto max-w-md px-4 py-16 space-y-6">
      <div className="rounded-3xl bg-white border border-[#E8DECA] p-8 shadow-sm text-center space-y-5">
        <div className="text-4xl">🗺️</div>
        <div className="space-y-1.5">
          <span className="inline-block rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3 py-0.5 text-xs font-black text-[#FF5841]">
            {roleLabel}
          </span>
          <h1 className="font-sans text-2xl font-black text-[#222222] mt-2">{listTitle}</h1>
          {invite.list?.destination && (
            <p className="text-xs font-bold text-[#6B6862]">📍 {invite.list.destination}</p>
          )}
          <p className="text-sm text-[#6B6862] pt-1">
            <strong>{ownerName}</strong> has invited you to collaborate on this travel list.
          </p>
        </div>

        <ListInviteAccept token={token} isLoggedIn={!!user} listTitle={listTitle} />
      </div>
    </div>
  );
}