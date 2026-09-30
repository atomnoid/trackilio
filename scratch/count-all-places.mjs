import { CURATED_PLACES } from './src/services/curatedData.ts';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const getVar = (name) => {
  const m = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};

const supabaseUrl = getVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const res = await fetch(`${supabaseUrl}/rest/v1/places?select=id,name,slug`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }
});
const dbPlaces = await res.json();

console.log('DB places count:', dbPlaces.length);
console.log('Curated fallback places count:', CURATED_PLACES.length);

const allSlugs = new Set([...dbPlaces.map(p => p.slug), ...CURATED_PLACES.map(p => p.slug)]);
console.log('Total unique places across DB + Curated data:', allSlugs.size);
