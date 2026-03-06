'use client';

/**
 * Main A11y Overlay component.
 * Orchestrates the panel and highlight.
 */

import { useCallback, useEffect, useState } from 'react';

import { A11yHighlight } from './a11y-highlight';
import { A11yPanel } from './a11y-panel';
import { useFocusTracking } from './use-focus-tracking';

export function A11yOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHighlight, setShowHighlight] = useState(true);

  // Focus tracking is only active when panel is open
  const focusInfo = useFocusTracking(isOpen);

  // Toggle panel with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
            // eslint-disable-next-line no-console
            console.log(
              '%c[A11y Panel] Opened - Press Tab to navigate',
              'color: #3b82f6; font-weight: bold;'
            );
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleHighlight = useCallback(() => {
    setShowHighlight((prev) => !prev);
  }, []);

  return (
    <>
      <A11yHighlight
        element={focusInfo.current?.element ?? null}
        isVisible={isOpen && showHighlight}
      />
      <A11yPanel
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        focusInfo={focusInfo}
        showHighlight={showHighlight}
        onToggleHighlight={handleToggleHighlight}
      />
    </>
  );
}
