# Humanize AI - Text Humanization Tool

A powerful web application that converts AI-generated text into natural, human-like writing.

## Features

- **Multiple Intensity Levels**: Choose between light, medium, and strong humanization
- **Real-time Processing**: Instant text transformation
- **Smart Algorithms**: Advanced pattern recognition to identify AI-like phrasing
- **User-Friendly Interface**: Clean, modern design with intuitive controls
- **Statistics**: Track word count changes between original and humanized text
- **Copy to Clipboard**: Easily copy results for use in other applications

## Project Structure

```
Humanize Ai/
├── Backend/
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
└── README.md
```

## Quick Preview in VS Code (Live Server, no build needed)

VS Code's Live Server extension only serves **static files** — it cannot run the
React dev server or the Express backend. So this repo includes a zero-build copy
of the app in `live-demo/` (same UI, same styles, same humanizer engine):

```
live-demo/
├── index.html     # same UI as the React app
├── styles.css     # same styles (copied from Frontend/src/*.css)
├── app.js         # same logic as App.js, in plain JavaScript
└── humanizer.js   # same engine (works fully offline in the browser)
```

1. Install the **Live Server** extension in VS Code (by Ritwick Dey).
2. Right-click `live-demo/index.html` → **Open with Live Server**.
3. The app opens at `http://127.0.0.1:5500/live-demo/index.html` and works
   immediately — no `npm install`, no build step.
4. Tip: if you also run the backend (`Backend` → `npm start`), the page will
   automatically use the API instead of the built-in engine.

> Do NOT just double-click `index.html` — browsers block ES modules on
> `file://` URLs, so you must open it through Live Server (http).

## Deployment (GitHub Pages)

The frontend is fully static-ready: if no backend URL is configured, it humanizes
text locally in the browser (`Frontend/src/humanizer.js`, a client-side port of the
backend logic). A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds
`Frontend/` and deploys it to GitHub Pages on every push to `main`.

One-time setup:
1. Push this repo to GitHub (see note below about `node_modules`).
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` — the site will be live at
   `https://<your-username>.github.io/Humanize-Ai/`.

> **Important:** `Backend/node_modules` was previously committed by accident and has
> been removed from git tracking. Commit the deletion plus the new root `.gitignore`
> so future pushes stay small:
> ```bash
> git add -A
> git commit -m "Fix GitHub deployment: static fallback, Pages workflow, ignore node_modules"
> git push origin main
> ```

### Optional: use the live backend instead of local humanization
1. Deploy `Backend/` to Render/Railway/Fly (start command: `npm start`, it respects `PORT`).
2. In the GitHub repo, set `REACT_APP_API_URL` in the `deploy.yml` build env
   (or a `BACKEND_URL` secret) to your backend URL, e.g.
   `https://humanize-ai.onrender.com`.
3. Local development still uses `http://localhost:5000` — create
   `Frontend/.env` from `.env.example` if you want to override it.

## Setup Instructions (local)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Paste your AI-generated text into the input area
4. Select the desired humanization intensity:
   - **Light**: Subtle changes, preserves formal structure
   - **Medium**: Balanced approach with natural phrasing
   - **Strong**: More casual, conversational tone
5. Click "Humanize Text" to process
6. Copy the result using the "Copy to Clipboard" button

## API Endpoints

### POST /api/humanize
Humanizes a single text input.

**Request:**
```json
{
  "text": "Your AI-generated text here",
  "intensity": "medium"
}
```

**Response:**
```json
{
  "original": "Your AI-generated text here",
  "humanized": "Your humanized text here",
  "intensity": "medium"
}
```

### POST /api/batch-humanize
Humanizes multiple texts at once.

**Request:**
```json
{
  "texts": ["Text 1", "Text 2", "Text 3"],
  "intensity": "medium"
}
```

**Response:**
```json
{
  "results": [
    {
      "original": "Text 1",
      "humanized": "Humanized text 1"
    },
    {
      "original": "Text 2",
      "humanized": "Humanized text 2"
    }
  ],
  "intensity": "medium"
}
```

## How It Works

AI detectors mainly measure signals like repetitive sentence openers ("Moreover…,
Furthermore…"), uniform sentence length (no burstiness), and known AI-marker
phrases ("delve", "tapestry", "it is important to note", …). The engine
(`shared/humanizer.js`) attacks exactly those signals:

- **Deterministic replacement**: every matching pattern is always applied
  (no randomness), with **case preserved** ("Furthermore" → "Also") and
  **word boundaries** respected ("implementation" → "use", never "Useation").
- **AI-marker list**: curated detector-trigger phrases mapped to natural wording.
- **Burstiness**: long uniform sentences are split at natural joints into mixed
  short/long ones; semicolons become full stops; contractions added.
- **Opener rotation**: consecutive sentences never start with the same opener.
- **Intensity layers**: light = wording only; medium = + sentence splitting;
  strong = + more aggressive splitting and one casual touch.

> Honest note: no tool can guarantee a 0% AI score on every detector — detectors
> change constantly. This engine removes the strongest, well-known signals, which
> is what measurably lowers scores.

### Editing the engine

There is ONE source file: `shared/humanizer.js`. The three platform copies are
generated — never edit them by hand:

```bash
node scripts/sync-humanizer.js
# regenerates Frontend/src/humanizer.js, live-demo/humanizer.js, Backend/humanizer.js
```

## Technology Stack

### Backend
- Node.js
- Express.js
- CORS
- Body-parser

### Frontend
- React 18
- Axios
- CSS3

## Development

### Adding New Patterns
To add new humanization patterns, edit the `aiPatterns` array in `Backend/server.js`:

```javascript
{ pattern: /your_pattern/gi, replacement: 'your_replacement' }
```

### Customizing Intensity Levels
Modify the `patternCount` logic in the `humanize` method to adjust how many patterns are applied at each intensity level.

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!