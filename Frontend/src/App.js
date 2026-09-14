import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
      const response = await axios.post('http://localhost:5000/api/humanize', {
        text: inputText,
        intensity: intensity
      });

      setOutputText(response.data.humanized);
      setStats({
        originalWords: inputText.split(/\s+/).filter(word => word.length > 0).length,
        humanizedWords: response.data.humanized.split(/\s+/).filter(word => word.length > 0).length
      });
    } catch (err) {
      setError('Failed to humanize text. Please make sure the backend server is running.');
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

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Humanize AI</h1>
          <p>Transform AI-generated text into natural, human-like writing</p>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;