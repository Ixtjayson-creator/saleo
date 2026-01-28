# Deployment Guide: Saleo ROI Dashboard

Follow these steps to deploy your application to Vercel (Free Tier) and ensure your Supabase production environment is configured correctly.

## 1. Supabase Production Setup

### Execute SQL Schema
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** in the left sidebar.
3. Paste the contents of `supabase_schema.sql` (found in your project root) and click **Run**.
4. This will create the necessary `ad_spend` and `sales` tables and enable **Row Level Security (RLS)** to protect user data.

### Authentication Settings
1. Go to **Authentication > Providers** and ensure **Email** is enabled.
2. Under **Authentication > URL Configuration**, add your production Vercel URL (e.g., `https://your-app-name.vercel.app`) to the **Redirect URLs**.

---

## 2. Deploy to Vercel

### Option A: Vercel CLI (Recommended for fast déploys)
1. Install Vercel CLI: `npm i -g vercel`.
2. Run `vercel` in your project root.
3. Follow the prompts (Select "Next.js" framework).
4. When asked for environment variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your project's anon/public key.

### Option B: GitHub Integration (Recommended for Continuous Delivery)
1. Push your code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Under **Environment Variables**, add the keys from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 3. Preview Deployments (Testing)
Vercel automatically creates "Preview Deploys" for every Pull Request or non-main branch push.
- To test a feature, create a new branch: `git checkout -b feature/new-logic`.
- Push to GitHub: `git push origin feature/new-logic`.
- Vercel will provide a unique URL to test this specific version of the app.

---

## 4. Post-Deployment Checklist
- [ ] Check console logs in Vercel for any runtime errors.
- [ ] Verify that `/login` and `/signup` work on the production URL.
- [ ] Try uploading a CSV and check if the **Line Chart** updates.
- [ ] Inspect the **Network** tab in browser to ensure API calls to `supabase.co` are returning `200 OK`.

## Troubleshooting
- **401 Unauthorized**: Ensure your `Redirect URL` in Supabase Auth settings matches your Vercel domain.
- **RLS Errors**: Check that the `user_id` column in your CSVs matches the logged-in user's UID (the app handles this automatically during upload).
