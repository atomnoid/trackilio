import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addListMember } from "@/services/members";

/** POST /api/members/accept — accept a list invite */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be logged in to join a list." }, { status: 401 });

  const { token } = await request.json();
  if (!token) return NextResponse.json({ error: "Token is required." }, { status: 400 });

  const { data: invite, error: inviteErr } = await (supabase as any)
    .from("list_invites")
    .select("*, list:wander_lists(slug, title)")
    .eq("token", token)
    .maybeSingle();

  if (inviteErr || !invite) return NextResponse.json({ error: "Invite not found." }, { status: 404 });
  if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ error: "This invite link has expired." }, { status: 410 });
  if (invite.uses >= invite.max_uses) return NextResponse.json({ error: "This invite link has reached its usage limit." }, { status: 410 });
  if (invite.invited_by === user.id) return NextResponse.json({ error: "You are the owner of this list." }, { status: 400 });

  const result = await addListMember({ listId: invite.list_id, userId: user.id, role: invite.role });

  if (!result.success) {
    // Already a member — still redirect to list
    if (result.error?.includes("duplicate") || result.error?.includes("unique")) {
      return NextResponse.json({ listSlug: invite.list?.slug, listTitle: invite.list?.title });
    }
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Increment uses
  await (supabase as any)
    .from("list_invites")
    .update({ uses: invite.uses + 1 })
    .eq("token", token);

  return NextResponse.json({ listSlug: invite.list?.slug, listTitle: invite.list?.title, role: invite.role });
}