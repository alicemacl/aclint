export type { ComponentPattern, PatternExpectation, PatternSeverity } from './types';

import { disclosureTriggerPattern } from './disclosure-trigger';
import { dialogFocusPattern } from './dialog-focus';
import { fakeButtonPattern } from './fake-button';
import { focusTrapHeuristicPattern } from './focus-trap-heuristic';
import { linkAsTriggerPattern } from './link-as-trigger';
import { missingLabelPattern } from './missing-label';
import { tabInterfacePattern } from './tab-interface';

export const ALL_PATTERNS = [
  linkAsTriggerPattern,
  disclosureTriggerPattern,
  fakeButtonPattern,
  missingLabelPattern,
  dialogFocusPattern,
  tabInterfacePattern,
  focusTrapHeuristicPattern,
];
