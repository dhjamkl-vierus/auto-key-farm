/**
 * Electron main process for AutoKey-Farm.
 * - Loads the Vite dev server in development, or the built dist/ in production.
 * - Exposes IPC handlers that drive @nut-tree-fork/nut-js so the renderer can
 *   inject real keystrokes / mouse clicks into other applications (Roblox).
 */
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");
const injector = require("./injector.cjs");

const isDev = !app.isPackaged;
const DEV_URL = process.env.ELECTRON_RENDERER_URL || "http://localhost:5173";

let win = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#0b0612",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    await win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    await win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  win.on("closed", () => { win = null; });
}

app.whenReady().then(async () => {
  await injector.init();
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ---------- IPC bridge ----------

ipcMain.handle("autokey:available", () => injector.isReady());

ipcMain.handle("autokey:pressKey", async (_e, key) => {
  try { await injector.pressKey(String(key)); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err && err.message || err) }; }
});

ipcMain.handle("autokey:click", async () => {
  try { await injector.click(); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err && err.message || err) }; }
});

ipcMain.handle("autokey:clickAt", async (_e, x, y) => {
  try { await injector.clickAt(Number(x), Number(y)); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err && err.message || err) }; }
});

ipcMain.handle("autokey:screenSize", () => {
  const d = screen.getPrimaryDisplay();
  return { width: d.size.width, height: d.size.height };
});
