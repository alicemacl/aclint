/**
 * Tags that have implicit ARIA roles (subset used when walking ancestors).
 */

export const TAG_TO_IMPLICIT_ROLE: Record<string, string> = {
  UL: 'list',
  OL: 'list',
  MENU: 'menu',
  NAV: 'navigation',
  MAIN: 'main',
  HEADER: 'banner',
  FOOTER: 'contentinfo',
  ASIDE: 'complementary',
  FORM: 'form',
  TABLE: 'table',
  DIALOG: 'dialog',
  ARTICLE: 'article',
  SECTION: 'region',
};

/**
 * Get the implicit ARIA role for an HTML element (container tags only).
 */
export function getImplicitRole(element: HTMLElement): string | null {
  return TAG_TO_IMPLICIT_ROLE[element.tagName] || null;
}
