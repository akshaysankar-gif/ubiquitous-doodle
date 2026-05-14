<<<<<<< HEAD
# Support ticket analyser
=======
# Ticket Intelligence - API & Analysis Layer

## Overview
Ticket Intelligence is a backend system built with Next.js 14 and Prisma to analyze support tickets using GPT-4o. It parses CSV/XLSX uploads, classifies tickets, and provides quality scores.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma + Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o
- **Auth:** NextAuth.js (Credentials)

## Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and fill in the values.
4. Initialize the database:
   ```bash
   npx prisma db push
   ```
5. Seed the database (creates admin user):
   ```bash
   npx prisma db seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment
1. Connect your Supabase project and get the `DATABASE_URL` and `DIRECT_URL`.
2. Deploy to Vercel, adding all environment variables from `.env.example`.
3. Run Prisma migrations during the build or manually.

## Usage
1. **Login:** Use the seed credentials (`admin@surveysparrow.com` / `changeme123`).
2. **Upload:** Use `POST /api/upload` with a multipart form containing a `file` (CSV/XLSX) and `batchName`.
3. **Analyze:** Use `POST /api/analyze/[batchId]` to trigger the GPT-4o analysis pipeline.
4. **Stats:** Use `GET /api/stats` for aggregated analysis insights.

## API Endpoint Reference
- `POST /api/auth/[...nextauth]` - Authentication.
- `POST /api/upload` - Upload tickets.
- `POST /api/analyze/[batchId]` - Trigger analysis.
- `GET /api/batches` - List batches.
- `GET /api/batches/[batchId]` - Batch details.
- `GET /api/tickets` - List tickets (paginated).
- `GET /api/tickets/[id]` - Ticket detail.
- `PATCH /api/tickets/[id]` - Edit ticket fields.
- `GET /api/stats` - Aggregated statistics.
>>>>>>> a368d65 (Initial commit)
