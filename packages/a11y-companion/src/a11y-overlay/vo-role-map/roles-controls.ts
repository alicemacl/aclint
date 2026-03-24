import type { VORoleEntry } from './types';

/** Links, buttons, form-like controls, tabs, menus */
export const VO_ROLES_CONTROLS: Record<string, VORoleEntry> = {
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
};
