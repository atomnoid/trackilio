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
const apiKey = getVar('GOOGLE_MAPS_API_KEY');

async function searchGooglePlaceId(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query }),
  });
  const data = await res.json();
  return data.places?.[0] ?? null;
}

async function updatePlaceId(supabaseId, newGooglePlaceId) {
  // First find the place by google_place_id
  const res = await fetch(
    `${supabaseUrl}/rest/v1/places?google_place_id=eq.${supabaseId}&select=id,name`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    }
  );
  const places = await res.json();
  if (!places.length) {
    console.log(`  Place not found for google_place_id=${supabaseId}`);
    return;
  }
  const place = places[0];
  
  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/places?id=eq.${place.id}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ google_place_id: newGooglePlaceId }),
    }
  );
  const updated = await updateRes.json();
  console.log(`  Updated: ${place.name} → ${newGooglePlaceId}`);
  return updated;
}

console.log('=== Finding correct Place IDs ===\n');

// Fix Newfoundland
console.log('Searching for Newfoundland...');
const nf = await searchGooglePlaceId('Newfoundland and Labrador province Canada');
console.log(`  Found: ${nf?.displayName?.text} (${nf?.id}) - ${nf?.formattedAddress}`);

// Fix Noor-Us-Sabah
console.log('Searching for Noor-Us-Sabah Palace...');
const noor = await searchGooglePlaceId('Noor Us Sabah Palace Bhopal hotel');
console.log(`  Found: ${noor?.displayName?.text} (${noor?.id}) - ${noor?.formattedAddress}`);

console.log('\n=== Updating DB ===\n');

if (nf?.id) {
  await updatePlaceId('ChIJHwh9flPGbkwRSqJi5_KyDfg', nf.id);
}
if (noor?.id) {
  await updatePlaceId('ChIJK1k1wuVnfDkR8iYvQPMwp2s', noor.id);
}

console.log('\nDone!');
