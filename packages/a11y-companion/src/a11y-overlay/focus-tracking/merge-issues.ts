/**
 * Merge axe, AccessLint, and pattern issues without duplicate titles / ids.
 */

import type { MappedIssue } from '../map-violations';

export function mergeIssues(
  patternIssues: MappedIssue[],
  axeIssues: MappedIssue[],
  alIssues: MappedIssue[],
): MappedIssue[] {
  const seen = new Set<string>();
  const out: MappedIssue[] = [];

  for (const i of patternIssues) {
    const k = `p:${i.title.toLowerCase()}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  for (const i of axeIssues) {
    const k = `a:${i.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  const axeTitles = new Set(axeIssues.map((i) => i.title.toLowerCase()));
  for (const i of alIssues) {
    if (axeTitles.has(i.title.toLowerCase())) continue;
    const k = `al:${i.title.toLowerCase()}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}
