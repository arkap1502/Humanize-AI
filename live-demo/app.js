// Static-demo wiring (mirrors Frontend/src/App.js).
// Tries the backend API first (if you ran `npm start` in Backend/),
// otherwise humanizes locally in the browser — same as the GitHub Pages build.
import { humanizer } from './humanizer.js';

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

const DEFAULT_BTN_HTML = 'Humanize Text';
const LOADING_BTN_HTML = '<span class="loading"><span class="spinner"></span>Processing...</span>';

function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = message ? 'block' : 'none';
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
