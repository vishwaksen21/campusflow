# 🚀 Deploy Frontend to Vercel (Free Tier)

Follow this to deploy your CampusFlow dashboard live on Vercel.

---

## ✅ Step 1: Update Frontend for Production

Your frontend is static, and your backend will be on Render. To make Vercel call Render, set the backend base URL in `public/config.js`.

1. Open `public/config.js`
2. Set:
```js
window.CAMPUSFLOW_API_BASE_URL = 'https://your-backend-url.onrender.com';
```
3. Commit + push. Vercel will redeploy automatically.

---

## ✅ Step 2: Create a Vercel Project File

Create a file named `vercel.json` in your root directory:

```json
{
  "buildCommand": "echo 'Frontend ready'",
  "outputDirectory": "public",
  "framework": "static"
}
```

This tells Vercel to serve the `public` folder as your static site.

---

## ✅ Step 3: Commit & Push to GitHub

```bash
git add .
git commit -m "Update frontend for production deployment"
git push origin main
```

---

## ✅ Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** (use GitHub)
3. Authorize GitHub
4. Click **"Add New..."** → **"Project"**
5. Find and select **`vishwaksen21/campusflow`**
6. Click **"Import"**
7. Vercel will auto-detect your setup
8. Click **"Deploy"**

---

## ✅ Step 5: Get Your Live Frontend URL

Wait ~2-3 minutes for deployment. Your site will be live at:
```
https://campusflow-vXXXXXX.vercel.app
```

*(Or a custom domain if you set one up)*

---

## ⚠️ Important

If you do NOT set `window.CAMPUSFLOW_API_BASE_URL` in `public/config.js`, the frontend will default to same-origin and your API calls will fail on Vercel.

---

## 🧪 Test Your Live Dashboard

1. Go to your Vercel URL: `https://campusflow-vXXXXXX.vercel.app`
2. Register a student
3. Submit a deadline
4. Check your WhatsApp & Google Calendar ✅

---

## 📝 Summary of Live URLs

After deployment, you'll have:

- **Frontend (Vercel):** `https://campusflow-vXXXXXX.vercel.app`
- **Backend (Render):** `https://campusflow-backend.onrender.com`
- **n8n (Local):** `http://localhost:5678` (or deploy to n8n Cloud)

Your complete system is live! 🎉
