import type { RefObject } from 'react';

import type { FocusTrackingResult } from '../use-focus-tracking';

export type Stage = 'default' | 'minimized';

export type PanelView = 'main' | 'fix';

export type A11yPanelProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  focusInfo: FocusTrackingResult;
  showHighlight: boolean;
  onToggleHighlight: () => void;
  /** When set, portals render here (e.g. Shadow root) so styles stay scoped. */
  portalContainerRef?: RefObject<HTMLElement | null>;
};
