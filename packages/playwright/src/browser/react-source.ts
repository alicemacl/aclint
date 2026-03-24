/**
 * Extract React _debugSource from the fiber tree to get file:line mapping.
 * Only works in React development mode.
 */

export type SourceLocation = {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
};

export function getReactSource(element: HTMLElement): SourceLocation | null {
  const fiberKey = Object.keys(element).find(
    (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'),
  );
  if (!fiberKey) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fiber = (element as any)[fiberKey];

  // Walk up fiber tree to find the nearest component with _debugSource
  for (let i = 0; i < 20 && fiber; i++) {
    if (fiber._debugSource) {
      return {
        fileName: fiber._debugSource.fileName,
        lineNumber: fiber._debugSource.lineNumber,
        columnNumber: fiber._debugSource.columnNumber,
      };
    }
    fiber = fiber.return;
  }

  return null;
}
