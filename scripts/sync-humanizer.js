// Generates every platform copy of the shared modules.
// Run after editing anything in shared/:
//   node scripts/sync-humanizer.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const esmHeader = `// GENERATED — do not edit by hand. Edit shared/, then run:
//   node scripts/sync-humanizer.js

`;

function syncFile(name, toCjs) {
  const src = fs.readFileSync(path.join(root, 'shared', name), 'utf8');
  const targets = name === 'humanizer.js'
    ? ['Frontend/src/humanizer.js', 'live-demo/humanizer.js', 'Backend/humanizer.js']
    : ['Frontend/src/detector.js', 'live-demo/detector.js', 'Backend/detector.js'];
  for (const t of targets) {
    let out = src;
    if (t.startsWith('Backend/')) out = toCjs(out);
    fs.writeFileSync(path.join(root, t), esmHeader + out);
  }
}

// Humanizer copies.
syncFile('humanizer.js', (src) => src
  .replace('export class TextHumanizer {', 'class TextHumanizer {')
  .replace('export const humanizer = new TextHumanizer();', 'const humanizer = new TextHumanizer();')
  .replace('export default humanizer;', 'module.exports = { TextHumanizer, humanizer };'));

// Detector copies.
syncFile('detector.js', (src) => src
  .replace('export function analyzeText', 'function analyzeText')
  .replace('export default analyzeText;', 'module.exports = { analyzeText };'));

console.log('Synced: humanizer.js + detector.js -> Frontend/src, live-demo, Backend');
