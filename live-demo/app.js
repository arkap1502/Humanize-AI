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
const errorBox = document.getElementById('error');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const originalWords = document.getElementById('original-words');
const humanizedWords = document.getElementById('humanized-words');
const inputScoreBox = document.getElementById('input-score');
const outputScoreBox = document.getElementById('output-score');
let lastInputScore = null;

const DEFAULT_BTN_HTML = 'Humanize Text';
const LOADING_BTN_HTML = '<span class="loading"><span class="spinner"></span>Processing...</span>';

function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = message ? 'block' : 'none';
}

function levelOf(score) {
  return score >= 60 ? 'high' : score >= 35 ? 'mid' : 'low';
}

function renderScore(box, title, analysis, delta) {
  if (!analysis) {
    box.innerHTML = '';
    return;
  }
  if (!analysis.reliable) {
    box.innerHTML =
      '<div class="score-card"><div class="score-top">' +
      '<span class="score-title"></span>' +
      '<span class="score-note">Too short to score — paste 15+ words</span>' +
      '</div></div>';
    box.querySelector('.score-title').textContent = title;
    return;
  }
  const level = levelOf(analysis.score);
  let signalsHtml = '';
  if (analysis.signals.length > 0) {
    const items = analysis.signals.map((s) => {
      const cls = s.points > 0 ? 'pos' : 'neg';
      const pts = s.points > 0 ? '+' + s.points : '' + s.points;
      const li = document.createElement('li');
      li.innerHTML = '';
      const ptsEl = document.createElement('span');
      ptsEl.className = 'sig-pts ' + cls;
      ptsEl.textContent = pts;
      li.appendChild(ptsEl);
      li.appendChild(document.createTextNode(' ' + s.label + ' '));
      const note = document.createElement('span');
      note.className = 'score-note';
      note.textContent = '(' + s.detail + ')';
      li.appendChild(note);
      return li.outerHTML;
    }).join('');
    signalsHtml =
      '<button type="button" class="score-toggle">Why this score? ▼</button>' +
      '<ul class="signals-list" style="display:none;">' + items + '</ul>';
  }
  let deltaHtml = '';
  if (typeof delta === 'number' && delta !== 0) {
    const cls = delta > 0 ? 'good' : 'bad';
    deltaHtml = ' <span class="score-delta ' + cls + '"></span>';
  }
  box.innerHTML =
    '<div class="score-card"><div class="score-top">' +
    '<span class="score-title"></span> ' +
    '<span class="score-num ' + level + '"></span> ' +
    '<span class="score-label"></span>' + deltaHtml +
    '</div><div class="score-bar"><div class="score-fill ' + level + '"></div></div>' +
    signalsHtml +
    '<div class="score-foot">Heuristic estimate from writing signals — external AI detectors may score differently.</div></div>';
  box.querySelector('.score-title').textContent = title;
  box.querySelector('.score-num').textContent = analysis.score + '%';
  box.querySelector('.score-label').textContent = analysis.label;
  box.querySelector('.score-fill').style.width = analysis.score + '%';
  if (deltaHtml) {
    const d = box.querySelector('.score-delta');
    d.textContent = (delta > 0 ? '−' + delta : '+' + (-delta)) + ' pts vs input';
  }
  const toggle = box.querySelector('.score-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const list = box.querySelector('.signals-list');
      const open = list.style.display !== 'none';
      list.style.display = open ? 'none' : 'block';
      toggle.textContent = open ? 'Why this score? ▼' : 'Hide details ▲';
    });
  }
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

async function handleHumanize() {
  const text = inputText.value;
  if (!text.trim()) {
    showError('Please enter some text to humanize');
    return;
  }

  humanizeBtn.disabled = true;
  humanizeBtn.innerHTML = LOADING_BTN_HTML;
  showError('');
  resultContainer.style.display = 'none';
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
    originalWords.textContent = countWords(text);
    humanizedWords.textContent = countWords(humanized);
    resultContainer.style.display = 'block';
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
    humanizeBtn.innerHTML = DEFAULT_BTN_HTML;
  }
}

function handleClear() {
  inputText.value = '';
  resultText.textContent = '';
  resultContainer.style.display = 'none';
  originalWords.textContent = '0';
  humanizedWords.textContent = '0';
  lastInputScore = null;
  renderScore(inputScoreBox, '', null);
  renderScore(outputScoreBox, '', null);
  showError('');
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    alert('Text copied to clipboard!');
  } catch (err) {
    console.error('Copy failed:', err);
    alert('Copy failed — please select the text manually.');
  }
}

humanizeBtn.addEventListener('click', handleHumanize);
clearBtn.addEventListener('click', handleClear);
copyBtn.addEventListener('click', handleCopy);

// Live AI-likelihood meter on the input (debounced so typing stays smooth).
let scoreTimer = null;
inputText.addEventListener('input', () => {
  clearTimeout(scoreTimer);
  scoreTimer = setTimeout(() => {
    const text = inputText.value;
    lastInputScore = text.trim() ? analyzeText(text) : null;
    renderScore(inputScoreBox, 'Input AI likelihood', lastInputScore);
  }, 250);
});
