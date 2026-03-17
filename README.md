# CampusFlow

CampusFlow is an AI-powered student productivity system that integrates WhatsApp reminders, Google Calendar, and AI summaries using automation (n8n).

---

## 🔄 COMPLETE Data Flow

Here is the step-by-step flow of how the system operates:

1. **User Registration:** 
   * **User** sends details via API (`POST /register`).
   * **Backend (Node.js/Express)** saves the name, phone number, and Gmail to the **Supabase Database**.
2. **Task Creation:**
   * **User** submits a new task via API (`POST /add-task`). The payload contains title, description, date, and `type` (deadline or notice).
   * **Backend** immediately forwards this payload to the **n8n Webhook**.
3. **Automation Routing (n8n):**
   * **n8n** receives the payload and triggers an **IF Node**.
4. **Branch A (If `type == deadline`):**
   * *(Optional)* **Google Calendar Node** creates an event using the student's email and deadline date.
   * **Twilio WhatsApp** sends a WhatsApp message notifying the student of the upcoming deadline.
5. **Branch B (If `type == notice`):**
   * **OpenAI Node** takes the long notice description and prompts the AI to generate exactly 3 short bullet points.
   * **Twilio Node** sends the summarized bullet points as a readable WhatsApp message to the student.

---

## ⚙️ Tech Stack (STRICT)

*   **Backend:** Node.js + Express
*   **Database:** Supabase (PostgreSQL)
*   **Automation:** n8n (Webhook-based logic)
*   **Messaging:** Twilio WhatsApp Sandbox (Free tier)
*   **AI Summary:** OpenAI (ChatGPT) / Groq API (Free tier ready)
*   **Calendar:** Google Calendar API (via n8n OAuth2)

---

## 🛠️ FULL Setup Guide

### 1. Supabase Connection
1. Go to [Supabase](https://supabase.com/) and create a project.
2. Open the SQL Editor and run:
   ```sql
   create table users (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     phone text not null,
     email text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```
3. Copy your `Project URL` and `anon public` key to the `.env` file in the backend folder.

### 2. Twilio Sandbox Setup
1. Log in to the [Twilio Console](https://console.twilio.com).
2. Go to **Messaging > Try it out > Send a WhatsApp message**.
3. You will see a Sandbox number (e.g., `+14155238886`) and a join code (e.g., `join routing-elephant`).
4. Send the join code to the Sandbox number from your personal WhatsApp to activate the session.
5. **IMPORTANT:** Your phone number format in the API requests MUST exactly match the Twilio requirement: `whatsapp:+1234567890`.

### 3. Google OAuth Setup (Calendar API)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and navigate to **APIs & Services > Library**. Enable the **Google Calendar API**.
3. Go to **OAuth consent screen**, set it up (External/Testing context), and add your test email addresses.
4. Go to **Credentials**, create an **OAuth client ID** (Web application). Add n8n's redirect URI (e.g., `http://localhost:5678/rest/oauth2-credential/callback`).
5. Keep your Client ID and Client Secret ready for n8n.

### 4. Backend Setup
1. Make sure you are in the project root. Install dependencies: `npm install`
2. Create your `.env` file from the example: `cp .env.example .env`
3. Fill in `SUPABASE_URL`, `SUPABASE_KEY` (from step 1).
4. Run the server: `node src/index.js`

### 5. n8n Setup
1. Start n8n Desktop or Docker instance.
2. In the top right, click the options menu -> **Import from File**. Select `n8n/campusflow_workflow.json`.
3. Open the **Webhook Node**: 
   * Note the difference between the **Test URL** (used when building/executing manually) and the **Production URL** (used when workflow is active). 
   * Copy the URL you intend to use to your backend `.env` file as `N8N_WEBHOOK_URL`. Restart your node backend.
4. Add Credentials for Google Calendar (using Client ID/Secret from Step 3), Twilio (using Account SID and Auth Token), and OpenAI.
   *Note:* If your n8n Twilio node only supports `Call/SMS/Custom API Call`, send WhatsApp via an **HTTP Request** node calling Twilio's Messages API (documented in `N8N_SETUP.md`).
5. **Activate** the workflow!

---

## 📚 Complete Documentation

Start with these guides in order (left-to-right):

1. **[N8N_SETUP.md](N8N_SETUP.md)** — Configure Twilio, Google Calendar, OpenAI in n8n
2. **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)** — Deploy Node.js backend to Render
3. **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** — Deploy frontend to Vercel
4. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** — Final checklist before demo

---

## 🧪 TESTING & DEMOING

You no longer *need* to use Postman! CampusFlow now ships with a built-in interactive dashboard.

1.  Make sure your Express server is running: `node src/index.js`
2.  Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
3.  **Step 1:** Fill out the "Register Student" form. This saves the user to Supabase.
4.  **Step 2:** Ensure your n8n workflow is in **Execute Workflow** mode.
5.  **Step 3:** Fill out the "Submit to CampusFlow" form to trigger the Deadline or Notice automation!

*(If you still prefer Postman, the payloads are the exact same as below)*

### Postman Details (Optional)

### 1. Register User
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/register`
*   **Body:**
```json
{
  "name": "Hackathon Judge",
  "phone": "whatsapp:+1234567890",
  "email": "judge.tester@gmail.com"
}
```
*(Replace with your actual Twilio-verified WhatsApp number and Gmail)*

### 2. Add Deadline Task (WhatsApp + Calendar)
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/add-task`
*   **Body:**
```json
{
  "title": "Submit Hackathon Project",
  "description": "Upload the final repository link and video demo to Devpost.",
  "date": "2026-03-20T18:00:00.000Z",
  "phone": "whatsapp:+1234567890",
  "email": "judge.tester@gmail.com",
  "type": "deadline"
}
```

### 3. Add Notice Task (AI Summary + WhatsApp)
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/add-task`
*   **Body:**
```json
{
  "title": "Wifi Maintenance",
  "description": "The campus Wifi network will be undergoing scheduled maintenance this Friday from 2 AM to 4 AM. Please save your work beforehand. No connections will be allowed during this period. Contact IT for emergencies.",
  "date": "2026-03-19T02:00:00.000Z",
  "phone": "whatsapp:+1234567890",
  "email": "judge.tester@gmail.com",
  "type": "notice"
}
```

---

## 🐛 DEBUGGING GUIDE (IMPORTANT)

**Issue 1: WhatsApp not sending**
* **Fix:** The backend relies on Twilio's Sandbox. Ensure you have sent the "join <keyword>" message to the Twilio Sandbox within the last 24 hours. Check that the `phone` variable in your request uses the correct schema: `whatsapp:+1234567890`.

**Issue 2: n8n webhook not triggering**
* **Fix:** Check if the workflow is set to "Active". If it is INACTIVE, you MUST use the Webhook "Test URL" and click "Execute Workflow" in n8n *before* sending the Postman request. If ACTIVE, ensure your Express backend `.env` is pointing to the "Production URL" provided by the Webhook Node.

**Issue 3: Google Calendar not creating events**
* **Fix:** Check the `email` you registered. It must exactly match an email address your Google Cloud OAuth app has permission to access (it must be added to "Test Users" in the OAuth consent screen if your App is in 'Testing' mode). Also verify the Calendar API is enabled in GCP.

---

## 🎙️ 2-MINUTE DEMO SCRIPT

**(0:00 - 0:15) Intro & Register User**
* *"Hi everyone, we built CampusFlow, an AI-powered student productivity system that handles deadlines and college notices natively through WhatsApp. Let's start by registering a student."*
* *(Switch to Postman, hit send on `POST /register`)*
* *"We've successfully saved the student's name, WhatsApp number, and Gmail to our Supabase database in real-time."*

**(0:15 - 0:45) Add Deadline → WhatsApp & Calendar**
* *"Now, a professor sets a new assignment deadline. Let's trigger the deadline API."*
* *(Hit send on Postman `POST /add-task` with `deadline` payload)*
* *"Our backend catches this and forwards it directly to n8n. Because it's a deadline, n8n orchestrates two actions in parallel. As you can see on my phone right here..."* *(Hold up phone)* *"...we just received a real Twilio WhatsApp notification."*
* *"And if we flip over to Google Calendar..."* *(Switch tab to Calendar)* *"...boom! The event is already created in the student's schedule natively."*

**(0:45 - 1:30) Add Notice → AI Summary**
* *"But what about those long, boring college notices? Let's send a 100-word announcement about Wifi downtime."*
* *(Hit send on Postman `POST /add-task` with `notice` payload)*
* *"Nobody reads long emails. Our n8n workflow routes this notice to OpenAI, prompts it to summarize it into exactly 3 bullet points, and instantly blasts it out."*
* *(Hold up phone again)* *"Look at WhatsApp—we just received a 3-bullet, concise summary of that massive text block sent directly to the student."*

**(1:30 - 2:00) Show Automation & Outro**
* *"Let's peek under the hood at the n8n logs."* *(Switch to n8n executions screen)* *"You can see our Webhook receiving the payload, our IF node successfully routing deadlines vs notices, our integrations 100% green, and the exact AI prompt processing live."*
* *"CampusFlow eliminates missed deadlines using the platforms students already check every day. Everything works completely seamlessly today. Thank you!"*