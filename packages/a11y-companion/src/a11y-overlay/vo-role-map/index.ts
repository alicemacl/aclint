/**
 * macOS VoiceOver role labels and announcement building blocks.
 */

import { VO_GENERIC } from './generic';
import type { VORoleEntry } from './types';
import { VO_ROLES_CONTROLS } from './roles-controls';
import { VO_ROLES_DATA_STRUCTURE } from './roles-data-structure';
import { VO_ROLES_LANDMARKS } from './roles-landmarks';

export type { AnnouncementPart, VORoleEntry } from './types';

export { VO_GENERIC };

export const VO_ROLE_MAP: Record<string, VORoleEntry> = {
  ...VO_ROLES_CONTROLS,
  ...VO_ROLES_DATA_STRUCTURE,
  ...VO_ROLES_LANDMARKS,
};

export function getVORoleEntry(role: string): VORoleEntry {
  return VO_ROLE_MAP[role] ?? VO_GENERIC;
}
