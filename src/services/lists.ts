import { createClient } from '@/lib/supabase/server';
import { WanderList } from '@/types/database';

export function generateSlug(title: string): string {
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || 'wanderlist';
}

export async function getUniqueSlug(baseTitle: string): Promise<string> {
  const supabase = await createClient();
  let slug = generateSlug(baseTitle);
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await (supabase as any)
      .from('wander_lists')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) break;
    counter += 1;
    slug = `${generateSlug(baseTitle)}-${counter}`;
  }

  return slug;
}

export async function getPublicWanderLists(params?: {
  destination?: string;
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<WanderList[]> {
  const supabase = await createClient();
  let q = (supabase as any)
    .from('wander_lists')
    .select('*, owner:profiles(*)')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (params?.destination) {
    q = q.ilike('destination', `%${params.destination}%`);
  }
  if (params?.query) {
    q = q.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
  }
  if (params?.limit) {
    q = q.limit(params.limit);
  }

  const { data, error } = await q;
  if (error) {
    console.error('Error fetching public WanderLists:', error);
    return [];
  }
  return (data ?? []) as WanderList[];
}

export async function getWanderListBySlug(slug: string): Promise<WanderList | null> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('wander_lists')
    .select('*, owner:profiles(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as WanderList;
}

export async function getUserWanderLists(userId: string): Promise<WanderList[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('wander_lists')
    .select('*, owner:profiles(*)')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user WanderLists:', error);
    return [];
  }
  return (data ?? []) as WanderList[];
}

export async function createWanderList(params: {
  ownerId: string;
  title: string;
  description?: string;
  destination?: string;
  coverImage?: string;
  isPublic: boolean;
}): Promise<{ slug?: string; error?: string }> {
  const supabase = await createClient();
  const slug = await getUniqueSlug(params.title);

  const { data, error } = await (supabase as any)
    .from('wander_lists')
    .insert({
      owner_id: params.ownerId,
      title: params.title,
      description: params.description || null,
      destination: params.destination || null,
      cover_image: params.coverImage || null,
      slug,
      is_public: params.isPublic,
    })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };

  // Add owner as list_member
  await (supabase as any).from('list_members').insert({
    list_id: data.id,
    user_id: params.ownerId,
    role: 'owner',
  });

  return { slug: data.slug };
}

export async function deleteWanderList(
  listId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('wander_lists')
    .delete()
    .eq('id', listId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
