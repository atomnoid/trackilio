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

// Places that need their google_place_id fixed:
// "Newfoundland island in canada" has ChIJHwh9flPGbkwRSqJi5_KyDfg which returns 404
// The correct one is ChIJD_AvfcKjDEsRqDl21bOd7GQ (Newfoundland and Labrador province)
// "Musings cafe" has ChIJtai1OBu7-DkRUlJuQqUoJLo (Ashoknagar, wrong city) — let's check
// "House No. 230" has ChIJ9V4W2s9cfDkRYPlDqx1RFx0 (Bhopal, but may be wrong too)

const updates = [
  { 
    name: 'Newfoundland island in canada',
    id: 'newfoundland-island-in-canada-newfoundland-and-labrador',
    correctPlaceId: 'ChIJD_AvfcKjDEsRqDl21bOd7GQ' 
  },
];

async function verifyPlacePhoto(placeId) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,displayName,photos',
    },
  });
  const data = await res.json();
  return { status: res.status, hasPhotos: (data.photos?.length ?? 0) > 0, name: data.displayName?.text, photoCount: data.photos?.length ?? 0 };
}

console.log('Verifying all DB place IDs...\n');

const res = await fetch(`${supabaseUrl}/rest/v1/places?select=id,name,slug,google_place_id&not.is.google_place_id.null`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }
});
const places = await res.json();

for (const p of places) {
  const result = await verifyPlacePhoto(p.google_place_id);
  const status = result.hasPhotos ? '✅' : `❌ (HTTP ${result.status})`;
  console.log(`${status} [${p.name}] → ${p.google_place_id} → "${result.name}" (${result.photoCount} photos)`);
}
