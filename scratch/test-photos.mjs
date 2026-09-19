import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

async function getPhotos(placeId) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,photos',
    },
  });
  const data = await res.json();
  return data;
}

async function run() {
  console.log('\n--- Noor-Us-Sabah Photos Meta ---');
  const noorPhotos = await getPhotos('ChIJK1k1wuVnfDkR8iYvQPMwp2s');
  console.log(JSON.stringify(noorPhotos, null, 2));

  console.log('\n--- Newfoundland Photos Meta ---');
  const nfPhotos = await getPhotos('ChIJD_AvfcKjDEsRqDl21bOd7GQ');
  console.log(JSON.stringify(nfPhotos, null, 2));
}

run().catch(console.error);
