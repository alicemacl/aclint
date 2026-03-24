/**
 * Shared types for focus tracking and VoiceOver engine (avoids circular imports).
 */

export type PositionInSet = {
  current: number;
  total: number;
} | null;

export type ParentContextEntry = {
  role: string;
  name: string | null;
  itemCount?: number;
  /** DOM node for this container (for context-change detection) */
  containerElement?: HTMLElement;
};

export type ParentContext = ParentContextEntry[];
