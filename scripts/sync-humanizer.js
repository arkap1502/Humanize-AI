// Generates every platform copy of the humanizer from shared/humanizer.js.
// Run after editing shared/humanizer.js:
//   node scripts/sync-humanizer.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'shared', 'humanizer.js'), 'utf8');

const esmHeader = `// GENERATED — do not edit by hand. Edit shared/humanizer.js, then run:
//   node scripts/sync-humanizer.js

`;

// ES module copies (React + plain browser): identical logic.
fs.writeFileSync(path.join(root, 'Frontend', 'src', 'humanizer.js'), esmHeader + src);
fs.writeFileSync(path.join(root, 'live-demo', 'humanizer.js'), esmHeader + src);

// CommonJS copy (Express backend): convert the three export statements.
let cjs = src
  .replace('export class TextHumanizer {', 'class TextHumanizer {')
  .replace('export const humanizer = new TextHumanizer();', 'const humanizer = new TextHumanizer();')
  .replace('export default humanizer;', 'module.exports = { TextHumanizer, humanizer };');
cjs = `// GENERATED — do not edit by hand. Edit shared/humanizer.js, then run:
//   node scripts/sync-humanizer.js

` + cjs;
fs.writeFileSync(path.join(root, 'Backend', 'humanizer.js'), cjs);

console.log('Synced: Frontend/src/humanizer.js, live-demo/humanizer.js, Backend/humanizer.js');
