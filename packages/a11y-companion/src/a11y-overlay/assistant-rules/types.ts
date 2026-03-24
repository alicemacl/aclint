/**
 * Shared types for assistant rules (axe violation guidance).
 */

export type VoiceOverTest = {
  goal: string;
  steps: string[];
  expectedOutput: string;
};

export type FixGuidance = {
  whatToDo: string;
  codeExample?: string;
  commonMistakes?: string[];
};

export type AssistantRule = {
  id: string;
  axeRuleIds: string[];
  severity: 'critical' | 'warning' | 'info';
  category: string;
  summary: string;
  explanation: string;
  fixGuidance: FixGuidance;
  voiceOverTest: VoiceOverTest;
};
