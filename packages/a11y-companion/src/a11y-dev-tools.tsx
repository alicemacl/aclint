'use client';

/**
 * Development-only accessibility debugging tools.
 *
 * Press Ctrl+Shift+A (or Cmd+Shift+A on Mac) to toggle the accessibility
 * overlay panel.
 *
 * This component only renders in development mode.
 */

import { useEffect, useState } from 'react';

import { A11yOverlay } from './a11y-overlay';

export function A11yDevTools() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV !== 'development') return;

    setMounted(true);

    // Log instructions on mount
    // eslint-disable-next-line no-console
    console.log(
      '%c♿ A11y Dev Tools loaded - Press Ctrl+Shift+A (Cmd+Shift+A on Mac) to toggle panel',
      'color: #3b82f6; font-weight: bold;',
    );
  }, []);

  // Don't render on server or in production
  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <A11yOverlay />;
}
