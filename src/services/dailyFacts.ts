import { createClient } from '@/lib/supabase/server';
import { DailyFact } from '@/types/database';

/**
 * Returns today's travel fact (keyed by published_date = today's UTC date).
 * Falls back to the most recent fact if today has no entry.
 */
export async function getTodaysFact(): Promise<DailyFact | null> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Try today's exact date first
    const { data: todayFact } = await (supabase as any)
      .from('daily_facts')
      .select('*')
      .eq('published_date', today)
      .maybeSingle();

    if (todayFact) return todayFact as DailyFact;

    // Fallback: most recent published fact
    const { data: latestFact } = await (supabase as any)
      .from('daily_facts')
      .select('*')
      .lte('published_date', today)
      .order('published_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    return (latestFact ?? null) as DailyFact | null;
  } catch {
    return null;
  }
}
