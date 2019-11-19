"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var path = require("path");
var url = require("url");
var electron = require("electron");
// import { log, transports } from 'electron-log'
var fixPath = require("fix-path");
fixPath();
// transports.file.findLogPath()
var dotenvPath;
if (process.env.ELECTRON_START_URL) {
    console.log('using development env vars');
    dotenvPath = path.join(electron.app.getAppPath(), '.env-dev');
}
else {
    console.log('using production env vars');
    dotenvPath = path.join(electron.app.getAppPath(), '.env-prod');
}
dotenv.config({ path: dotenvPath });
// handle ipc events
var event_listeners_1 = require("./event-listeners");
event_listeners_1["default"]();
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 900, webPreferences: { nodeIntegration: true } });
    // and load the index.html of the app.
    var startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=electron-starter.js.map