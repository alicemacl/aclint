/**
 * Semantic UI patterns — expectations beyond raw WCAG attributes.
 */

export type PatternSeverity = 'critical' | 'serious' | 'moderate';

export type PatternExpectation = {
  id: string;
  check: (element: HTMLElement) => boolean;
  message: string;
  suggestion: string;
  severity: PatternSeverity;
  learnMore: string;
};

export type ComponentPattern = {
  id: string;
  name: string;
  description: string;
  matches: (element: HTMLElement) => boolean;
  expectations: PatternExpectation[];
};
