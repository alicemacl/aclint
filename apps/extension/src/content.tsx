import { A11yOverlay } from '@a11y-lens/a11y-companion';
import type { RefObject } from 'react';
import { createRoot } from 'react-dom/client';

import globalsCss from '../globals.css?inline';

const EXT_HOST_ID = 'a11y-lens-companion-host';

/** Shared with a second execution if the background script programmatically injects `content.js`. */
const extensionToggleRef: { current: (() => void) | null } = { current: null };

const g = globalThis as typeof globalThis & { __a11yLensMessageListener?: boolean };

function setupMessageListenerOnce() {
  if (g.__a11yLensMessageListener) return;
  g.__a11yLensMessageListener = true;

  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && (msg as { type?: string }).type === 'toggle-panel') {
      extensionToggleRef.current?.();
    }
  });
}

function inject() {
  setupMessageListenerOnce();

  if (document.getElementById(EXT_HOST_ID)) {
    return;
  }

  const host = document.createElement('div');
  host.id = EXT_HOST_ID;
  host.setAttribute('data-a11y-lens-extension-host', '');
  Object.assign(host.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483646',
    pointerEvents: 'none',
  });

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = globalsCss;
  shadow.appendChild(style);

  const portalRoot = document.createElement('div');
  portalRoot.style.pointerEvents = 'auto';
  shadow.appendChild(portalRoot);

  const portalContainerRef: RefObject<HTMLElement> = { current: portalRoot };

  document.documentElement.appendChild(host);

  const root = createRoot(portalRoot);
  root.render(
    <A11yOverlay portalContainerRef={portalContainerRef} extensionToggleRef={extensionToggleRef} />,
  );
}

inject();
