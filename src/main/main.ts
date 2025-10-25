import { app, BrowserWindow, Menu, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#1e1e1e',
    title: 'Multi-Calculator',
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Calculator',
      submenu: [
        {
          label: 'Basic Mode',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow?.webContents.send('switch-mode', 'basic');
          },
        },
        {
          label: 'Scientific Mode',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            mainWindow?.webContents.send('switch-mode', 'scientific');
          },
        },
        {
          label: 'Programmer Mode',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            mainWindow?.webContents.send('switch-mode', 'programmer');
          },
        },
        {
          label: 'Graphing Mode',
          accelerator: 'CmdOrCtrl+4',
          click: () => {
            mainWindow?.webContents.send('switch-mode', 'graphing');
          },
        },
        {
          label: 'Financial Mode',
          accelerator: 'CmdOrCtrl+5',
          click: () => {
            mainWindow?.webContents.send('switch-mode', 'financial');
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle Theme',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            mainWindow?.webContents.send('toggle-theme');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // Show about dialog
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
