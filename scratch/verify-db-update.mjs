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
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY');

console.log('Service role key present:', Boolean(serviceKey));

// Check current state of the two broken places
const res = await fetch(
  `${supabaseUrl}/rest/v1/places?select=id,name,google_place_id&or=(google_place_id.eq.ChIJHwh9flPGbkwRSqJi5_KyDfg,google_place_id.eq.ChIJK1k1wuVnfDkR8iYvQPMwp2s,name.ilike.*noor*,name.ilike.*newfoundland*)`,
  {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    }
  }
);
const places = await res.json();
console.log('\nCurrent DB state for these places:');
console.log(JSON.stringify(places, null, 2));
