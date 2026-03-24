'use client';

import { AlertTriangle } from 'lucide-react';

import { getRequiredParentGuidance, type VoiceOverTest } from '../assistant-rules';
import type { VoiceOverGuide } from '../fix-guidance';
import {
  contextGuidanceStyles,
  inlineVoGuideStyles,
  voExpectInlineStyles,
  voExpectLabelStyles,
  voGoalStyles,
  voInlineStepsStyles,
} from './panel-styles-content';

export function ContextSpecificGuidance({ role }: { role: string }) {
  const guidance = getRequiredParentGuidance(role);

  if (!guidance) {
    return null;
  }

  return (
    <div className={contextGuidanceStyles}>
      <AlertTriangle size={14} />
      <span>{guidance}</span>
    </div>
  );
}

export function InlineVoiceOverGuide({ guide }: { guide: VoiceOverTest | VoiceOverGuide }) {
  const isNewFormat = 'expectedOutput' in guide;

  const goal = isNewFormat ? (guide as VoiceOverTest).goal : (guide as VoiceOverGuide).goal;
  const steps = isNewFormat ? (guide as VoiceOverTest).steps : (guide as VoiceOverGuide).steps;
  const expectedOutput = isNewFormat
    ? (guide as VoiceOverTest).expectedOutput
    : (guide as VoiceOverGuide).expect;

  return (
    <div className={inlineVoGuideStyles}>
      <p className={voGoalStyles}>{goal}</p>
      <ol className={voInlineStepsStyles}>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div className={voExpectInlineStyles}>
        <span className={voExpectLabelStyles}>You should hear:</span>
        <span>{expectedOutput}</span>
      </div>
    </div>
  );
}
