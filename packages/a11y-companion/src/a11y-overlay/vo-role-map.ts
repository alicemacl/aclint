/**
 * macOS VoiceOver role labels and announcement building blocks.
 * Extend this file as you validate against real VoiceOver output.
 */

export type AnnouncementPart =
  | 'name'
  | 'role'
  | 'state'
  | 'position'
  | 'value'
  | 'description';

export type VORoleEntry = {
  /** What VoiceOver typically says for this role (macOS) */
  voLabel: string;
  /** Order of spoken segments (excluding container context, handled separately) */
  order: AnnouncementPart[];
  /** Map ARIA/native state to VO-style phrases */
  states?: Record<
    string,
    { true: string; false: string; mixed?: string }
  >;
  /** Whether VO announces "X of Y" for this role when in a set */
  announcesPosition?: boolean;
  /** If true, voLabel may contain {level} for headings */
  usesHeadingLevel?: boolean;
};

/** Fallback when role is unknown */
export const VO_GENERIC: VORoleEntry = {
  voLabel: 'group',
  order: ['name', 'role'],
};

export const VO_ROLE_MAP: Record<string, VORoleEntry> = {
  link: {
    voLabel: 'link',
    order: ['name', 'role'],
  },
  button: {
    voLabel: 'button',
    order: ['name', 'role', 'state'],
    states: {
      'aria-expanded': { true: 'expanded', false: 'collapsed' },
      'aria-pressed': { true: 'pressed', false: 'not pressed' },
    },
  },
  checkbox: {
    voLabel: 'tick box',
    order: ['name', 'role', 'state'],
    states: {
      'aria-checked': { true: 'ticked', false: 'unticked', mixed: 'mixed' },
    },
  },
  radio: {
    voLabel: 'radio button',
    order: ['name', 'role', 'state', 'position'],
    states: {
      'aria-checked': { true: 'selected', false: 'not selected' },
    },
    announcesPosition: true,
  },
  tab: {
    voLabel: 'tab',
    order: ['name', 'role', 'position', 'state'],
    states: {
      'aria-selected': { true: 'selected', false: '' },
    },
    announcesPosition: true,
  },
  tabpanel: {
    voLabel: 'tab panel',
    order: ['name', 'role'],
  },
  menuitem: {
    voLabel: 'menu item',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  menuitemcheckbox: {
    voLabel: 'menu item',
    order: ['name', 'role', 'state', 'position'],
    states: {
      'aria-checked': { true: 'ticked', false: 'unticked', mixed: 'mixed' },
    },
    announcesPosition: true,
  },
  menuitemradio: {
    voLabel: 'menu item',
    order: ['name', 'role', 'state', 'position'],
    states: {
      'aria-checked': { true: 'selected', false: 'not selected' },
    },
    announcesPosition: true,
  },
  combobox: {
    voLabel: 'pop up button',
    order: ['name', 'role', 'state', 'value'],
    states: {
      'aria-expanded': { true: 'expanded', false: 'collapsed' },
    },
  },
  textbox: {
    voLabel: 'text field',
    order: ['name', 'role', 'state', 'value'],
    states: {
      'aria-invalid': { true: 'invalid', false: '' },
      'aria-readonly': { true: 'read only', false: '' },
    },
  },
  searchbox: {
    voLabel: 'search field',
    order: ['name', 'role', 'state', 'value'],
  },
  slider: {
    voLabel: 'slider',
    order: ['name', 'role', 'value'],
  },
  switch: {
    voLabel: 'switch',
    order: ['name', 'role', 'state'],
    states: {
      'aria-checked': { true: 'on', false: 'off' },
    },
  },
  heading: {
    voLabel: 'heading level {level}',
    order: ['name', 'role'],
    usesHeadingLevel: true,
  },
  img: {
    voLabel: 'image',
    order: ['name', 'role'],
  },
  listitem: {
    voLabel: 'list item',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
  option: {
    voLabel: 'item',
    order: ['name', 'role', 'position', 'state'],
    states: {
      'aria-selected': { true: 'selected', false: 'not selected' },
    },
    announcesPosition: true,
  },
  treeitem: {
    voLabel: 'item',
    order: ['name', 'role', 'position'],
    announcesPosition: true,
  },
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

export function getVORoleEntry(role: string): VORoleEntry {
  return VO_ROLE_MAP[role] ?? VO_GENERIC;
}
