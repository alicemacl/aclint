import type { FixGuidance } from '../types';

export const tablesEntries: Record<string, FixGuidance> = {
  'td-headers-attr': {
    title: 'Table cell has invalid headers',
    why: 'Screen readers use headers to describe table cells. Invalid references break this association.',
    fix: 'Ensure the headers attribute references valid <th> elements with matching id values.',
  },

  'th-has-data-cells': {
    title: 'Table header has no data cells',
    why: 'This table header is not associated with any data cells. It may confuse screen reader users.',
    fix: 'Ensure each <th> is associated with at least one <td> in its row or column.',
  },
};
