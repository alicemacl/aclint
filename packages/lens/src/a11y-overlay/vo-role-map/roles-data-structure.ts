import type { VORoleEntry } from './types';

/** Tables, grids, dialogs, live regions */
export const VO_ROLES_DATA_STRUCTURE: Record<string, VORoleEntry> = {
  cell: {
    voLabel: 'cell',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  row: {
    voLabel: 'row',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  columnheader: {
    voLabel: 'column header',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  rowheader: {
    voLabel: 'row header',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  dialog: {
    voLabel: 'dialog',
    order: ['name', 'role'],
  },
  alertdialog: {
    voLabel: 'alert dialog',
    order: ['name', 'role'],
  },
  alert: {
    voLabel: 'alert',
    order: ['name', 'role'],
  },
  status: {
    voLabel: 'status',
    order: ['name', 'role'],
  },
  progressbar: {
    voLabel: 'progress indicator',
    order: ['name', 'role', 'value'],
  },
  separator: {
    voLabel: 'splitter',
    order: ['role'],
  },
  toolbar: {
    voLabel: 'toolbar',
    order: ['name', 'role'],
  },
  tooltip: {
    voLabel: 'help tag',
    order: ['name', 'role'],
  },
  group: {
    voLabel: 'group',
    order: ['name', 'role'],
  },
  region: {
    voLabel: 'region',
    order: ['name', 'role'],
  },
};
