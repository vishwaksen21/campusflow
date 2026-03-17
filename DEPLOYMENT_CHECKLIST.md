# 🎯 DEPLOYMENT CHECKLIST

Follow this checklist to go from local to **fully deployed, production-ready system**.

---

## Phase 1: Complete n8n Configuration ✅

- [ ] Read `N8N_SETUP.md`
- [ ] Get Twilio Account SID & Auth Token
- [ ] Join Twilio WhatsApp Sandbox
- [ ] Configure Twilio node in n8n
- [ ] Create Google Cloud project
- [ ] Enable Google Calendar API
- [ ] Create OAuth Client ID
- [ ] Configure Google Calendar node in n8n
- [ ] Get OpenAI API key (or Groq)
- [ ] Configure AI node in n8n
- [ ] **Activate** your n8n workflow
- [ ] Copy **Production Webhook URL**
- [ ] Test full workflow locally:
  - [ ] Register student → ✅ saved in Supabase
  - [ ] Add deadline → ✅ WhatsApp received
  - [ ] Check Google Calendar → ✅ event created
  - [ ] Add notice → ✅ AI summary sent

---

## Phase 2: Prepare for Deployment ✅

- [ ] Update `.env` with production URLs
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Ensure `package.json` has `"start"` script
- [ ] Update `public/index.html` with correct backend URLs
  - [ ] Replace `/register` with full API URL
  - [ ] Replace `/add-task` with full API URL
- [ ] Create `vercel.json` for frontend
- [ ] Commit all changes to GitHub

---

## Phase 3: Deploy Backend to Render ✅

- [ ] Read `DEPLOY_RENDER.md`
- [ ] Create [Render](https://render.com) account
- [ ] Connect GitHub repo
- [ ] Create new Web Service
- [ ] Set environment variables:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `N8N_WEBHOOK_URL` (production)
  - [ ] `PORT=3000`
- [ ] Wait for deployment (2-3 min)
- [ ] Copy live Render URL
- [ ] Test `/health` endpoint ✅

---

## Phase 4: Deploy Frontend to Vercel ✅

- [ ] Read `DEPLOY_VERCEL.md`
- [ ] Create [Vercel](https://vercel.com) account
- [ ] Connect GitHub repo
- [ ] Select `campusflow` project
- [ ] Wait for deployment (2-3 min)
- [ ] Copy live Vercel URL
- [ ] Test if dashboard loads ✅

---

## Phase 5: Integration Testing (Production) ✅

- [ ] Open live frontend URL
- [ ] Register a test student
- [ ] Add a deadline task
  - [ ] ✅ Check WhatsApp (should arrive in <10 sec)
  - [ ] ✅ Check Google Calendar
- [ ] Add a notice task
  - [ ] ✅ Check WhatsApp with 3-bullet summary
- [ ] Check n8n execution logs (green)

---

## Phase 6: Final Demo Preparation ✅

- [ ] Have all passwords/keys in a secure note
- [ ] Practice the 2-minute demo script
- [ ] Have backup demo videos ready
- [ ] Test on different networks
- [ ] Ensure Twilio Sandbox is active (24-hour window)

---

## 🚀 Live URLs After Deployment

| Component | URL |
|-----------|-----|
| **Frontend (Vercel)** | https://campusflow-vXXXXXX.vercel.app |
| **Backend (Render)** | https://campusflow-backend.onrender.com |
| **n8n (Local)** | http://localhost:5678 |

---

## ⚠️ Troubleshooting

**Frontend shows errors?**
- [ ] Check browser console (F12)
- [ ] Ensure backend URL in `public/index.html` is correct
- [ ] Verify backend is running on Render

**Backend not responding?**
- [ ] Check Render deployment logs
- [ ] Ensure `.env` variables are set correctly
- [ ] Verify Supabase table exists

**WhatsApp not sending?**
- [ ] Verify Twilio Sandbox session (24-hour window)
- [ ] Check phone number format: `whatsapp:+91...`
- [ ] Check Twilio credentials in n8n

**Google Calendar not working?**
- [ ] Verify OAuth token in n8n
- [ ] Ensure email is added as test user in Google Cloud
- [ ] Check if Calendar API is enabled in GCP

---

✅ **All steps complete? You're ready to demo!** 🎉
