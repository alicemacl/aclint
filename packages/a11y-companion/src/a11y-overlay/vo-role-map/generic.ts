import type { VORoleEntry } from './types';

/** Fallback when role is unknown */
export const VO_GENERIC: VORoleEntry = {
  voLabel: 'group',
  order: ['name', 'role'],
};
