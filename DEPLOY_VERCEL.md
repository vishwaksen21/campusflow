# 🚀 Deploy Frontend to Vercel (Free Tier)

Follow this to deploy your CampusFlow dashboard live on Vercel.

---

## ✅ Step 1: Update Frontend for Production

Your frontend (`public/index.html`) currently connects to `http://localhost:3000`. We need to make it work with your live backend.

Update the API calls in `public/index.html`:

Change:
```javascript
const res = await fetch('/register', {
```

To:
```javascript
const res = await fetch('https://your-backend-url.onrender.com/register', {
```

*(Replace `your-backend-url` with your actual Render URL from the previous step)*

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

## ⚠️ Important: Update API Calls

Before Vercel deployment, you MUST update your frontend to point to your live backend!

### Open `public/index.html`

Find these lines (around line 50 and 85):
```javascript
const res = await fetch('/register', {
```

Replace with:
```javascript
const res = await fetch('https://campusflow-backend.onrender.com/register', {
```

*(Use your actual Render URL)*

Do this for BOTH:
- `fetch('/register', ...)`
- `fetch('/add-task', ...)`

Then push again:
```bash
git add public/index.html
git commit -m "Point frontend to production backend"
git push origin main
```

Vercel will auto-redeploy!

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
