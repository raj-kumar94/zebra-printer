const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// require('./app');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

console.log(path.join(app.getAppPath(), 'src', 'preload.js'));
app.allowRendererProcessReuse = false; // Added

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true
      preload: path.join(app.getAppPath(), 'src', 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // mainWindow.webContents.on('dom-ready', () => {
  //   const appVersion = "222222";
  //   console.log(`Trying to send app version to renderer: ${appVersion}`)
  //   mainWindow.webContents.send('toMain', appVersion)
  // })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on("toMain", (event, args) => {
  console.log("data received....", args)
  mainWindow.webContents.send("fromMain", args);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
