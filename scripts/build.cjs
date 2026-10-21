const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../src');
const bundled = ['more-lessons.js', 'content.js', 'rehearsal.js', 'model.js', 'app.js'].map(file => fs.readFileSync(path.join(root, file), 'utf8').replace(/^import .*;\n/gm, '').replace(/^export /gm, '')).join('\n');
fs.writeFileSync(path.join(root, 'app.bundle.js'), `'use strict';\n(() => {\n${bundled}\n})();\n`);
console.log('Built the offline app renderer.');
