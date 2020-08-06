const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const url = require('url');

log.transports.file.file = require('os').homedir() + '/Intended-Launcher-log.txt';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, minWidth: 1024, height: 600, minHeight: 600, show: false, autoHideMenuBar: true, frame: false, webPreferences:{nodeIntegration:true, webviewTag:true}});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  if (require('electron-is-dev')) mainWindow.webContents.openDevTools();
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.once('closed', () => mainWindow = null);
  autoUpdater.checkForUpdatesAndNotify();
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.on('open-directory-dialog', function (event, response) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files) event.sender.send(response, files[0])
  });
});

/*ipcMain.on('open-profcalc', function() {
  window = new BrowserWindow({width: 1296, height: 839, autoHideMenuBar: true});
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'profcalc', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  //if (require('electron-is-dev')) window.webContents.openDevTools();
});

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();  
});

autoUpdater.on('download-progress', (progress) => {
  mainWindow.webContents.send('download-progress', progress);
})

autoUpdater.on('update-available', info => {
  mainWindow.webContents.send('downloading-update', 'Downloading version ' + info.version);
})

app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});*/

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
/*
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});*/