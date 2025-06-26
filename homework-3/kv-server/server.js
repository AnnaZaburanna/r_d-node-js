import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
app.use(express.json())

const REDIS_URL  = process.env.REDIS_URL;

if (!REDIS_URL) {
    console.error('Missing REDIS_URL in .env');
    process.exit(1)
}

const PORT = 3000;

app.get('/kv/:key', async (req, res) => {
    const key = req.params.key;
    const response = await fetch(`${REDIS_URL}/get?key=${encodeURIComponent(key)}`);
    const data = await response.json();
    res.status(response.status).json(data);
})

app.post('/kv', async (req, res) => {
    const { key, value } = req.body;
    try {
        const response = await fetch(`${REDIS_URL}/set`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to write to redis-like' });
    }
})
app.listen(PORT, () => console.log(`kv-server: ${PORT}`))