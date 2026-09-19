import fs from 'fs';
import path from 'path';

// Read .env.local for GOOGLE_MAPS_API_KEY
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

console.log('API Key present:', Boolean(apiKey));

async function searchPlace(query) {
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
  return data;
}

async function run() {
  console.log('\n--- Searching Noor-Us-Sabah Palace ---');
  const noor = await searchPlace('Noor-Us-Sabah Palace Bhopal');
  console.log(JSON.stringify(noor, null, 2));

  console.log('\n--- Searching Newfoundland ---');
  const newfoundland = await searchPlace('Newfoundland');
  console.log(JSON.stringify(newfoundland, null, 2));
}

run().catch(console.error);
