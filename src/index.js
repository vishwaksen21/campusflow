require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve the frontend UI

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!SUPABASE_URL || !SUPABASE_KEY || !N8N_WEBHOOK_URL) {
    console.warn("⚠️ Missing Environment Variables. Please set SUPABASE_URL, SUPABASE_KEY, and N8N_WEBHOOK_URL.");
}

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Register User
app.post('/register', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        
        if (!name || !phone || !email) {
            return res.status(400).json({ error: 'Missing required fields: name, phone, email' });
        }

        if (!supabase) {
             return res.status(500).json({ error: 'Supabase client not initialized' });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, phone, email }])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'User registered successfully', user: data[0] });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add Task / Notice
app.post('/add-task', async (req, res) => {
    try {
        const { title, description, date, phone, email, type, priority } = req.body;

        if (!title || !description || !date || !phone || !email || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (type !== 'deadline' && type !== 'notice') {
            return res.status(400).json({ error: 'Type must be "deadline" or "notice"' });
        }

        const payload = {
            title,
            description,
            date,
            phone,
            email,
            type,
            priority: priority || 'normal'
        };

        // Trigger n8n Webhook
        const n8nResponse = await axios.post(N8N_WEBHOOK_URL, payload);

        res.status(200).json({ 
            message: 'Task created and sent to automation workflow', 
            n8nResponse: n8nResponse.data 
        });

    } catch (error) {
        console.error('Task Addition Error:', error.message);
        res.status(500).json({ error: 'Failed to process task' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
