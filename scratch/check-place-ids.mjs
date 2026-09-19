import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const getVar = (name) => {
  const m = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};

const supabaseUrl = getVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const apiKey = getVar('GOOGLE_MAPS_API_KEY');

console.log('Supabase URL:', supabaseUrl);

// Check places with google_place_id that might be wrong
const res = await fetch(`${supabaseUrl}/rest/v1/places?select=id,name,slug,google_place_id,maps_url&order=name`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  }
});
const places = await res.json();

console.log('\nAll places with google_place_id:');
for (const p of places) {
  if (p.google_place_id) {
    console.log(`  [${p.name}] id=${p.google_place_id} slug=${p.slug}`);
  }
}

console.log('\nAll places WITHOUT google_place_id:');
for (const p of places) {
  if (!p.google_place_id) {
    console.log(`  [${p.name}] slug=${p.slug} maps_url=${p.maps_url || 'none'}`);
  }
}
