'use client';

/**
 * Main A11y Overlay component.
 * Orchestrates the panel and highlight.
 */

import type { MutableRefObject, RefObject } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { A11yHighlight } from './a11y-highlight';
import { A11yPanel } from './a11y-panel';
import { useActivationMonitor } from './interaction-monitor';
import type { MappedIssue } from './map-violations';
import { useFocusTracking } from './use-focus-tracking';
import { VoPlatformProvider } from './vo-platform';

export type A11yOverlayProps = {
  /**
   * When set (e.g. Shadow DOM mount in the browser extension), Ark `Portal`s render
   * into this node so the panel stays under the same subtree as Panda styles.
   */
  portalContainerRef?: RefObject<HTMLElement | null>;
  /**
   * Dispatched on `window` to toggle the panel (e.g. Chrome extension toolbar / command).
   */
  externalToggleEventName?: string;
  /**
   * When set (e.g. browser extension), the ref receives `() => void` after mount so
   * `chrome.runtime.onMessage` can toggle without relying on window events (avoids races).
   */
  extensionToggleRef?: MutableRefObject<(() => void) | null>;
};

export function A11yOverlay({
  portalContainerRef,
  externalToggleEventName,
  extensionToggleRef,
}: A11yOverlayProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHighlight, setShowHighlight] = useState(true);

  // Focus tracking is only active when panel is open
  const focusInfo = useFocusTracking(isOpen);

  const [interactionIssues, setInteractionIssues] = useState<MappedIssue[]>([]);

  const addInteractionIssue = useCallback((issue: MappedIssue) => {
    setInteractionIssues((prev) => {
      if (prev.some((i) => i.id === issue.id)) return prev;
      return [...prev, issue];
    });
  }, []);

  useActivationMonitor(isOpen, addInteractionIssue);

  // Clear interaction issues when focus changes
  const currentElement = focusInfo.current?.element ?? null;
  useEffect(() => {
    setInteractionIssues([]);
  }, [currentElement]);

  const enrichedFocusInfo = useMemo(
    () => ({
      ...focusInfo,
      issues: [...focusInfo.issues, ...interactionIssues],
    }),
    [focusInfo, interactionIssues],
  );

  // Toggle panel with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
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

  useEffect(() => {
    if (!externalToggleEventName) return;
    const onToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener(externalToggleEventName, onToggle);
    return () => window.removeEventListener(externalToggleEventName, onToggle);
  }, [externalToggleEventName]);

  useEffect(() => {
    if (!extensionToggleRef) return;
    const toggle = () => setIsOpen((prev) => !prev);
    extensionToggleRef.current = toggle;
    return () => {
      extensionToggleRef.current = null;
    };
  }, [extensionToggleRef]);

  const handleToggleHighlight = useCallback(() => {
    setShowHighlight((prev) => !prev);
  }, []);

  return (
    <VoPlatformProvider>
      <A11yHighlight
        element={focusInfo.current?.element ?? null}
        isVisible={isOpen && showHighlight}
        portalContainerRef={portalContainerRef}
      />
      <A11yPanel
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        focusInfo={enrichedFocusInfo}
        showHighlight={showHighlight}
        onToggleHighlight={handleToggleHighlight}
        portalContainerRef={portalContainerRef}
      />
    </VoPlatformProvider>
  );
}
