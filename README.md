# Curated Kitusuru V2

Welcome to the new, unified Curated Real Estate application. Built on Next.js 15 App Router.

## Why V2?
In V1, the frontend React app and backend serverless API were split into two separate domains. This caused cross-origin (CORS) errors, complex cookie handling issues, and deployment fragmentation.

In V2, Next.js handles **both the React Frontend and the Serverless Backend API** in one unified codebase.
- No cross-origin issues.
- Secure HTTP-only cookies for admin sessions.
- Blazing-fast server components.
- Seamless Vercel Blob storage.

## Deployment to Vercel

1. Create a new GitHub repository called `curated_v2`.
2. Push this folder to GitHub:
   ```bash
   cd curated_v2
   git init
   git add .
   git commit -m "init: V2 Next.js unified app"
   git remote add origin https://github.com/travis873/curated_v2.git
   git push -u origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com/dashboard).
4. Click **Add New... -> Project**.
5. Import `curated_v2` from GitHub.
6. Before clicking deploy, add your Environment Variables:
   - `ADMIN_EMAIL`: admin@curated.co.ke
   - `ADMIN_PASSWORD`: admin123  *(or ADMIN_PASSWORD_HASH in production)*
   - `JWT_SECRET`: curated-kitusuru-secret-2026
7. Click **Deploy**.
8. Once deployed, click the **Storage** tab in your Vercel project dashboard.
9. Click **Create Database -> Vercel Blob**.
10. Click **Create** (this automatically injects `BLOB_READ_WRITE_TOKEN` into your project).
11. Redeploy the app to apply the token! All done.

## Local Development
To run locally, you need to pull your Vercel Environment Variables down:
```bash
npx vercel link
npx vercel env pull .env.local
npm run dev
```
