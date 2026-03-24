/**
 * Map macOS VoiceOver test steps to iOS gestures.
 * Phase 1: pattern-based substitution with a fallback for unrecognised steps.
 */

import type { VoPlatform } from './vo-platform-types';

const MACOS_TO_IOS: [RegExp, string][] = [
  [/Press Cmd \+ F5 to start VoiceOver/i, 'Enable VoiceOver in Settings > Accessibility > VoiceOver'],
  [/Enable VoiceOver \(Cmd \+ F5\)/i, 'Enable VoiceOver in Settings > Accessibility > VoiceOver'],
  [/Press Tab until you reach/i, 'Swipe right until VoiceOver focuses on'],
  [/Press Tab to (?:move|navigate)/i, 'Swipe right to move to the next element'],
  [/Press VO \+ U to open the rotor/i, 'Rotate two fingers on the screen to open the Rotor'],
  [/Open the Rotor \(VO \+ U\)/i, 'Rotate two fingers on the screen to open the Rotor'],
  [/Open Rotor \(VO \+ U\)/i, 'Rotate two fingers on the screen to open the Rotor'],
  [/Press VO \+ Cmd \+ H/i, 'Set the Rotor to Headings and swipe up/down'],
  [/Navigate to .* using VO \+ Right Arrow/i, 'Swipe right to navigate to the element'],
  [/Use VO \+ Right Arrow/i, 'Swipe right to move to the next item'],
  [/Press Tab/i, 'Swipe right'],
  [/Use Arrow keys to scroll/i, 'Use three-finger swipe to scroll'],
  [/Navigate to "Landmarks"/i, 'Set the Rotor to Landmarks and swipe up/down'],
];

function translateStep(macosStep: string): string {
  for (const [pattern, replacement] of MACOS_TO_IOS) {
    if (pattern.test(macosStep)) {
      return macosStep.replace(pattern, replacement);
    }
  }
  return macosStep;
}

/**
 * Translate macOS VoiceOver test steps to the target platform.
 * On macOS this is a no-op; on iOS it maps keyboard shortcuts to gestures.
 */
export function getVoiceOverSteps(platform: VoPlatform, macosSteps: string[]): string[] {
  if (platform === 'macos') return macosSteps;

  return macosSteps.map(translateStep);
}
