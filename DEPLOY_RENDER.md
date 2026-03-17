# 🚀 Deploy Backend to Render (Free Tier)

Follow this to deploy your Node.js backend live on Render.

---

## ✅ Step 1: Prepare Your Backend

Update your `package.json` to ensure it has a start script:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "node src/index.js"
}
```

Make sure your `.env` file exists locally (but DON'T commit it to GitHub).

Add `.env` to your `.gitignore`:
```
.env
node_modules/
```

---

## ✅ Step 2: Push to GitHub

1. Go to your repository: https://github.com/vishwaksen21/campusflow
2. Make sure all files are committed:
   ```bash
   git add .
   git commit -m "Add CampusFlow complete implementation"
   git push origin main
   ```

---

## ✅ Step 3: Create Render Account & Deploy

1. Go to [Render](https://render.com)
2. Click **"Sign up"** (use GitHub)
3. Authorize GitHub access
4. Click **"New +"** → **"Web Service"**
5. Select your **campusflow** repository
6. Fill in:
   - **Name:** `campusflow-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
   - **Plan:** `Free` (Spinning down after 15 min of inactivity)

---

## ✅ Step 4: Add Environment Variables

1. In Render, scroll down to **Environment**
2. Add these variables:
   ```
   SUPABASE_URL=https://rjixjphfbiuznswuqmok.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   N8N_WEBHOOK_URL=PASTE_YOUR_N8N_PRODUCTION_URL_HERE
   PORT=3000
   ```

3. Click **"Create Web Service"**

---

## ✅ Step 5: Get Your Live URL

1. Wait ~2-3 minutes for deployment
2. Once it says **Status: Live**, copy the URL (e.g., `https://campusflow-backend.onrender.com`)
3. This is your **production backend URL**

---

## ✅ Step 6: Update n8n for Production

1. In n8n, **activate** your workflow (toggle on)
2. Copy the **Production Webhook URL**
3. Update Render environment variable:
   - **N8N_WEBHOOK_URL=** `{your-production-webhook-url}`
4. Render will auto-redeploy

---

## 🧪 Test Your Live Backend

Go to:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{ "status": "ok", "time": "2026-03-17T..." }
```

✅ Backend is live!
