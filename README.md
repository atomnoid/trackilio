# Trackilio

Trackilio is a modern, colorful, mobile-first travel discovery and list platform where users collect places, plan trips, map routes, upvote spots, and discover user-generated travel guides worldwide.

## Tech Stack
- **Framework**: Next.js (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Trackilio Design Tokens, Vibrant Palette & Vector Illustrations)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Icons & Visuals**: Lucide Icons, Custom SVG & CSS Vector Illustrations

## Key Architecture & Features
- **Public Discovery & UGC SEO**: SEO-friendly public routes (`/l/[slug]`), dynamic metadata with `generateMetadata()`, Open Graph cards, and JSON-LD structured data (`ItemList`, `BreadcrumbList`).
- **Deterministic Vector List Covers**: Custom `ListCover` vector illustration system generating unique covers based on list titles & destinations without random stock photos.
- **Interactive Visual Storytelling**: Interactive world map centerpiece (`HeroMap`) with floating pins, animated route lines, and touch/tap micro-interactions.
- **Mobile-First UX**: Responsive mobile navigation with top brand header and sticky bottom navigation bar.
- **Non-Recursive RLS**: Row Level Security policies implemented with `SECURITY DEFINER` SQL helper functions (`can_read_list`, `can_write_list`, `is_list_public`).
- **Dynamic Sitemap & Robots**: Automated `sitemap.xml` for public Trackilio Lists and `robots.txt` disallowing private/authenticated areas.
- **Interactive Places & Upvoting**: Priority badges (`Must Visit`, `Want to Visit`, `Maybe`), micro-animated upvoting, outbound Google Maps integration, and comments.

## Local Setup
1. Navigate to the project directory:
   ```bash
   cd trackilio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
