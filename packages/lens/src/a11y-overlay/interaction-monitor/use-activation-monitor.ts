/**
 * Monitor Space/Enter on interactive elements.
 * If nothing observable happens within a short window, report it as an issue.
 *
 * Observation is scoped to the element itself and its likely activation targets
 * (aria-controls, parent container) so that unrelated mutations — e.g. from
 * page scroll triggering lazy-load — don't mask the detection.
 */

import { useCallback, useEffect, useRef } from 'react';

import type { MappedIssue } from '../map-violations';
import { isActivatable } from './is-activatable';

const OBSERVATION_WINDOW_MS = 400;
const ACTIVATION_KEYS = new Set([' ', 'Enter']);

const ACTIVATION_ATTRS = [
  'aria-expanded',
  'aria-pressed',
  'aria-checked',
  'aria-selected',
  'aria-hidden',
  'hidden',
  'open',
  'class',
];

function isInsidePanel(el: HTMLElement): boolean {
  return !!el.closest('[data-a11y-panel]');
}

/**
 * Collect the DOM nodes we should watch for activation side-effects:
 *  1. The element itself (attribute changes like aria-expanded)
 *  2. The aria-controls / aria-owns target (dropdown appearing)
 *  3. The element's parent (sibling dropdown being inserted)
 */
function getObservationTargets(el: HTMLElement): HTMLElement[] {
  const targets: HTMLElement[] = [el];

  const controlsId = el.getAttribute('aria-controls') ?? el.getAttribute('aria-owns');
  if (controlsId) {
    const controlled = document.getElementById(controlsId);
    if (controlled instanceof HTMLElement) {
      targets.push(controlled);
    }
  }

  if (el.parentElement) {
    targets.push(el.parentElement);
  }

  return targets;
}

export function useActivationMonitor(
  isEnabled: boolean,
  onIssue: (issue: MappedIssue) => void,
) {
  const pendingRef = useRef(false);
  const onIssueRef = useRef(onIssue);
  onIssueRef.current = onIssue;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!ACTIVATION_KEYS.has(event.key)) return;
    if (pendingRef.current) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (isInsidePanel(target)) return;
    if (!isActivatable(target)) return;

    pendingRef.current = true;

    const snapshotFocus = document.activeElement;
    const snapshotUrl = location.href;
    let activationSeen = false;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
          activationSeen = true;
          return;
        }
        if (m.type === 'attributes' && ACTIVATION_ATTRS.includes(m.attributeName ?? '')) {
          activationSeen = true;
          return;
        }
      }
    });

    const observationTargets = getObservationTargets(target);
    for (const t of observationTargets) {
      observer.observe(t, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ACTIVATION_ATTRS,
      });
    }

    const onFocusChange = (e: FocusEvent) => {
      if (e.target !== target) {
        activationSeen = true;
      }
    };
    document.addEventListener('focusin', onFocusChange);

    setTimeout(() => {
      observer.disconnect();
      document.removeEventListener('focusin', onFocusChange);
      pendingRef.current = false;

      const focusChanged = document.activeElement !== snapshotFocus;
      const urlChanged = location.href !== snapshotUrl;

      if (activationSeen || focusChanged || urlChanged) return;

      const role = target.getAttribute('role') ?? target.tagName.toLowerCase();
      const keyLabel = event.key === ' ' ? 'Space' : 'Enter';

      onIssueRef.current({
        id: 'no-activation-response',
        title: `Pressing ${keyLabel} on this ${role} had no effect`,
        severity: 'serious',
        guidance: {
          why:
            'Interactive elements should respond to keyboard activation (Space or Enter). ' +
            'When nothing happens, keyboard-only users and screen-reader users cannot use this control.',
          fix:
            keyLabel === 'Space' && target.tagName === 'A'
              ? 'This is an <a> link — links only activate on Enter, not Space. If this element is meant to toggle a dropdown or perform an action, use a <button> instead.'
              : 'Ensure the element has a working click handler (or native behavior for <button>/<a>). ' +
                'If this element is decorative or non-interactive, remove its interactive role and tabindex.',
        },
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        axeHelp: `Pressing ${keyLabel} on ${role} had no visible effect`,
        axeDescription: 'Interactive elements must respond to keyboard activation.',
        source: 'interaction',
      });
    }, OBSERVATION_WINDOW_MS);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isEnabled, handleKeyDown]);
}
