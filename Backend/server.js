const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { humanizer } = require('./humanizer');
const { analyzeText } = require('./detector');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin / curl / mobile apps (no origin) and the allowlist.
    // Permissive fallback keeps preview URLs (Live Server, Pages) working.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Humanize AI API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/humanize', (req, res) => {
  try {
    const { text, intensity = 'medium' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const humanizedText = humanizer.humanize(text, intensity);

    res.json({
      original: text,
      humanized: humanizedText,
      intensity: intensity
    });
  } catch (error) {
    res.status(500).json({ error: 'Error processing text' });
  }
});

app.post('/api/detect', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    res.json(analyzeText(text));
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing text' });
  }
});

app.post('/api/batch-humanize', (req, res) => {
  try {
    const { texts, intensity = 'medium' } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    const results = texts.map(text => ({
      original: text,
      humanized: humanizer.humanize(text, intensity)
    }));

    res.json({
      results: results,
      intensity: intensity
    });
  } catch (error) {
    res.status(500).json({ error: 'Error processing texts' });
  }
});

// 404 for unknown API routes (keeps frontend proxy errors readable)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or set PORT=xxxx in Backend/.env (copy from .env.example).`);
      process.exit(1);
    }
    throw err;
  });
  return server;
}

// Only auto-listen when run directly (`node server.js` / `npm start`).
// Requiring this file (e.g. in tests) must not bind a port as a side effect.
if (require.main === module) {
  startServer();
}

module.exports = app;
