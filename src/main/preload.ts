import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  onSwitchMode: (callback: (mode: string) => void) => {
    ipcRenderer.on('switch-mode', (_event, mode) => callback(mode));
  },
  onToggleTheme: (callback: () => void) => {
    ipcRenderer.on('toggle-theme', () => callback());
  },
});
