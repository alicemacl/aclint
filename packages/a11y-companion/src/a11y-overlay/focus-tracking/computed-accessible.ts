/**
 * Computed accessible role, name, description, and states.
 */

function getInputRole(input: HTMLInputElement): string {
  const typeRoles: Record<string, string> = {
    button: 'button',
    checkbox: 'checkbox',
    radio: 'radio',
    range: 'slider',
    search: 'searchbox',
    submit: 'button',
    reset: 'button',
  };
  return typeRoles[input.type] || 'textbox';
}

/**
 * Get the computed accessible role for an element.
 */
export function getComputedRole(element: HTMLElement): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const el = element as any;
  if (el.computedRole) {
    return el.computedRole;
  }

  const explicitRole = element.getAttribute('role');
  if (explicitRole) return explicitRole;

  const tagRoles: Record<string, string> = {
    A: 'link',
    BUTTON: 'button',
    INPUT: getInputRole(element as HTMLInputElement),
    SELECT: 'combobox',
    TEXTAREA: 'textbox',
    IMG: 'img',
    NAV: 'navigation',
    MAIN: 'main',
    HEADER: 'banner',
    FOOTER: 'contentinfo',
    ASIDE: 'complementary',
    ARTICLE: 'article',
    SECTION: 'region',
    H1: 'heading',
    H2: 'heading',
    H3: 'heading',
    H4: 'heading',
    H5: 'heading',
    H6: 'heading',
  };

  return tagRoles[element.tagName] || 'generic';
}

/**
 * Get the computed accessible name for an element.
 */
export function getComputedName(element: HTMLElement): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const el = element as any;
  if (typeof el.computedName === 'string' && el.computedName) {
    return el.computedName;
  }

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labels = labelledBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (labels.length > 0) return labels.join(' ');
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    const id = element.id;
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
    }
  }

  if (element instanceof HTMLImageElement) {
    if (element.alt) return element.alt;
  }

  if (element instanceof HTMLInputElement && ['submit', 'reset', 'button'].includes(element.type)) {
    if (element.value) return element.value;
  }

  const childWithLabel = element.querySelector('[aria-label]');
  if (childWithLabel) {
    const childLabel = childWithLabel.getAttribute('aria-label');
    if (childLabel) return childLabel;
  }

  const imgChild = element.querySelector('img[alt]');
  if (imgChild) {
    const alt = imgChild.getAttribute('alt');
    if (alt) return alt;
  }

  const svgChild = element.querySelector('svg');
  if (svgChild) {
    const svgTitle = svgChild.querySelector('title');
    if (svgTitle?.textContent) return svgTitle.textContent.trim();
  }

  const textContent = element.textContent?.trim();
  if (textContent) return textContent;

  return '';
}

/**
 * Get the computed accessible description for an element.
 */
export function getComputedDescription(element: HTMLElement): string | null {
  const describedBy = element.getAttribute('aria-describedby');
  if (describedBy) {
    const descriptions = describedBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (descriptions.length > 0) return descriptions.join(' ');
  }

  const title = element.getAttribute('title');
  if (title) return title;

  return null;
}

/**
 * Get accessibility states for an element.
 */
export function getStates(element: HTMLElement): string[] {
  const states: string[] = [];

  const expanded = element.getAttribute('aria-expanded');
  if (expanded === 'true') states.push('expanded');
  if (expanded === 'false') states.push('collapsed');

  const checked = element.getAttribute('aria-checked');
  if (checked === 'true') states.push('checked');
  if (checked === 'false') states.push('not checked');
  if (checked === 'mixed') states.push('partially checked');

  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    states.push(element.checked ? 'checked' : 'not checked');
  }

  const selected = element.getAttribute('aria-selected');
  if (selected === 'true') states.push('selected');

  const pressed = element.getAttribute('aria-pressed');
  if (pressed === 'true') states.push('pressed');
  if (pressed === 'false') states.push('not pressed');

  if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
    states.push('disabled');
  }

  if (element.hasAttribute('required') || element.getAttribute('aria-required') === 'true') {
    states.push('required');
  }

  if (element.getAttribute('aria-invalid') === 'true') {
    states.push('invalid');
  }

  if (element.hasAttribute('readonly') || element.getAttribute('aria-readonly') === 'true') {
    states.push('read-only');
  }

  const current = element.getAttribute('aria-current');
  if (current && current !== 'false') {
    states.push(current === 'true' ? 'current' : `current ${current}`);
  }

  return states;
}
