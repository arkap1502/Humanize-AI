// Static-demo wiring (mirrors Frontend/src/App.js).
// Tries the backend API first (if you ran `npm start` in Backend/),
// otherwise humanizes locally in the browser — same as the GitHub Pages build.
import { humanizer } from './humanizer.js';
import { analyzeText } from './detector.js';

const API_URL = 'http://localhost:5000';

const inputText = document.getElementById('input-text');
const intensitySelect = document.getElementById('intensity');
const humanizeBtn = document.getElementById('humanize-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const errorSection = document.getElementById('error-section');
const errorBox = document.getElementById('error');
const resultSection = document.getElementById('result-section');
const resultMeta = document.getElementById('result-meta');
const resultText = document.getElementById('result-text');
const originalWords = document.getElementById('original-words');
const humanizedWords = document.getElementById('humanized-words');
const wordCount = document.getElementById('word-count');
const inputScoreBox = document.getElementById('input-score');
const outputScoreBox = document.getElementById('output-score');
let lastInputScore = null;
let copyTimer = null;

// Lucide line icons, 1.75px stroke (same set as the React app).
const ICONS = {
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'arrow-down-right': '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  copy: '<rect width="8" height="8" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'wand-sparkles':
    '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
  loader:
    '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
};

function icon(name, size = 16) {
  return (
    '<svg class="icon" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    ICONS[name] +
    '</svg>'
  );
}

const DEFAULT_BTN_HTML = icon('wand-sparkles') + 'Humanize text';
const LOADING_BTN_HTML = icon('loader') + 'Processing…';
const COPY_BTN_HTML = icon('copy') + '<span>Copy</span>';
const COPIED_BTN_HTML = icon('check') + '<span>Copied</span>';

function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function wordsLabel(count) {
  return count + (count === 1 ? ' word' : ' words');
}

function showError(message) {
  errorBox.textContent = message;
  errorSection.style.display = message ? 'block' : 'none';
}

function renderScore(box, title, analysis, delta) {
  if (!analysis) {
    box.replaceChildren();
    return;
  }

  const panel = document.createElement('div');
  panel.className = 'score';

  if (!analysis.reliable) {
    const label = document.createElement('span');
    label.className = 'score-label';
    label.textContent = title;
    const empty = document.createElement('p');
    empty.className = 'score-empty';
    empty.textContent = 'Too short to score. Paste at least 15 words.';
    panel.append(label, empty);
    box.replaceChildren(panel);
    return;
  }

  const head = document.createElement('div');
  head.className = 'score-head';

  const identity = document.createElement('div');
  const label = document.createElement('span');
  label.className = 'score-label';
  label.textContent = title;

  const figure = document.createElement('div');
  figure.className = 'score-figure';

  const value = document.createElement('span');
  value.className = 'score-value';
  value.textContent = analysis.score + '%';

  const status = document.createElement('span');
  status.className = 'status';
  status.textContent = analysis.label;

  figure.append(value, status);

  if (typeof delta === 'number' && delta !== 0) {
    const deltaChip = document.createElement('span');
    deltaChip.className = 'status';
    deltaChip.innerHTML = icon(delta > 0 ? 'arrow-down-right' : 'arrow-up-right', 16);
    deltaChip.appendChild(
      document.createTextNode(
        Math.abs(delta) + ' pts ' + (delta > 0 ? 'lower' : 'higher') + ' than input'
      )
    );
    figure.appendChild(deltaChip);
  }

  identity.append(label, figure);
  head.appendChild(identity);

  let disclosures = null;
  if (analysis.signals.length > 0) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'disclosure';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span>Why this score?</span>' + icon('chevron-down');
    head.appendChild(toggle);

    disclosures = document.createElement('ul');
    disclosures.className = 'signals';
    disclosures.hidden = true;

    analysis.signals.forEach((signal) => {
      const item = document.createElement('li');
      const points = document.createElement('span');
      points.className = 'sig-points';
      points.textContent = signal.points > 0 ? '+' + signal.points : String(signal.points);
      const body = document.createElement('span');
      body.textContent = signal.label;
      const detail = document.createElement('span');
      detail.className = 'sig-detail';
      detail.textContent = signal.detail;
      body.appendChild(detail);
      item.append(points, body);
      disclosures.appendChild(item);
    });

    toggle.addEventListener('click', () => {
      const opening = disclosures.hidden;
      disclosures.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
    });
  }

  const track = document.createElement('div');
  track.className = 'score-track';
  track.setAttribute('role', 'img');
  track.setAttribute(
    'aria-label',
    analysis.score + ' percent AI likelihood, ' + analysis.label.toLowerCase()
  );
  const fill = document.createElement('div');
  fill.className = 'score-fill';
  fill.style.width = analysis.score + '%';
  track.appendChild(fill);

  const foot = document.createElement('p');
  foot.className = 'score-foot';
  foot.textContent =
    'Heuristic estimate from writing signals. External AI detectors may score differently.';

  panel.append(head, track);
  if (disclosures) panel.appendChild(disclosures);
  panel.appendChild(foot);
  box.replaceChildren(panel);
}

async function humanizeViaApi(text, intensity) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${API_URL}/api/humanize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, intensity }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    const data = await response.json();
    return data.humanized;
  } finally {
    clearTimeout(timeout);
  }
}

function intensityText(value) {
  return value === 'light' ? 'Light' : value === 'strong' ? 'Strong' : 'Medium';
}

async function handleHumanize() {
  const text = inputText.value;
  if (!text.trim()) {
    showError('Please enter some text to humanize.');
    return;
  }

  humanizeBtn.disabled = true;
  humanizeBtn.setAttribute('aria-busy', 'true');
  humanizeBtn.innerHTML = LOADING_BTN_HTML;
  showError('');
  resultSection.style.display = 'none';
  resultText.textContent = '';
  // Refresh the input score in case the user pasted and clicked instantly.
  lastInputScore = analyzeText(text);
  renderScore(inputScoreBox, 'Input AI likelihood', lastInputScore);

  try {
    let humanized;
    try {
      humanized = await humanizeViaApi(text, intensitySelect.value);
    } catch (apiErr) {
      // Backend not running (normal for Live Server) — humanize locally.
      console.warn('API unavailable, using local humanizer:', apiErr);
      await new Promise((resolve) => setTimeout(resolve, 300));
      humanized = humanizer.humanize(text, intensitySelect.value);
    }

    resultText.textContent = humanized;
    resultMeta.textContent = intensityText(intensitySelect.value) + ' intensity';
    originalWords.textContent = wordsLabel(countWords(text));
    humanizedWords.textContent = wordsLabel(countWords(humanized));
    resultSection.style.display = 'block';
    const outAnalysis = analyzeText(humanized);
    const delta =
      lastInputScore && lastInputScore.reliable && outAnalysis.reliable
        ? lastInputScore.score - outAnalysis.score
        : null;
    renderScore(outputScoreBox, 'Output AI likelihood', outAnalysis, delta);
  } catch (err) {
    showError('Failed to humanize text. Please try again.');
    console.error('Error:', err);
  } finally {
    humanizeBtn.disabled = false;
    humanizeBtn.removeAttribute('aria-busy');
    humanizeBtn.innerHTML = DEFAULT_BTN_HTML;
  }
}

function resetCopyButton() {
  clearTimeout(copyTimer);
  copyBtn.innerHTML = COPY_BTN_HTML;
}

function handleClear() {
  inputText.value = '';
  resultText.textContent = '';
  resultSection.style.display = 'none';
  originalWords.textContent = '0 words';
  humanizedWords.textContent = '0 words';
  wordCount.textContent = '0 words';
  lastInputScore = null;
  renderScore(inputScoreBox, '', null);
  renderScore(outputScoreBox, '', null);
  resetCopyButton();
  showError('');
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    copyBtn.innerHTML = COPIED_BTN_HTML;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(resetCopyButton, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
    showError('Could not copy automatically. Select the text and copy it manually.');
  }
}

humanizeBtn.addEventListener('click', handleHumanize);
clearBtn.addEventListener('click', handleClear);
copyBtn.addEventListener('click', handleCopy);

// Live word count + AI-likelihood meter on the input (debounced so typing stays smooth).
let scoreTimer = null;
inputText.addEventListener('input', () => {
  wordCount.textContent = wordsLabel(countWords(inputText.value));
  clearTimeout(scoreTimer);
  scoreTimer = setTimeout(() => {
    const text = inputText.value;
    lastInputScore = text.trim() ? analyzeText(text) : null;
    renderScore(inputScoreBox, 'Input AI likelihood', lastInputScore);
  }, 250);
});
