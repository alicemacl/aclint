/**
 * A11y Overlay - Simple accessibility testing panel.
 */

export { A11yOverlay } from './a11y-overlay';
export { A11yPanel } from './a11y-panel';
export { A11yHighlight } from './a11y-highlight';
export { useFocusTracking } from './use-focus-tracking';
export type { FocusedElementInfo, FocusTrackingResult } from './use-focus-tracking';

// Fix guidance (legacy)
export { FIX_GUIDANCE, getFixGuidance, hasFixGuidance } from './fix-guidance';
export type { FixGuidance, VoiceOverGuide } from './fix-guidance';

// Assistant rules (new, from MVP)
export {
  ASSISTANT_RULES,
  getAssistantRule,
  hasAssistantRule,
  getRequiredParentGuidance,
} from './assistant-rules';
export type { AssistantRule, VoiceOverTest, FixGuidance as AssistantFixGuidance } from './assistant-rules';

// Axe integration
export { checkElement, clearElementCache, getCachedResult, hasCachedResult } from './a11y-axe-check';
export type { AxeCheckResult } from './a11y-axe-check';

// Issue mapping
export {
  mapViolationsToIssues,
  getMostSevereIssue,
  sortBySeverity,
  getSeverityLabel,
  hasVoiceOverGuide,
  getVoiceOverGuide,
} from './map-violations';
export type { MappedIssue, AxeViolation, Severity, CombinedGuidance } from './map-violations';

// Simulations
export {
  applySimulations,
  cleanupSimulations,
  applyReducedMotion,
  applyIncreasedTextSize,
  applyForceFocusVisibility,
  DEFAULT_SIMULATION_SETTINGS,
} from './simulations';
export type { SimulationSettings } from './simulations';
