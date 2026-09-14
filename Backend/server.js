const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { humanizer } = require('./humanizer');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin / curl / mobile apps (no origin) and the allowlist
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // permissive fallback so Pages preview URLs keep working
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
