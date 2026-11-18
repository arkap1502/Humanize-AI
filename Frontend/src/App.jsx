import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { humanizer } from './humanizer';
import { analyzeText } from './detector';
import './App.css';

// Set VITE_API_URL to your deployed backend URL (e.g. https://humanize-ai.onrender.com)
// to use a separate server. When unset, local development calls the same
// origin (Vite proxies /api to http://localhost:5000) and any other host
// (e.g. GitHub Pages) humanizes locally in-browser with no network request.
const IS_LOCAL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_URL = import.meta.env.VITE_API_URL || (IS_LOCAL ? window.location.origin : '');

// Lucide line icons, 1.75px stroke, rendered inline so the app works offline.
const ICON_PATHS = {
  'pen-line': (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  'wand-sparkles': (
    <>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'trash-2': (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  copy: (
    <>
      <rect width="8" height="8" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  loader: (
    <>
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </>
  ),
  'arrow-down-right': (
    <>
      <path d="m7 7 10 10" />
      <path d="M17 7v10H7" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  'clipboard-paste': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14h6" />
      <path d="M9 18h6" />
      <path d="M9 10h6" />
    </>
  ),
  gauge: (
    <>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </>
  ),
  maximize: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </>
  ),
  minimize: (
    <>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </>
  ),
};

function Icon({ name, size = 16, className = '' }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function ScorePanel({ title, analysis, delta }) {
  const [open, setOpen] = useState(false);

  if (!analysis) return null;

  if (!analysis.reliable) {
    return (
      <div className="score">
        <span className="score-label">{title}</span>
        <p className="score-empty">Too short to score. Paste at least 15 words.</p>
      </div>
    );
  }

  const drop = typeof delta === 'number' && delta !== 0;

  return (
    <div className="score">
      <div className="score-head">
        <div>
          <span className="score-label">{title}</span>
          <div className="score-figure">
            <span className="score-value">{analysis.score}%</span>
            <span className="status">{analysis.label}</span>
            {drop && (
              <span className="status">
                <Icon name={delta > 0 ? 'arrow-down-right' : 'arrow-up-right'} size={16} />
                {Math.abs(delta)} pts {delta > 0 ? 'lower' : 'higher'}
              </span>
            )}
          </div>
        </div>
        {analysis.signals.length > 0 && (
          <button
            type="button"
            className="disclosure"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Why this score?
            <Icon name="chevron-down" size={16} />
          </button>
        )}
      </div>

      <div
        className="score-track"
        role="img"
        aria-label={`${analysis.score} percent AI likelihood, ${analysis.label.toLowerCase()}`}
      >
        <div className="score-fill" style={{ width: `${analysis.score}%` }} />
      </div>

      {open && (
        <ul className="signals">
          {analysis.signals.map((signal, index) => (
            <li key={index}>
              <span className="sig-points">
                {signal.points > 0 ? `+${signal.points}` : signal.points}
              </span>
              <span>
                {signal.label}
                <span className="sig-detail">{signal.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="score-foot">
        Heuristic estimate from writing signals. External AI detectors may score differently.
      </p>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      // Some browsers and embedded webviews block the Fullscreen API.
      console.warn('Fullscreen unavailable:', err);
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize.');
      return;
    }

    setLoading(true);
    setError('');
    setOutputText('');
    setCopied(false);

    try {
      let humanized;

      if (API_URL) {
        try {
          const response = await axios.post(`${API_URL}/api/humanize`, {
            text: inputText,
            intensity: intensity,
          });
          humanized = response.data.humanized;
        } catch (apiErr) {
          // Backend unreachable — fall back to in-browser humanization
          console.warn('API unavailable, using local humanizer:', apiErr);
          humanized = humanizer.humanize(inputText, intensity);
        }
      } else {
        // No backend configured (GitHub Pages) — humanize locally
        await new Promise((resolve) => setTimeout(resolve, 300));
        humanized = humanizer.humanize(inputText, intensity);
      }

      setOutputText(humanized);
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
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
    } catch (err) {
      setError('Could not copy automatically. Select the text and copy it manually.');
      console.error('Copy failed:', err);
    }
  };

  // AI-likelihood scores are computed locally & instantly (same estimator
  // the backend uses), so they work offline and on GitHub Pages.
  const inputScore = inputText.trim() ? analyzeText(inputText) : null;
  const outputScore = outputText ? analyzeText(outputText) : null;
  const scoreDelta =
    inputScore && inputScore.reliable && outputScore && outputScore.reliable
      ? inputScore.score - outputScore.score
      : null;
  const inputWords = countWords(inputText);
  const outputWords = outputText ? countWords(outputText) : 0;
  const intensityLabel =
    intensity === 'light' ? 'Light' : intensity === 'strong' ? 'Strong' : 'Medium';

  return (
    <div className="app" id="top">
      <header className="site-header">
        <div className="shell nav">
          <a className="brand" href="#top">
            <span className="brand-mark">
              <Icon name="pen-line" size={16} />
            </span>
            Humanize AI
          </a>
          <div className="nav-actions">
            <a className="nav-link" href="#how">
              How it works
            </a>
            <button
              type="button"
              className="icon-button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
              title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            >
              <Icon name={isFullscreen ? 'minimize' : 'maximize'} size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="workspace-screen" id="tool">
          <div className="toolbar">
            <div className="toolbar-copy">
              <h1>Humanize your text</h1>
              <p>Paste AI-generated text, choose an intensity, then compare the result side by side.</p>
            </div>

            <div className="toolbar-actions">
              <div className="control-field">
                <div className="field-head">
                  <label className="field-label" htmlFor="intensity">
                    Intensity
                  </label>
                </div>
                <div className="select-wrap">
                  <select
                    id="intensity"
                    value={intensity}
                    onChange={(event) => setIntensity(event.target.value)}
                  >
                    <option value="light">Light: subtle edits</option>
                    <option value="medium">Medium: balanced</option>
                    <option value="strong">Strong: casual</option>
                  </select>
                  <Icon name="chevron-down" size={16} className="select-icon" />
                </div>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleHumanize}
                  disabled={loading}
                  aria-busy={loading}
                >
                  <Icon name={loading ? 'loader' : 'wand-sparkles'} size={16} />
                  {loading ? 'Processing…' : 'Humanize text'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleClear}
                  disabled={loading}
                >
                  <Icon name="trash-2" size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="workspace">
            <section className="pane" aria-labelledby="input-heading">
              <div className="pane-head">
                <div>
                  <h2 id="input-heading">Input</h2>
                  <p className="pane-meta">
                    {inputWords} {inputWords === 1 ? 'word' : 'words'}
                  </p>
                </div>
              </div>

              <div className="pane-body">
                <textarea
                  id="input-text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Paste your AI-generated text here…"
                  aria-label="Your text"
                />

                {error && (
                  <div className="alert" role="alert">
                    <Icon name="alert-circle" size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <ScorePanel title="AI likelihood" analysis={inputScore} />
              </div>
            </section>

            <section className="pane pane-result" aria-labelledby="result-heading">
              <div className="pane-head">
                <div>
                  <h2 id="result-heading">Result</h2>
                  <p className="pane-meta">
                    {outputText
                      ? `${intensityLabel} intensity · ${outputWords} words`
                      : 'Waiting for text'}
                  </p>
                </div>
                {outputText && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    <Icon name={copied ? 'check' : 'copy'} size={16} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="pane-body">
                {outputText ? (
                  <div className="result-text">{outputText}</div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">
                      <Icon name="pen-line" size={18} />
                    </span>
                    <p>Your humanized text will appear here.</p>
                    <span className="empty-hint">Add text on the left, then choose Humanize.</span>
                  </div>
                )}

                <ScorePanel
                  title="AI likelihood"
                  analysis={outputScore}
                  delta={scoreDelta}
                />
              </div>
            </section>
          </div>
        </section>

        <section className="shell how" id="how">
          <div className="section-head">
            <h2>How it works</h2>
            <p>Three steps, no sign-up, no upload required.</p>
          </div>
          <ol className="steps">
            <li className="step">
              <span className="step-icon">
                <Icon name="clipboard-paste" size={18} />
              </span>
              <h3>Paste and detect</h3>
              <p>Your text is scored live for AI signals: marker phrases, uniform sentences, repeated openers.</p>
            </li>
            <li className="step">
              <span className="step-icon">
                <Icon name="wand-sparkles" size={18} />
              </span>
              <h3>Humanize</h3>
              <p>Pick light, medium, or strong. Stiff phrasing is rewritten, long sentences split, rhythm varied.</p>
            </li>
            <li className="step">
              <span className="step-icon">
                <Icon name="gauge" size={18} />
              </span>
              <h3>Verify the score</h3>
              <p>Watch the AI-likelihood percentage drop and inspect exactly which signals were removed.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <span>Humanize AI runs entirely in your browser.</span>
          <span>Scores are an estimate, not a guarantee.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
