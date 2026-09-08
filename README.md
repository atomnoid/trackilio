# MyWanderLists

MyWanderLists is a production-quality travel discovery platform where users can create, organize, save, share, and collaboratively build travel lists ("WanderLists") with places, cafes, bucket list items, priority tags, upvotes, and comments.

## Tech Stack
- **Framework**: Next.js (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Editorial Design System)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Icons & Utilities**: Lucide Icons, Zod, clsx, tailwind-merge

## Key Architecture & Features
- **Public Discovery & UGC SEO**: SEO-friendly public routes (`/l/[slug]`), dynamic metadata with `generateMetadata()`, Open Graph cards, and JSON-LD structured data (`ItemList`, `BreadcrumbList`).
- **Non-Recursive RLS**: Row Level Security policies implemented with `SECURITY DEFINER` SQL helper functions (`can_read_list`, `can_write_list`, `is_list_public`) to eliminate infinite recursive evaluation.
- **Dynamic Sitemap & Robots**: Automated `sitemap.xml` for public WanderLists and `robots.txt` disallowing private/authenticated areas.
- **Collaborative Lists**: Roles for Owners, Editors, and Viewers with database constraints enforcing access levels.
- **Interactive Places**: Upvoting, recommendation notes, priority levels (`must_visit`, `want_to_visit`, `maybe`), status badges, and Google Maps integration.

## Local Setup
1. Clone the repository and navigate to the project directory:
   ```bash
   cd trackilio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Run the database migration:
   Execute the SQL script in `supabase/schema.sql` inside your Supabase SQL Editor.
5. Run the development server:
   ```bash
   npm run dev
   ```
