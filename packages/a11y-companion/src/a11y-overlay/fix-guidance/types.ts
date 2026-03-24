export type VoiceOverGuide = {
  goal: string;
  steps: string[];
  expect: string;
};

export type FixGuidance = {
  title: string;
  why: string;
  fix: string;
  codeExample?: string;
  avoid?: string[];
  voiceOver?: VoiceOverGuide;
};
