# 🎯 COMPLETE n8n Configuration Guide

Follow this step-by-step to fully configure your CampusFlow n8n workflow.

---

## ✅ 1. Twilio WhatsApp Setup

### Get Your Credentials:
1. Go to [Twilio Console](https://console.twilio.com)
2. Go to **Account** (bottom left) → Copy **Account SID**
3. Go to **Auth Token** (top right) → Copy it
4. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
5. You'll see a **Sandbox number** (e.g., `+14155238886`) and a **join code**
6. From your phone, send the join code to the Sandbox number to activate

### Configure in n8n:
1. Open your n8n workflow (http://localhost:5678)
2. Double-click the **Twilio Node** (for Deadline)
3. Click **"Create new"** under Credentials
4. Paste your **Account SID** and **Auth Token**
5. Set:
   - **From:** `whatsapp:+14155238886` (the Twilio Sandbox number)
   - **To:** `{{ $json.phone }}` (dynamic - will use the user's number from the request)
   - **Message:** `Reminder: {{ $json.title }} on {{ $json.date }}`

6. Do the same for the **second Twilio Node** (for Notice/AI summary)

---

## ✅ 2. Google Calendar OAuth Setup

### Create OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: **CampusFlow**
3. Go to **APIs & Services** → **Library**
4. Search for **"Google Calendar API"** → Click it → **Enable**
5. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
6. Choose **Web application**
7. Add **Authorized redirect URIs:**
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```
   *(Add both `http://localhost:...` for local testing AND your Render URL later)*

8. Copy **Client ID** and **Client Secret**

### Configure in n8n:
1. In your n8n workflow, double-click the **Google Calendar Node**
2. Click **"Create new"** under Credentials
3. Paste your **Client ID** and **Client Secret**
4. Click **"Sign in with Google"** and authorize
5. Set:
   - **Calendar:** Primary
   - **Title:** `{{ $json.title }}`
   - **Start Time:** `{{ $json.date }}`
   - **Description:** `{{ $json.description }}`

---

## ✅ 3. OpenAI API Setup

### Get Your API Key:
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Go to **API keys** → **Create new secret key**
3. Copy it (you won't see it again!)

### Configure in n8n:
1. In your n8n workflow, double-click the **OpenAI Node**
2. Click **"Create new"** under Credentials
3. Paste your **API Key**
4. Set:
   - **Model:** `gpt-3.5-turbo`
   - **Messages:** Add a message with:
     - **Role:** user
     - **Content:** `Summarize this into exactly 3 short bullet points:\n{{ $json.description }}`

*(If OpenAI is too expensive, use Groq instead - completely free)*

---

## ✅ 4. Activate Your Workflow

1. In n8n, click the **"Activate"** toggle (top right)
2. Copy the **Production Webhook URL** (it changes when activated)
3. Update your backend `.env`:
   ```
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/campusflow
   ```
4. Restart your Express server: `node src/index.js`

---

## 🧪 Test the Full Workflow

1. Go to http://localhost:3000
2. Register a student
3. Submit a **Deadline** task:
   - Title: "DBMS Assignment"
   - Description: "Submit the database project"
   - Date: Any future date
   - Type: "deadline"
4. **Check your phone** - You should receive a WhatsApp message within 5-10 seconds ✅
5. **Check Google Calendar** - The event should appear ✅
6. Submit a **Notice** task:
   - Title: "Campus WiFi Maintenance"
   - Description: "The campus WiFi will be down Friday 2-4 AM for maintenance. Please save your work."
   - Type: "notice"
7. **Check WhatsApp** - You should get a 3-bullet summary ✅

---

If all green checkmarks appear, move to the deployment steps!
