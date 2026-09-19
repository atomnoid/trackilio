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

const updates = [
  { id: 'e42df1bd-49ce-4395-8ca4-4e49d16e97ab', name: 'Newfoundland island in canada', correctId: 'ChIJD_AvfcKjDEsRqDl21bOd7GQ' },
  { id: '88a3d005-8797-4e9b-b5c6-7d1086127356', name: 'Noor us sabha', correctId: 'ChIJGz_QAOZnfDkRCoBZsuBkA5M' },
];

for (const { id, name, correctId } of updates) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/places?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ google_place_id: correctId }),
    }
  );
  const data = await res.json();
  console.log(`Updating ${name}: HTTP ${res.status}`);
  console.log(JSON.stringify(data));
}
