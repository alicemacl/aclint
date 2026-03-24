/**
 * macOS VoiceOver announcement synthesis from computed a11y data.
 */

import type { ParentContext, PositionInSet } from './focus-types';
import { getVORoleEntry, type AnnouncementPart } from './vo-role-map';

export type VOAnnouncementPart = {
  key: AnnouncementPart | 'context' | 'headingLevel';
  label: string;
  text: string;
};

export type VOAnnouncement = {
  /** Full string as VoiceOver would speak (comma-separated segments) */
  text: string;
  /** Ordered segments for UI breakdown */
  parts: VOAnnouncementPart[];
  /** True when container context is included in this announcement */
  contextIncluded: boolean;
};

export type VOEngineInput = {
  element: HTMLElement;
  role: string;
  name: string;
  description: string | null;
  level: number | null;
  positionInSet: PositionInSet;
  parentContext: ParentContext;
  hasValidOwnership: boolean;
  /** First context container from previous focus (same node = skip re-announcing list/landmark) */
  previousContextContainer: HTMLElement | null;
};

function isLandmarkRole(role: string): boolean {
  return new Set([
    'navigation',
    'main',
    'banner',
    'contentinfo',
    'complementary',
    'region',
    'search',
    'form',
  ]).has(role);
}

function getRoleLabel(
  role: string,
  level: number | null,
  entry: ReturnType<typeof getVORoleEntry>,
): string {
  if (role === 'heading' && level !== null && entry.usesHeadingLevel) {
    return `heading level ${level}`;
  }
  if (entry.voLabel.includes('{level}') && level !== null) {
    return entry.voLabel.replace('{level}', String(level));
  }
  return entry.voLabel;
}

function getNativeCheckboxState(el: HTMLElement): string | null {
  if (el instanceof HTMLInputElement && el.type === 'checkbox') {
    return el.checked ? 'ticked' : 'unticked';
  }
  if (el instanceof HTMLInputElement && el.type === 'radio') {
    return el.checked ? 'selected' : 'not selected';
  }
  return null;
}

function getStatePhrase(
  element: HTMLElement,
  role: string,
  entry: ReturnType<typeof getVORoleEntry>,
): string | null {
  const native = getNativeCheckboxState(element);
  if (
    native &&
    (role === 'checkbox' ||
      role === 'radio' ||
      element.getAttribute('role') === 'checkbox' ||
      element.getAttribute('role') === 'radio')
  ) {
    return native;
  }

  if (!entry.states) return null;

  const parts: string[] = [];
  for (const [attr, labels] of Object.entries(entry.states)) {
    const ariaAttr = attr.replace('aria-', '');
    const raw =
      element.getAttribute(attr) ??
      (attr === 'aria-checked' && element instanceof HTMLInputElement && element.type === 'checkbox'
        ? element.checked
          ? 'true'
          : 'false'
        : null);
    if (raw === 'true' && labels.true) parts.push(labels.true);
    else if (raw === 'false' && labels.false) parts.push(labels.false);
    else if (raw === 'mixed' && labels.mixed) parts.push(labels.mixed);
  }

  if (parts.length === 0) return null;
  return parts.join(', ');
}

function getValuePhrase(element: HTMLElement, role: string): string | null {
  if (element instanceof HTMLInputElement) {
    if (['text', 'search', 'email', 'url', 'tel', 'password'].includes(element.type)) {
      const v = element.value;
      if (v) return v;
    }
    if (element.type === 'range') {
      return element.getAttribute('aria-valuetext') ?? String(element.value);
    }
  }
  if (element instanceof HTMLTextAreaElement && element.value) {
    return element.value;
  }
  if (role === 'progressbar' || element.getAttribute('role') === 'progressbar') {
    const now = element.getAttribute('aria-valuenow');
    const min = element.getAttribute('aria-valuemin') ?? '0';
    const max = element.getAttribute('aria-valuemax') ?? '100';
    if (now) return `${now} of ${max}`;
  }
  return null;
}

function formatContextSegment(
  immediate: ParentContext[0],
  hasValidOwnership: boolean,
): string | null {
  const shouldAnnounce =
    (hasValidOwnership &&
      ['list', 'menu', 'menubar', 'listbox', 'tree', 'tablist', 'radiogroup'].includes(
        immediate.role,
      )) ||
    isLandmarkRole(immediate.role) ||
    (immediate.name &&
      immediate.role !== 'dialog' &&
      immediate.role !== 'alertdialog');

  if (!shouldAnnounce) return null;

  if (immediate.role === 'list' && immediate.itemCount) {
    return `list ${immediate.itemCount} item${immediate.itemCount === 1 ? '' : 's'}`;
  }
  if (immediate.name) {
    return `in ${immediate.role} "${immediate.name}"`;
  }
  return `in ${immediate.role}`;
}

function shouldIncludeContext(
  parentContext: ParentContext,
  previousContainer: HTMLElement | null,
): { include: boolean; reason: string } {
  if (parentContext.length === 0) {
    return { include: false, reason: 'No container context' };
  }
  const first = parentContext[0];
  if (first.containerElement && previousContainer && first.containerElement === previousContainer) {
    return {
      include: false,
      reason: 'Same container as previous focus — VoiceOver typically does not repeat it',
    };
  }
  return { include: true, reason: 'Entering or moving between containers' };
}

export function generateVOAnnouncement(input: VOEngineInput): VOAnnouncement {
  const {
    element,
    role,
    name,
    description,
    level,
    positionInSet,
    parentContext,
    hasValidOwnership,
    previousContextContainer,
  } = input;

  const entry = getVORoleEntry(role === 'generic' ? 'generic' : role);
  const parts: VOAnnouncementPart[] = [];
  const spoken: string[] = [];

  const roleLabel = getRoleLabel(role, level, entry);

  const { include: includeContext, reason: contextReason } = shouldIncludeContext(
    parentContext,
    previousContextContainer,
  );

  let contextSegment: string | null = null;
  if (includeContext && parentContext.length > 0) {
    contextSegment = formatContextSegment(parentContext[0], hasValidOwnership);
  }

  for (const part of entry.order) {
    if (part === 'name') {
      if (name) {
        parts.push({ key: 'name', label: 'Name', text: name });
        spoken.push(name);
      }
      continue;
    }
    if (part === 'role') {
      if (role === 'generic' && !name) {
        continue;
      }
      parts.push({ key: 'role', label: 'Role (VoiceOver)', text: roleLabel });
      spoken.push(roleLabel);
      continue;
    }
    if (part === 'state') {
      const stateText = getStatePhrase(element, role, entry);
      if (stateText) {
        parts.push({ key: 'state', label: 'State', text: stateText });
        spoken.push(stateText);
      }
      continue;
    }
    if (part === 'position') {
      if (entry.announcesPosition && positionInSet) {
        const pos = `${positionInSet.current} of ${positionInSet.total}`;
        parts.push({ key: 'position', label: 'Position', text: pos });
        spoken.push(pos);
      }
      continue;
    }
    if (part === 'value') {
      const val = getValuePhrase(element, role);
      if (val) {
        parts.push({ key: 'value', label: 'Value', text: val });
        spoken.push(val);
      }
      continue;
    }
    if (part === 'description') {
      if (description) {
        parts.push({ key: 'description', label: 'Description (after pause)', text: description });
        spoken.push(description);
      }
      continue;
    }
  }

  if (description && !entry.order.includes('description')) {
    parts.push({ key: 'description', label: 'Description (after pause)', text: description });
    spoken.push(description);
  }

  if (contextSegment) {
    parts.push({
      key: 'context',
      label: 'Context',
      text: contextSegment,
    });
    spoken.push(contextSegment);
  } else if (parentContext.length > 0 && !includeContext) {
    parts.push({
      key: 'context',
      label: 'Context (not repeated)',
      text: contextReason,
    });
  }

  const text =
    spoken.length > 0 ? spoken.join(', ') : role === 'generic' ? 'No announcement' : 'No announcement';

  return {
    text,
    parts,
    contextIncluded: Boolean(contextSegment),
  };
}
