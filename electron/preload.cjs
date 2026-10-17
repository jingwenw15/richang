const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  isMac: process.platform === 'darwin',
  speechAvailable: () => ipcRenderer.invoke('speech:available'),
  speak: (text, slow) => ipcRenderer.invoke('speech:speak', { text, slow }),
  stopSpeech: () => ipcRenderer.invoke('speech:stop'),
  ai: {
    status: () => ipcRenderer.invoke('ai:status'),
    configure: settings => ipcRenderer.invoke('ai:configure', settings),
    check: () => ipcRenderer.invoke('ai:check'),
    prepare: goal => ipcRenderer.invoke('ai:prepare', goal),
    reply: (session, answer) => ipcRenderer.invoke('ai:reply', { session, answer }),
    transcribe: (bytes, mime) => ipcRenderer.invoke('ai:transcribe', { bytes, mime })
  }
});
