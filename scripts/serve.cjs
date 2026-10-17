const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../src');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const file = path.resolve(root, '.' + (new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { if (err) res.writeHead(404).end('Not found'); else { res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); } });
}).on('error', error => {
  console.error(`Could not start the preview server: ${error.message}`);
  console.error('You can also run npm run preview to open the offline preview directly.');
  process.exitCode = 1;
}).listen(5173, '127.0.0.1', () => console.log('Richang preview: http://127.0.0.1:5173'));
