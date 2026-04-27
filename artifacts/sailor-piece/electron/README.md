# AutoKey-Farm — Electron build

Wraps the React UI in a real desktop window and uses
[`@nut-tree-fork/nut-js`](https://www.npmjs.com/package/@nut-tree-fork/nut-js)
to inject real keystrokes + mouse clicks into the focused application
(e.g. Roblox).

## Layout

| File | Role |
| --- | --- |
| `electron/main.cjs` | Electron main process — owns the BrowserWindow + IPC handlers |
| `electron/preload.cjs` | Bridges renderer ↔ main, exposes `window.autokey` |
| `electron/injector.cjs` | Wraps `@nut-tree-fork/nut-js` for OS-wide key / mouse injection |
| `electron-builder.yml` | Build config (Windows NSIS by default) |

The renderer (React) talks to the bridge through `src/lib/desktop.ts`. When
running in a normal browser, every desktop call is a silent no-op so the app
still works for preview / debug.

## Run in dev (with Electron window)

In two shells from the repo root:

```bash
# 1) Vite dev server (already wired into the workspace)
pnpm --filter @workspace/sailor-piece run dev

# 2) Electron, pointing at the dev server
ELECTRON_RENDERER_URL=http://localhost:5173 pnpm --filter @workspace/sailor-piece run electron
```

## Build a Windows installer (`.exe`)

> Cross-compiling from Linux/macOS to Windows requires Wine and isn't
> reliable on the Replit container. Build the `.exe` on a Windows machine.

On Windows:

```bash
git clone <this repo>
pnpm install
pnpm --filter @workspace/sailor-piece run electron:dist
```

The installer (`AutoKey-Farm-Setup-<version>.exe`) lands in
`artifacts/sailor-piece/release/`.
