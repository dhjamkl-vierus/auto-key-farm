const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 500,

    frame: false, // ❗ bỏ thanh window (giống cheat UI)
    transparent: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/index.html");
}

app.whenReady().then(createWindow);