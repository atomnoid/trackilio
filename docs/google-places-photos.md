# Google Places Photos (New) Integration — Developer Reference

## Overview
Trackilio integrates Google Places API (New) to dynamically display 1–3 photos for places that have a `google_place_id`.

---

## 1. Enabled Google Cloud APIs
- **Places API (New)** (`places.googleapis.com`)

---

## 2. API Endpoints & Field Masks Used

### 2.1 Place Details (New)
- **URL**: `GET https://places.googleapis.com/v1/places/{googlePlaceId}`
- **Headers**:
  - `X-Goog-Api-Key`: `[GOOGLE_MAPS_API_KEY]`
  - `X-Goog-FieldMask`: `id,photos`
- **Purpose**: Retrieves place photo metadata (up to 3 photos) including photo resource names and `authorAttributions`.
- **Field Mask Restriction**: Strictly limited to `id,photos` to minimize payload and cost. `fields=*` is NEVER used.

### 2.2 Place Photos (New)
- **URL**: `GET https://places.googleapis.com/v1/{photo.name}/media?maxWidthPx=1200&skipHttpRedirect=true`
- **Headers**:
  - `X-Goog-Api-Key`: `[GOOGLE_MAPS_API_KEY]`
- **Purpose**: Resolves the temporary photo resource name into Google CDN `photoUri`.
- **Serving Mechanism**: Trackilio API route (`/api/places/google/photos`) issues an HTTP 307 temporary redirect to the CDN `photoUri`.

---

## 3. Environment Variable Configuration
- **Key Name**: `GOOGLE_MAPS_API_KEY`
- **Location**: `.env.local` / Server Environment Variables.
- **Security Rule**: The key is stored ONLY on the server and is NEVER exposed to client-side JavaScript, `NEXT_PUBLIC_*` variables, or browser bundles.

---

## 4. Policy Compliance & Storage Restrictions

### 4.1 No Permanent Storage / Caching
- **No Supabase Storage**: Google photo files are never downloaded or stored in Supabase Storage or any bucket/CDN.
- **No DB Persistence**: Temporary Google photo resource names (`places/*/photos/*`) and `photoUri` links are NOT saved in the database.
- **Fresh Retrieval**: Photo resource names are retrieved fresh on demand to comply with Google Places API caching policies.

### 4.2 Required Author Attribution
- Each displayed Google photo extracts `authorAttributions` (display name + contribution URL).
- Attributions are rendered directly under each image with an author link and "via Google Places" badge.
- Google Maps place source link (`maps_url`) is preserved on the place detail page.

---

## 5. API Call Overhead & Cost Control

### Per Place Page Load:
1. **Server-Side Place Details Call**: 1 call to `https://places.googleapis.com/v1/places/{id}` with field mask `id,photos`.
2. **Browser Photo Requests**: 1 call per displayed image (up to 3 max) to `/api/places/google/photos?placeId={id}&index={n}`.

### Cost Protection Safeguards:
- **No React Render Loops**: Metadata is fetched in Next.js Server Components (`PlaceDetailPage`), eliminating client re-render loops.
- **Max 3 Photos**: Capped at 3 photos per place.
- **Image Error Handling**: Failed image requests gracefully hide without infinite retries.
- **No Background Scraping**: No automated bulk scripts or background refresh jobs.

---

## 6. Recommended Google Cloud Quota Limits
In Google Cloud Console under **Places API (New) Quotas**:
- Set a daily request cap on **Place Details (New)** and **Place Photos (New)**.
- Restrict `GOOGLE_MAPS_API_KEY` to IP / server environment restrictions.
