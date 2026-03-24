export { test, scan, assertAccessible } from './fixture';
export type { A11yFixtures } from './fixture';

export { scanPage } from './scanner';

export { formatResults, buildFailureMessage } from './reporter';

export type {
  A11yViolation,
  ScanResult,
  ScanOptions,
  Severity,
  ViolationSource,
  SourceLocation,
} from './types';
