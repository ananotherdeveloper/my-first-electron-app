const { app, BrowserWindow } = require('electron');
const path = require('path');
const { promisify } = require('util');
const { Tokenizer } = require("tokenizers");
const fs = require('fs');

const tokenizerFilePath = process.argv[2];

/////// TOKENIZER ////////
function tokenizer(path) {
  let tok = Tokenizer.fromFile(path);
  return promisify(tok.encode.bind(tok));
}

function decodeTokenizer(path) {
  let tok = Tokenizer.fromFile(path);
  return promisify(tok.decode.bind(tok));
}
//////

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  loadMLStuff();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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


/// SAMPLE FLOW /////

async function loadMLStuff() {
  const text = "Hey Sunil! Do some magic!";

  console.log("FilePath: " + tokenizerFilePath);

  let encode = tokenizer(tokenizerFilePath);
  let output = await encode(text);
  console.log(output);
}