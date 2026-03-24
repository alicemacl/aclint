/**
 * Hook to track focus changes and compute accessibility information.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { checkElementWithAccessLint } from '../a11y-accesslint-check';
import type { AxeCheckResult } from '../a11y-axe-check';
import { checkElement, getCachedResult, hasCachedResult } from '../a11y-axe-check';
import { checkHoverContrast } from '../hover-contrast';
import type { MappedIssue } from '../map-violations';
import { detectPatternIssues, patternViolationsToMappedIssues } from '../pattern-detector';
import {
  COMPOSITE_NAVIGATION_KEYS,
  getEffectiveFocusTarget,
  isInsideA11yPanel,
  isTextEntryElement,
} from './composite-focus';
import { getElementInfo } from './focused-element-info';
import { getFocusableElements } from './focusable-elements';
import { mergeIssues } from './merge-issues';
import type { FocusedElementInfo, FocusTrackingResult } from './types';

export type { FocusedElementInfo, FocusTrackingResult, ParentContext, PositionInSet } from './types';

export function useFocusTracking(isEnabled: boolean): FocusTrackingResult {
  const [current, setCurrent] = useState<FocusedElementInfo | null>(null);
  const [prev, setPrev] = useState<FocusedElementInfo | null>(null);
  const [next, setNext] = useState<FocusedElementInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalFocusable, setTotalFocusable] = useState(0);
  const [issues, setIssues] = useState<MappedIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [axeResult, setAxeResult] = useState<AxeCheckResult | null>(null);

  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compositeNavSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousContextContainerRef = useRef<HTMLElement | null>(null);

  const updateNavigation = useCallback((focusedElement: HTMLElement) => {
    const focusable = getFocusableElements();
    setTotalFocusable(focusable.length);

    const index = focusable.indexOf(focusedElement);
    if (index >= 0) {
      setCurrentIndex(index + 1);
      setPrev(index > 0 ? getElementInfo(focusable[index - 1]) : null);
      setNext(index < focusable.length - 1 ? getElementInfo(focusable[index + 1]) : null);
    }
  }, []);

  const runCheck = useCallback(async (element: HTMLElement) => {
    const patternMapped = patternViolationsToMappedIssues(detectPatternIssues(element));

    const hoverIssue = checkHoverContrast(element);
    const extra: MappedIssue[] = hoverIssue ? [hoverIssue] : [];

    if (hasCachedResult(element)) {
      const cached = getCachedResult(element)!;
      setAxeResult(cached);

      const alIssues = await checkElementWithAccessLint(element);
      setIssues([...mergeIssues(patternMapped, cached.issues, alIssues), ...extra]);
      return;
    }

    setIsChecking(true);

    try {
      const [axeResult, alIssues] = await Promise.all([
        checkElement(element),
        checkElementWithAccessLint(element),
      ]);

      setAxeResult(axeResult);
      setIssues([...mergeIssues(patternMapped, axeResult.issues, alIssues), ...extra]);
    } catch {
      setAxeResult(null);
      setIssues([...patternMapped, ...extra]);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const applyFocusSync = (domFocusElement: HTMLElement | null) => {
      if (!domFocusElement || domFocusElement === document.body) return;
      if (isInsideA11yPanel(domFocusElement)) return;

      const effective = getEffectiveFocusTarget(domFocusElement);
      const info = getElementInfo(effective, previousContextContainerRef.current);
      previousContextContainerRef.current = info.parentContext[0]?.containerElement ?? null;
      setCurrent(info);
      updateNavigation(domFocusElement);

      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }

      setAxeResult(null);
      setIssues([]);

      checkTimeoutRef.current = setTimeout(() => {
        runCheck(effective);
      }, 150);
    };

    const scheduleCompositeRefresh = () => {
      if (compositeNavSyncTimeoutRef.current != null) {
        clearTimeout(compositeNavSyncTimeoutRef.current);
      }
      compositeNavSyncTimeoutRef.current = setTimeout(() => {
        compositeNavSyncTimeoutRef.current = null;
        const ae = document.activeElement;
        if (ae instanceof HTMLElement) {
          applyFocusSync(ae);
        }
      }, 0);
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      applyFocusSync(target);
    };

    const handleKeyDownCapture = (event: KeyboardEvent) => {
      if (!COMPOSITE_NAVIGATION_KEYS.has(event.key)) return;
      const ae = document.activeElement;
      if (!(ae instanceof HTMLElement) || isInsideA11yPanel(ae)) return;
      if (isTextEntryElement(ae)) return;
      scheduleCompositeRefresh();
    };

    const handleChangeCapture = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || isInsideA11yPanel(target)) return;
      requestAnimationFrame(() => {
        const ae = document.activeElement;
        const domFocus =
          ae instanceof HTMLElement && !isInsideA11yPanel(ae) ? ae : target;
        applyFocusSync(domFocus);
      });
    };

    const handleClickCapture = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || isInsideA11yPanel(target)) return;
      const role = target.getAttribute('role');
      const isToggleControl =
        (target instanceof HTMLInputElement &&
          (target.type === 'checkbox' || target.type === 'radio')) ||
        role === 'checkbox' ||
        role === 'switch' ||
        role === 'menuitemcheckbox' ||
        role === 'menuitemradio';
      if (!isToggleControl) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const ae = document.activeElement;
          const domFocus =
            ae instanceof HTMLElement && !isInsideA11yPanel(ae) ? ae : target;
          applyFocusSync(domFocus);
        });
      });
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('keydown', handleKeyDownCapture, true);
    document.addEventListener('change', handleChangeCapture, true);
    document.addEventListener('click', handleClickCapture, true);

    if (document.activeElement && document.activeElement !== document.body) {
      applyFocusSync(document.activeElement as HTMLElement);
    }

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('keydown', handleKeyDownCapture, true);
      document.removeEventListener('change', handleChangeCapture, true);
      document.removeEventListener('click', handleClickCapture, true);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (compositeNavSyncTimeoutRef.current != null) {
        clearTimeout(compositeNavSyncTimeoutRef.current);
        compositeNavSyncTimeoutRef.current = null;
      }
    };
  }, [isEnabled, updateNavigation, runCheck]);

  return {
    current,
    prev,
    next,
    currentIndex,
    totalFocusable,
    issues,
    isChecking,
    axeResult,
  };
}
