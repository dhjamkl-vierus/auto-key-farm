/**
 * Preload script. Bridges the renderer (React) to the main process via IPC.
 * Exposes `window.autokey` with a small, locked-down API surface.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("autokey", {
  isAvailable: () => ipcRenderer.invoke("autokey:available"),
  pressKey: (key) => ipcRenderer.invoke("autokey:pressKey", key),
  click: () => ipcRenderer.invoke("autokey:click"),
  clickAt: (x, y) => ipcRenderer.invoke("autokey:clickAt", x, y),
  screenSize: () => ipcRenderer.invoke("autokey:screenSize"),
  // Marker so the renderer can do `if (window.autokey?.isElectron)`.
  isElectron: true,
});
