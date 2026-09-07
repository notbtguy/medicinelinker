# Medical Connection - Interdisciplinary Medical AI

An AI-powered academic and clinical synthesis platform mapping interdisciplinary connections across all 19 medical subjects (Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Microbiology, Forensic Medicine, Community Medicine, ENT, Ophthalmology, Dermatology, Psychiatry, Orthopaedics, Radiodiagnosis, Anaesthesiology, General Medicine, General Surgery, Obstetrics & Gynaecology, and Paediatrics).

---

## Why Didn't It Work on GitHub / Vercel Initially?

If you pushed the code to GitHub and attempted to deploy to GitHub Pages or Vercel, you likely encountered one or more of these three issues:

1. **GitHub Pages is Static Only**:
   - GitHub Pages only serves static HTML, CSS, and JS files. It has no backend Node.js runtime. Any request to `/api/analyze-connection` returned a `404 Not Found`.

2. **Vercel is Serverless, Not a Long-Running Daemon**:
   - By default, Vercel builds Vite projects as static frontends (`dist/`). It does not run a persistent Express server (`app.listen(3000)`) in the background.
   - Without a `vercel.json` rewrite file and a serverless entry point (`/api/index.ts`), Vercel treated `/api/analyze-connection` as a missing static file.

3. **Missing `GEMINI_API_KEY` in Vercel Environment Variables**:
   - For security, `.env` is listed in `.gitignore` so your private API keys are never pushed to GitHub.
   - When deploying to Vercel, you **must add your `GEMINI_API_KEY`** in the Vercel Dashboard under **Project Settings > Environment Variables**.

---

## How to Deploy to Vercel (Ready Out-of-the-Box)

The repository has now been configured with `vercel.json` and `/api/index.ts` so that it deploys seamlessly to Vercel.

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure Vercel serverless deployment"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your GitHub repository.
3. Framework Preset: **Vite** (Vercel detects this automatically).
4. Build Command: `npm run build` (or leave default).
5. Output Directory: `dist` (default).

### Step 3: Add Your Gemini API Key (Crucial!)
1. In the Vercel project configuration screen (or under **Settings > Environment Variables**):
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_here` (from [Google AI Studio](https://aistudio.google.com/app/apikey))
2. Click **Deploy**.

---

## Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend / API**: Express 4 / Node.js.
  - **Local / Container (Cloud Run, Docker)**: Runs via `server.ts` on port 3000.
  - **Vercel**: Routes `/api/*` through the serverless function in `/api/index.ts` using `vercel.json`.
- **Model**: `gemini-3.1-flash-lite` with automatic fallback to `gemini-3.8-flash`.
