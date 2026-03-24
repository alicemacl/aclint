/**
 * Types for focus tracking (hook result + focused element snapshot).
 */

import type { AxeCheckResult } from '../a11y-axe-check';
import type { ParentContext, PositionInSet } from '../focus-types';
import type { MappedIssue } from '../map-violations';
import type { VOAnnouncement } from '../vo-engine';

export type { ParentContext, PositionInSet } from '../focus-types';

export type FocusedElementInfo = {
  element: HTMLElement;
  role: string;
  name: string;
  description: string | null;
  states: string[];
  announcement: string;
  voOutput: VOAnnouncement;
  selector: string;
  snippet: string;
  positionInSet: PositionInSet;
  parentContext: ParentContext;
  level: number | null;
  hasValidOwnership: boolean;
  ownershipIssue: string | null;
};

export type FocusTrackingResult = {
  current: FocusedElementInfo | null;
  prev: FocusedElementInfo | null;
  next: FocusedElementInfo | null;
  currentIndex: number;
  totalFocusable: number;
  issues: MappedIssue[];
  isChecking: boolean;
  axeResult: AxeCheckResult | null;
};
