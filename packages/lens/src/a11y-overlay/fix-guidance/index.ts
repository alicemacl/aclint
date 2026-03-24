/**
 * Plain-language fix guidance for common accessibility issues.
 */

import { ariaKeyboardDocumentEntries } from './entries/aria-keyboard-document';
import { buttonsLinksEntries } from './entries/buttons-links';
import { headingsLandmarksEntries } from './entries/headings-landmarks';
import { imagesFormsEntries } from './entries/images-forms';
import { tablesEntries } from './entries/tables';
import type { FixGuidance } from './types';

export type { FixGuidance, VoiceOverGuide } from './types';

export const FIX_GUIDANCE: Record<string, FixGuidance> = {
  ...buttonsLinksEntries,
  ...imagesFormsEntries,
  ...headingsLandmarksEntries,
  ...ariaKeyboardDocumentEntries,
  ...tablesEntries,
};

export function getFixGuidance(ruleId: string): FixGuidance | undefined {
  return FIX_GUIDANCE[ruleId];
}

export function hasFixGuidance(ruleId: string): boolean {
  return ruleId in FIX_GUIDANCE;
}
