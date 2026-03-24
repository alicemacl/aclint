export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export type ViolationSource = 'axe' | 'pattern';

export type SourceLocation = {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
};

export type A11yViolation = {
  id: string;
  source: ViolationSource;
  severity: Severity;
  message: string;
  help: string;
  selector: string;
  snippet: string;
  learnMoreUrl: string;
  /** React _debugSource, when available (dev mode only) */
  sourceLocation?: SourceLocation;
};

export type ScanResult = {
  url: string;
  violations: A11yViolation[];
  elementsScanned: number;
  scanDurationMs: number;
};

export type ScanOptions = {
  /** axe-core rule IDs to disable (e.g. ['color-contrast']) */
  disableRules?: string[];
  /** Only report violations at or above this severity */
  minSeverity?: Severity;
  /** Include pattern detection checks (default: true) */
  includePatterns?: boolean;
  /** Include axe-core checks (default: true) */
  includeAxe?: boolean;
  /** Try to extract React _debugSource for file:line mapping (default: true) */
  reactSourceMapping?: boolean;
  /** Selector scope — only scan within this element (default: 'body') */
  scope?: string;
};
