# Marketing Spend ROI Dashboard

A modern full-stack analytics dashboard for tracking marketing ROI, built with Next.js, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Recharts
- **Backend:** Next.js API Routes (Node.js)
- **Database:** Supabase (tables: `ad_accounts`, `ad_spend`, `sales`, `roi_summary`)
- **Auth:** Supabase Auth
- **Icons:** Lucide React

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Rename `.env.local` and add your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Features

- **Dashboard:** High-level overview of total spend, sales, and ROI trends.
- **Upload Data:** Drag-and-drop specific marketing CSV data.
- **ROI Summary:** Detailed tabular view of campaign performance.

## Project Structure

- `src/app`: Page routes and API endpoints.
- `src/components`: Reusable UI components (Sidebar, Charts, etc.).
- `src/lib`: Supabase client configuration.

## Database Schema (Assumed)

Ensure your Supabase project has the following tables:
- `ad_accounts`
- `ad_spend`
- `sales`
- `roi_summary`
