import React, { useState } from 'react';
import axios from 'axios';
import { humanizer } from './humanizer';
import { analyzeText } from './detector';
import './App.css';

// Set REACT_APP_API_URL to your deployed backend URL (e.g. https://humanize-ai.onrender.com)
// to use the server. When unset (e.g. GitHub Pages), the app humanizes locally in-browser.
const API_URL = process.env.REACT_APP_API_URL || '';

function ScoreCard({ title, analysis, delta }) {
  const [showSignals, setShowSignals] = useState(false);

  if (!analysis) return null;

  if (!analysis.reliable) {
    return (
      <div className="score-card">
        <div className="score-top">
          <span className="score-title">{title}</span>
          <span className="score-note">Too short to score — paste 15+ words</span>
        </div>
      </div>
    );
  }

  const level = analysis.score >= 60 ? 'high' : analysis.score >= 35 ? 'mid' : 'low';

  return (
    <div className="score-card">
      <div className="score-top">
        <span className="score-title">{title}</span>
        <span className={`score-num ${level}`}>{analysis.score}%</span>
        <span className="score-label">{analysis.label}</span>
        {typeof delta === 'number' && delta !== 0 && (
          <span className={`score-delta ${delta > 0 ? 'good' : 'bad'}`}>
            {delta > 0 ? `−${delta}` : `+${-delta}`} pts vs input
          </span>
        )}
      </div>
      <div className="score-bar">
        <div className={`score-fill ${level}`} style={{ width: `${analysis.score}%` }} />
      </div>
      {analysis.signals.length > 0 && (
        <button
          type="button"
          className="score-toggle"
          onClick={() => setShowSignals(!showSignals)}
        >
          {showSignals ? 'Hide details ▲' : 'Why this score? ▼'}
        </button>
      )}
      {showSignals && (
        <ul className="signals-list">
          {analysis.signals.map((s, i) => (
            <li key={i}>
              <span className={`sig-pts ${s.points > 0 ? 'pos' : 'neg'}`}>
                {s.points > 0 ? `+${s.points}` : s.points}
              </span>
              {' '}{s.label} <span className="score-note">({s.detail})</span>
            </li>
          ))}
        </ul>
      )}
      <div className="score-foot">Heuristic estimate from writing signals — external AI detectors may score differently.</div>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ originalWords: 0, humanizedWords: 0 });

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize');
      return;
    }

    setLoading(true);
    setError('');
    setOutputText('');

    try {
      let humanized;

      if (API_URL) {
        try {
          const response = await axios.post(`${API_URL}/api/humanize`, {
            text: inputText,
            intensity: intensity
          });
          humanized = response.data.humanized;
        } catch (apiErr) {
          // Backend unreachable — fall back to in-browser humanization
          console.warn('API unavailable, using local humanizer:', apiErr);
          humanized = humanizer.humanize(inputText, intensity);
        }
      } else {
        // No backend configured (GitHub Pages) — humanize locally
        // Small delay so the loading spinner is visible
        await new Promise((resolve) => setTimeout(resolve, 300));
        humanized = humanizer.humanize(inputText, intensity);
      }

      setOutputText(humanized);
      setStats({
        originalWords: inputText.split(/\s+/).filter(word => word.length > 0).length,
        humanizedWords: humanized.split(/\s+/).filter(word => word.length > 0).length
      });
    } catch (err) {
      setError('Failed to humanize text. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setStats({ originalWords: 0, humanizedWords: 0 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    alert('Text copied to clipboard!');
  };

  // AI-likelihood scores are computed locally & instantly (same estimator
  // the backend uses), so they work offline and on GitHub Pages.
  const inputScore = inputText.trim() ? analyzeText(inputText) : null;
  const outputScore = outputText ? analyzeText(outputText) : null;
  const scoreDelta =
    inputScore && inputScore.reliable && outputScore && outputScore.reliable
      ? inputScore.score - outputScore.score
      : null;

  return (
    <div className="App" id="top">
      <div className="bg" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="grain" />
        <div className="vignette" />
      </div>

      <nav className="nav">
        <a className="brand" href="#top">
          <span className="logo-orb" />
          Humanize AI
        </a>
        <div className="nav-links">
          <a href="#tool">Humanizer</a>
          <a href="#how">How it works</a>
        </div>
      </nav>

      <header className="hero">
        <span className="pill">AI Text Humanizer</span>
        <h1>
          Make AI text <span className="grad">sound human</span>
        </h1>
        <p className="sub">
          Paste robotic AI-generated copy, pick an intensity, and get natural
          writing back — with a live AI-likelihood score to prove it.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#tool">Humanize my text →</a>
          <a className="btn btn-ghost" href="#how">How it works</a>
        </div>
      </header>

      <main className="container" id="tool">
        <div className="tool-card">
          <div className="tool-head">
            <h2>Humanize your text</h2>
            <p>Paste AI-generated text below — everything runs instantly, right here.</p>
          </div>
          <div className="content">
          <div className="textarea-container">
            <label htmlFor="input-text">Enter AI-generated text:</label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here..."
            />
          </div>

          {inputScore && (
            <ScoreCard title="Input AI likelihood" analysis={inputScore} />
          )}

          <div className="controls">
            <div className="intensity-selector">
              <label htmlFor="intensity">Humanization Intensity:</label>
              <select
                id="intensity"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
              >
                <option value="light">Light - Subtle changes</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="strong">Strong - More casual</option>
              </select>
            </div>

            <div className="button-container">
              <button
                className="button primary-button"
                onClick={handleHumanize}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading">
                    <span className="spinner"></span>
                    Processing...
                  </span>
                ) : (
                  'Humanize Text'
                )}
              </button>
              <button
                className="button secondary-button"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {outputText && (
            <div className="result-container">
              <h3>Humanized Result:</h3>
              <div className="result-text">{outputText}</div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-value">{stats.originalWords}</div>
                  <div className="stat-label">Original Words</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{stats.humanizedWords}</div>
                  <div className="stat-label">Humanized Words</div>
                </div>
              </div>
              <button
                className="button copy-button"
                onClick={handleCopy}
                style={{ marginTop: '20px' }}
              >
                Copy to Clipboard
              </button>
              <ScoreCard title="Output AI likelihood" analysis={outputScore} delta={scoreDelta} />
            </div>
          )}
          </div>
        </div>
      </main>

      <section className="features" id="how">
        <h2>How it works</h2>
        <p>Three steps. No sign-up, no server needed — it all runs in your browser.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-num">1</span>
            <h3>Paste &amp; detect</h3>
            <p>Your text is scored live for AI signals — marker phrases, uniform sentences, repeated openers.</p>
          </div>
          <div className="feature-card">
            <span className="feature-num">2</span>
            <h3>Humanize</h3>
            <p>Pick Light, Medium or Strong. Stiff phrasing is rewritten, long sentences split, rhythm varied.</p>
          </div>
          <div className="feature-card">
            <span className="feature-num">3</span>
            <h3>Verify the score</h3>
            <p>Watch the AI-likelihood percentage drop and inspect exactly which signals were removed.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        Humanize AI — runs 100% in your browser. Built with React.
      </footer>
    </div>
  );
}

export default App;