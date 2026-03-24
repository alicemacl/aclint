import type { VORoleEntry } from './types';

/** Landmarks, lists, trees, radiogroup, generic */
export const VO_ROLES_LANDMARKS: Record<string, VORoleEntry> = {
  navigation: {
    voLabel: 'navigation',
    order: ['name', 'role'],
  },
  main: {
    voLabel: 'main',
    order: ['name', 'role'],
  },
  banner: {
    voLabel: 'banner',
    order: ['name', 'role'],
  },
  contentinfo: {
    voLabel: 'footer',
    order: ['name', 'role'],
  },
  complementary: {
    voLabel: 'complementary',
    order: ['name', 'role'],
  },
  form: {
    voLabel: 'form',
    order: ['name', 'role'],
  },
  search: {
    voLabel: 'search',
    order: ['name', 'role'],
  },
  article: {
    voLabel: 'article',
    order: ['name', 'role'],
  },
  list: {
    voLabel: 'list',
    order: ['name', 'role'],
  },
  menu: {
    voLabel: 'menu',
    order: ['name', 'role'],
  },
  menubar: {
    voLabel: 'menu bar',
    order: ['name', 'role'],
  },
  listbox: {
    voLabel: 'list box',
    order: ['name', 'role'],
  },
  radiogroup: {
    voLabel: 'radio group',
    order: ['name', 'role'],
  },
  tablist: {
    voLabel: 'tab group',
    order: ['name', 'role'],
  },
  table: {
    voLabel: 'table',
    order: ['name', 'role'],
  },
  grid: {
    voLabel: 'grid',
    order: ['name', 'role'],
  },
  treegrid: {
    voLabel: 'tree grid',
    order: ['name', 'role'],
  },
  tree: {
    voLabel: 'tree',
    order: ['name', 'role'],
  },
  generic: {
    voLabel: 'group',
    order: ['name'],
  },
};
