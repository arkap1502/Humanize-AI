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

## Setup Instructions

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

The application uses sophisticated pattern recognition to identify common AI-generated phrasing patterns and replaces them with more natural alternatives:

- **Formal to Casual**: Converts formal academic language to conversational tone
- **Complex to Simple**: Simplifies unnecessarily complex sentence structures
- **AI Markers**: Removes common AI-generated phrases and markers
- **Natural Flow**: Improves text flow and readability
- **Contractions**: Adds natural contractions that AI often avoids

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