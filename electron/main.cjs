const { app, BrowserWindow, ipcMain, Menu, session, protocol, net, safeStorage } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFile, spawn } = require('node:child_process');
const { createAiService } = require('./ai.cjs');

protocol.registerSchemesAsPrivileged([{ scheme: 'richang', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
let speaker;
let chineseVoice;
const origin = 'richang://app';
const trusted = sender => sender.getURL().startsWith(`${origin}/`);
app.setName('Richang');

function makeWindow() {
  const win = new BrowserWindow({
    width: 1320, height: 900, minWidth: 900, minHeight: 680,
    title: '日常 · Richang', titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 22, y: 23 }, backgroundColor: '#f8f9f5',
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => { if (!url.startsWith(`${origin}/`)) event.preventDefault(); });
  win.loadURL(`${origin}/index.html`);
}

app.whenReady().then(async () => {
  const ai = await createAiService({ directory: app.getPath('userData'), safeStorage });
  const aiHandlers = {
    status: () => ai.status(), configure: payload => ai.configure(payload), check: () => ai.check(),
    prepare: payload => ai.prepare(payload), reply: payload => ai.reply(payload?.session, payload?.answer), transcribe: payload => ai.transcribe(payload)
  };
  for (const [action, handler] of Object.entries(aiHandlers)) ipcMain.handle(`ai:${action}`, async (event, payload) => {
    if (!trusted(event.sender)) return { ok: false, error: 'This action is only available inside Richang.' };
    try { return { ok: true, data: await handler(payload) }; } catch (error) { return { ok: false, error: error.message || 'The AI request failed. Please try again.' }; }
  });
  const root = path.resolve(__dirname, '..', 'src');
  protocol.handle('richang', request => {
    const url = new URL(request.url);
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (url.hostname !== 'app' || !file.startsWith(root + path.sep)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  session.defaultSession.setPermissionRequestHandler((contents, permission, callback, details) => {
    callback(trusted(contents) && permission === 'media' && details.mediaTypes?.every(type => type === 'audio'));
  });
  session.defaultSession.setPermissionCheckHandler((contents, permission) => Boolean(contents && trusted(contents) && permission === 'media'));
  if (process.platform === 'darwin') {
    chineseVoice = await new Promise(resolve => execFile('/usr/bin/say', ['-v', '?'], (error, stdout) => {
      const lines = error ? [] : stdout.split('\n');
      const line = lines.find(line => /^Tingting\s+zh_CN\b/.test(line)) || lines.find(line => /\bzh_CN\b/.test(line));
      resolve(line ? line.split(/\s+zh_CN/)[0].trim() : null);
    }));
  }
  ipcMain.handle('speech:available', event => trusted(event.sender) && Boolean(chineseVoice));
  ipcMain.handle('speech:stop', event => { if (trusted(event.sender)) speaker?.kill(); });
  ipcMain.handle('speech:speak', (event, payload) => {
    if (!trusted(event.sender) || !chineseVoice || typeof payload?.text !== 'string' || payload.text.length > 600) return false;
    speaker?.kill();
    speaker = spawn('/usr/bin/say', ['-v', chineseVoice, '-r', payload.slow ? '125' : '175', '--', payload.text], { stdio: 'ignore' });
    speaker.on('error', () => {});
    return true;
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: app.name, submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }] },
    { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'togglefullscreen' }] },
    { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'zoom' }, { role: 'front' }] }
  ]));
  makeWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) makeWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', () => speaker?.kill());
