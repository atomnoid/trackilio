import { createClient } from '@/lib/supabase/server';
import { DailyFact } from '@/types/database';

export const FALLBACK_FUN_FACTS: DailyFact[] = [
  {
    id: 'fact-kyoto-viewing-station',
    title: 'A Train Station Just for Gazing at Nature 🚂',
    fact: 'In Yamaguchi, Japan, the Seiryu Miharashi train station has no entrance, exit, or stairs. Passengers can only step onto the platform solely to admire the pristine scenic river valley before catching the next train.',
    location: 'Yamaguchi',
    country: 'Japan',
    published_date: '2026-09-09',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-iceland-mosquitoes',
    title: 'The World’s Only Mosquito-Free Haven 🦟🚫',
    fact: 'Iceland is one of the only inhabited places on Earth with zero native mosquito species, thanks to rapid oceanic freeze-thaw cycles that break their larval reproductive cycle before they can hatch.',
    location: 'Reykjavik',
    country: 'Iceland',
    published_date: '2026-09-08',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-ethiopia-calendar',
    title: 'Travel 7 Years Back in Time ⏳',
    fact: 'Ethiopia follows the Ge’ez calendar, which calculates the birth year of Jesus differently. As a result, the Ethiopian calendar is between 7 and 8 years behind the Western Gregorian calendar and has 13 months!',
    location: 'Addis Ababa',
    country: 'Ethiopia',
    published_date: '2026-09-07',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-monaco-smaller-than-park',
    title: 'A Sovereign Nation Smaller than Central Park 👑',
    fact: 'The entire Principality of Monaco covers roughly 2 square kilometers (0.8 sq miles), making it smaller than New York City’s Central Park (3.41 sq km). You can walk across the entire country in under an hour!',
    location: 'Monaco-Ville',
    country: 'Monaco',
    published_date: '2026-09-06',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-canada-lakes',
    title: 'More Lakes Than The Rest of The World Combined 🌊',
    fact: 'Canada contains more natural lake surface area than all other countries in the world combined, boasting over 2 million lakes spanning roughly 9% of its total landmass.',
    location: 'Banff & Beyond',
    country: 'Canada',
    published_date: '2026-09-05',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-rome-cat-sanctuary',
    title: 'Caesar’s Murder Site Is Now a Luxury Cat Haven 🐈',
    fact: 'Largo di Torre Argentina in Rome, the exact sunken square where Julius Caesar was assassinated in 44 BC, is today a protected historical sanctuary home to over 150 pampered rescue cats.',
    location: 'Rome',
    country: 'Italy',
    published_date: '2026-09-04',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-bolivia-mirror-sky',
    title: 'The World’s Largest Natural Mirror 🪞',
    fact: 'Salar de Uyuni in Bolivia spans over 10,000 square kilometers. During the rainy season, a thin film of water transforms the prehistoric salt desert into a flawless reflection of the sky that is even used to calibrate orbiting satellites.',
    location: 'Salar de Uyuni',
    country: 'Bolivia',
    published_date: '2026-09-03',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-nepal-flag',
    title: 'The Only Non-Quadrilateral National Flag 🇳🇵',
    fact: 'Nepal has the only national flag in the world that is not four-sided. Its unique double-pennon shape represents the soaring peaks of the Himalayas and the two main religions: Hinduism and Buddhism.',
    location: 'Kathmandu',
    country: 'Nepal',
    published_date: '2026-09-02',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-scotland-animal',
    title: 'The National Animal is a Mythical Legend 🦄',
    fact: 'Scotland’s official national animal is the Unicorn! In Celtic mythology, the unicorn symbolized purity, innocence, untamable courage, and noble strength.',
    location: 'Edinburgh',
    country: 'Scotland',
    published_date: '2026-09-01',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-turkey-two-continents',
    title: 'A City Bridging Two Hemispheres & Continents 🌉',
    fact: 'Istanbul, Turkey is the only metropolis in the world located across two continents simultaneously (Europe and Asia), connected by iconic bridges across the Bosphorus Strait.',
    location: 'Istanbul',
    country: 'Turkey',
    published_date: '2026-08-31',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-costa-rica-no-army',
    title: 'A Tropical Paradise Powered by Peace 🌿',
    fact: 'Costa Rica constitutionally abolished its armed forces in 1948, becoming one of the first sovereign nations without a standing army, and redirecting military budgets directly into education and rainforest conservation.',
    location: 'San José',
    country: 'Costa Rica',
    published_date: '2026-08-30',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fact-san-marino-oldest-republic',
    title: 'The World’s Oldest Surviving Republic 🏰',
    fact: 'Perched on the slopes of Mount Titano in Italy, San Marino is the oldest sovereign republic in existence, founded on September 3, 301 AD by Saint Marinus.',
    location: 'Mount Titano',
    country: 'San Marino',
    published_date: '2026-08-29',
    related_place_id: null,
    created_at: new Date().toISOString(),
  },
];

/**
 * Returns today's travel fact (keyed by published_date = today's UTC date).
 * Falls back to the curated random fact pool if DB is empty or fails.
 */
export async function getTodaysFact(): Promise<DailyFact> {
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

    // Fallback: most recent published fact from DB
    const { data: latestFact } = await (supabase as any)
      .from('daily_facts')
      .select('*')
      .lte('published_date', today)
      .order('published_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestFact) return latestFact as DailyFact;
  } catch {
    // Proceed to fallback pool
  }

  // Deterministic daily fallback based on day of year so all users get the same daily fact without database
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return FALLBACK_FUN_FACTS[dayOfYear % FALLBACK_FUN_FACTS.length];
}

/**
 * Returns a random fun fact from the pool
 */
export async function getRandomFact(excludeId?: string): Promise<DailyFact> {
  try {
    const supabase = await createClient();
    const { data: dbFacts } = await (supabase as any)
      .from('daily_facts')
      .select('*')
      .limit(50);

    const allFacts = dbFacts && dbFacts.length > 0 ? [...dbFacts, ...FALLBACK_FUN_FACTS] : FALLBACK_FUN_FACTS;
    const filtered = excludeId ? allFacts.filter((f) => f.id !== excludeId) : allFacts;
    const pool = filtered.length > 0 ? filtered : allFacts;
    return pool[Math.floor(Math.random() * pool.length)];
  } catch {
    const filtered = excludeId ? FALLBACK_FUN_FACTS.filter((f) => f.id !== excludeId) : FALLBACK_FUN_FACTS;
    const pool = filtered.length > 0 ? filtered : FALLBACK_FUN_FACTS;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
