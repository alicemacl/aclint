# ACLint — Chrome extension (third-party sites)

Loads the same **accessibility overlay** (`A11yOverlay` from `@aclint/lens`) into any HTTP(S) page via a content script. Styles are scoped in a **Shadow DOM**; Ark UI portals target that shadow root so Panda CSS applies correctly.

## Build (local)

From the repo root:

```bash
pnpm --filter aclint-extension build
```

Or from this directory:

```bash
pnpm install
pnpm run build
```

Output: `apps/extension/dist/` (`content.js`, `background.js`, `manifest.json`).

`prepare` runs Panda codegen into `styled-system/` (gitignored); Vite bundles the content script as a single IIFE (~1.7 MB including React, Ark, axe, etc.).

## Load unpacked in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the **`dist`** folder:  
   `aclint/apps/extension/dist`  
   (the folder that contains `manifest.json`, not the repo root).

## Use

- **Keyboard:** **Ctrl+Shift+A** (Windows/Linux) or **⌘⇧A** (macOS) — same shortcut as in-app dev tools.  
  If it clashes with another extension or Chrome, go to `chrome://extensions/shortcuts` and assign **"Toggle ACLint panel"** to a different key.
- **Toolbar:** Click the extension action icon to toggle the panel.

After installing or rebuilding, **reload normal web tabs** (or use the icon again — the background script will try to inject `content.js` if messaging failed). **Restricted pages** (`chrome://`, Chrome Web Store, `edge://`, PDF viewer, etc.) cannot run content scripts — open a regular `http(s)` page.

The service worker sends `toggle-panel` to the tab; the content script toggles the overlay via a ref (no race with `window` events).

## Permissions

- **`tabs`** — resolve the active tab and send messages to it.
- **`scripting`** — programmatically inject `content.js` when the tab never got the content script (e.g. opened before the extension loaded).
- **`host_permissions`: `<all_urls>`** — content script injection on http(s) pages.

Narrow `matches` / `host_permissions` in `manifest.json` before publishing to the Chrome Web Store if you don't need every origin.

## Development notes

- Rebuild after changing lens or extension source (`pnpm run build` in this app).
- **CSP:** Extension content scripts are not subject to the page's CSP the same way inline page scripts are; the bundle runs in an isolated world with access to the page DOM.
- **Iframes:** Content script runs in the main frame only (`all_frames` is not enabled). Focus inside nested frames may not be tracked until you extend the manifest.
