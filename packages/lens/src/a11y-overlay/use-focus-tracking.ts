/**
 * Re-export focus tracking hook and types (implementation in ./focus-tracking).
 */

export { useFocusTracking } from './focus-tracking/use-focus-tracking';
export type {
  FocusedElementInfo,
  FocusTrackingResult,
  ParentContext,
  PositionInSet,
} from './focus-tracking/use-focus-tracking';
