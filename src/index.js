require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ENV VARIABLES
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!SUPABASE_URL || !SUPABASE_KEY || !N8N_WEBHOOK_URL) {
    console.warn("⚠️ Missing ENV variables. Check SUPABASE_URL, SUPABASE_KEY, N8N_WEBHOOK_URL");
}

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalizePhone(input) {
    if (typeof input !== 'string') return '';
    const trimmed = input.trim();
    const noWhatsapp = trimmed.replace(/^whatsapp:/i, '');
    // Expect E.164-ish like +9186..., but don't over-correct here.
    return noWhatsapp;
}

function toWhatsAppNumber(e164) {
    if (!e164) return '';
    return e164.toLowerCase().startsWith('whatsapp:') ? e164 : `whatsapp:${e164}`;
}


// =========================
// HEALTH CHECK
// =========================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});


// =========================
// REGISTER USER
// =========================
app.post('/register', async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        const normalizedPhone = normalizePhone(phone);

        if (!name || !normalizedPhone || !email) {
            return res.status(400).json({
                error: 'Missing required fields: name, phone, email'
            });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, phone: normalizedPhone, email }])
            .select();

        if (error) {
            console.error('❌ Supabase Error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: data[0]
        });

    } catch (err) {
        console.error('❌ Registration Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// =========================
// ADD TASK / NOTICE
// =========================
app.post('/add-task', async (req, res) => {
    try {
        const { title, description, date, phone, email, type, priority } = req.body;

        const normalizedPhone = normalizePhone(phone);
        const whatsappPhone = toWhatsAppNumber(normalizedPhone);

        // Validation
        if (!title || !description || !date || !normalizedPhone || !email || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['deadline', 'notice'].includes(type)) {
            return res.status(400).json({
                error: 'Type must be "deadline" or "notice"'
            });
        }

        // Payload for n8n
        const payload = {
            title,
            description,
            date,
            phone: normalizedPhone,      // +91XXXXXXXXXX (no whatsapp: prefix)
            whatsapp: whatsappPhone,     // whatsapp:+91XXXXXXXXXX
            email,
            type,
            priority: priority || 'normal'
        };

        if (!N8N_WEBHOOK_URL) {
            return res.status(500).json({
                error: 'N8N_WEBHOOK_URL is not set on the backend'
            });
        }

        // DEBUG LOGS
        console.log('🚀 Sending to n8n webhook:', N8N_WEBHOOK_URL);
        console.log('📦 Payload:', payload);

        // CALL n8n WEBHOOK
        const n8nResponse = await axios.post(N8N_WEBHOOK_URL, payload);

        res.status(200).json({
            message: 'Task sent to automation workflow successfully',
            data: n8nResponse.data
        });

    } catch (error) {
        const isProd = process.env.NODE_ENV === 'production';
        const status = error.response?.status || 500;
        const details = error.response?.data;

        const extractMessage = (value) => {
            if (!value) return '';
            if (typeof value === 'string') return value;
            if (typeof value === 'object') {
                const direct = value.message || value.error || value.hint;
                if (typeof direct === 'string') return direct;
            }
            return '';
        };

        const messageParts = [];
        const top = extractMessage(details) || error.message || 'Unknown error';
        messageParts.push(top);

        if (details && typeof details === 'object') {
            const hint = extractMessage(details.hint);
            const nested = extractMessage(details.details) || extractMessage(details.error) || extractMessage(details.cause);
            const nestedHint = extractMessage(details.details?.hint) || extractMessage(details.error?.hint) || extractMessage(details.cause?.hint);

            if (nested && nested !== top) messageParts.push(nested);
            if (nestedHint) messageParts.push(nestedHint);
            if (hint && !messageParts.includes(hint)) messageParts.push(hint);
        }

        const message = messageParts.filter(Boolean).join(' — ');

        console.error('❌ n8n call failed:', { status, message, details });

        res.status(status >= 400 && status < 600 ? status : 500).json({
            error: message,
            ...(isProd ? {} : { details })
        });
    }
});


// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});