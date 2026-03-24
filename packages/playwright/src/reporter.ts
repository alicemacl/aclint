import type { A11yViolation, ScanResult, Severity } from './types';

const SEVERITY_ICON: Record<Severity, string> = {
  critical: '✖',
  serious: '✖',
  moderate: '⚠',
  minor: '⚠',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'CRITICAL',
  serious: 'SERIOUS',
  moderate: 'MODERATE',
  minor: 'MINOR',
};

function formatViolation(v: A11yViolation, index: number): string {
  const icon = SEVERITY_ICON[v.severity];
  const label = SEVERITY_LABEL[v.severity];
  const source = v.source === 'pattern' ? 'pattern' : 'axe';
  const lines: string[] = [];

  lines.push(`  ${icon} ${index + 1}. [${label}] ${v.message} (${source}:${v.id})`);
  lines.push(`     Selector: ${v.selector}`);

  if (v.sourceLocation) {
    const loc = v.sourceLocation;
    const col = loc.columnNumber ? `:${loc.columnNumber}` : '';
    lines.push(`     Source:   ${loc.fileName}:${loc.lineNumber}${col}`);
  }

  lines.push(`     Fix:      ${v.help}`);
  lines.push(`     Info:     ${v.learnMoreUrl}`);

  if (v.snippet.length > 0) {
    const snippet = v.snippet.length > 120 ? v.snippet.slice(0, 120) + '…' : v.snippet;
    lines.push(`     HTML:     ${snippet}`);
  }

  return lines.join('\n');
}

export function formatResults(result: ScanResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`─── ACLint scan: ${result.url} ───`);
  lines.push(`    ${result.elementsScanned} elements · ${result.scanDurationMs}ms`);
  lines.push('');

  if (result.violations.length === 0) {
    lines.push('  ✓ No accessibility violations found');
    lines.push('');
    return lines.join('\n');
  }

  const critical = result.violations.filter((v) => v.severity === 'critical');
  const serious = result.violations.filter((v) => v.severity === 'serious');
  const moderate = result.violations.filter((v) => v.severity === 'moderate');
  const minor = result.violations.filter((v) => v.severity === 'minor');

  const counts = [
    critical.length && `${critical.length} critical`,
    serious.length && `${serious.length} serious`,
    moderate.length && `${moderate.length} moderate`,
    minor.length && `${minor.length} minor`,
  ]
    .filter(Boolean)
    .join(', ');

  lines.push(`  ${result.violations.length} violations (${counts})`);
  lines.push('');

  const sorted = [...critical, ...serious, ...moderate, ...minor];
  sorted.forEach((v, i) => {
    lines.push(formatViolation(v, i));
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Build a concise failure message for use with expect().
 */
export function buildFailureMessage(result: ScanResult): string {
  if (result.violations.length === 0) return '';

  const lines = result.violations.map((v, i) => {
    const loc = v.sourceLocation
      ? ` (${v.sourceLocation.fileName}:${v.sourceLocation.lineNumber})`
      : '';
    return `  ${i + 1}. [${v.severity}] ${v.message} — ${v.selector}${loc}`;
  });

  return `${result.violations.length} accessibility violation(s) on ${result.url}:\n${lines.join('\n')}`;
}
