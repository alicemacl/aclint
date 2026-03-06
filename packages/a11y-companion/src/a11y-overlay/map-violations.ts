/**
 * Transform axe-core violations to mapped issues with plain-language guidance.
 */

import type { AssistantRule, VoiceOverTest } from './assistant-rules';
import { getAssistantRule } from './assistant-rules';
import type { VoiceOverGuide } from './fix-guidance';
import { getFixGuidance } from './fix-guidance';

export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

// Combined guidance type that supports both legacy and new formats
export type CombinedGuidance = {
  // Plain "why this matters" explanation
  why: string;
  // How to fix (from whatToDo or legacy fix)
  fix: string;
  // Optional code example
  codeExample?: string;
  // Common mistakes to avoid
  commonMistakes?: string[];
  // VoiceOver testing steps
  voiceOverTest?: VoiceOverTest;
  // Legacy VoiceOver guide (for backwards compatibility)
  voiceOver?: VoiceOverGuide;
};

export type MappedIssue = {
  id: string;
  title: string;
  severity: Severity | null;
  guidance: CombinedGuidance | null;
  learnMoreUrl: string;
  // Original axe data for fallback display
  axeHelp: string;
  axeDescription: string;
  // Reference to full assistant rule if available
  assistantRule?: AssistantRule;
};

export type AxeViolation = {
  id: string;
  impact: Severity | null;
  description: string;
  help: string;
  helpUrl: string;
  nodes: {
    html: string;
    failureSummary?: string;
  }[];
};

/**
 * Transform axe violations to issues with plain-language guidance.
 * Uses assistant rules first, falls back to legacy fix-guidance, then axe help.
 */
export function mapViolationsToIssues(violations: AxeViolation[]): MappedIssue[] {
  return violations.map((violation) => {
    // Try assistant rules first (from MVP)
    const assistantRule = getAssistantRule(violation.id);

    if (assistantRule) {
      return {
        id: violation.id,
        title: assistantRule.summary,
        severity: violation.impact,
        guidance: {
          why: assistantRule.explanation,
          fix: assistantRule.fixGuidance.whatToDo,
          codeExample: assistantRule.fixGuidance.codeExample,
          commonMistakes: assistantRule.fixGuidance.commonMistakes,
          voiceOverTest: assistantRule.voiceOverTest,
        },
        learnMoreUrl: violation.helpUrl,
        axeHelp: violation.help,
        axeDescription: violation.description,
        assistantRule,
      };
    }

    // Fall back to legacy fix-guidance
    const legacyGuidance = getFixGuidance(violation.id);

    if (legacyGuidance) {
      return {
        id: violation.id,
        title: legacyGuidance.title,
        severity: violation.impact,
        guidance: {
          why: legacyGuidance.why,
          fix: legacyGuidance.fix,
          codeExample: legacyGuidance.codeExample,
          commonMistakes: legacyGuidance.avoid,
          voiceOver: legacyGuidance.voiceOver,
        },
        learnMoreUrl: violation.helpUrl,
        axeHelp: violation.help,
        axeDescription: violation.description,
      };
    }

    // No guidance available - use axe defaults
    return {
      id: violation.id,
      title: violation.help,
      severity: violation.impact,
      guidance: null,
      learnMoreUrl: violation.helpUrl,
      axeHelp: violation.help,
      axeDescription: violation.description,
    };
  });
}

/**
 * Get the most severe issue from a list.
 */
export function getMostSevereIssue(issues: MappedIssue[]): MappedIssue | null {
  if (issues.length === 0) return null;

  const severityOrder: (Severity | null)[] = ['critical', 'serious', 'moderate', 'minor', null];

  return issues.reduce((most, current) => {
    const mostIndex = severityOrder.indexOf(most.severity);
    const currentIndex = severityOrder.indexOf(current.severity);
    return currentIndex < mostIndex ? current : most;
  });
}

/**
 * Sort issues by severity (most severe first).
 */
export function sortBySeverity(issues: MappedIssue[]): MappedIssue[] {
  const severityOrder: (Severity | null)[] = ['critical', 'serious', 'moderate', 'minor', null];

  return [...issues].sort((a, b) => {
    const aIndex = severityOrder.indexOf(a.severity);
    const bIndex = severityOrder.indexOf(b.severity);
    return aIndex - bIndex;
  });
}

/**
 * Get a human-readable severity label.
 */
export function getSeverityLabel(severity: Severity | null): string {
  switch (severity) {
    case 'critical':
      return 'Critical';
    case 'serious':
      return 'Serious';
    case 'moderate':
      return 'Moderate';
    case 'minor':
      return 'Minor';
    default:
      return 'Unknown';
  }
}

/**
 * Check if an issue has VoiceOver testing guidance.
 */
export function hasVoiceOverGuide(issue: MappedIssue): boolean {
  return issue.guidance?.voiceOverTest !== undefined || issue.guidance?.voiceOver !== undefined;
}

/**
 * Get VoiceOver test steps from an issue (handles both new and legacy formats).
 */
export function getVoiceOverGuide(issue: MappedIssue): VoiceOverTest | VoiceOverGuide | undefined {
  if (issue.guidance?.voiceOverTest) {
    return issue.guidance.voiceOverTest;
  }
  return issue.guidance?.voiceOver;
}
