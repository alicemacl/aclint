/**
 * Accessibility simulations for testing.
 * Toggle visual conditions to test how your app behaves.
 */

// Style IDs for cleanup
const STYLE_IDS = {
  reducedMotion: 'a11y-sim-reduced-motion',
  increasedText: 'a11y-sim-increased-text',
  forceFocus: 'a11y-sim-force-focus',
} as const;

// Data attributes
const DATA_ATTRS = {
  reducedMotion: 'data-a11y-reduced-motion',
  increasedText: 'data-a11y-increased-text',
  forceFocus: 'data-a11y-force-focus',
} as const;

export type SimulationSettings = {
  reducedMotion: boolean;
  increasedTextSize: boolean;
  forceFocusVisibility: boolean;
};

/**
 * Apply reduced motion simulation.
 * Disables all animations and transitions.
 */
export function applyReducedMotion(enabled: boolean): void {
  const root = document.documentElement;
  const existingStyle = document.getElementById(STYLE_IDS.reducedMotion);

  if (enabled) {
    root.setAttribute(DATA_ATTRS.reducedMotion, 'true');
    existingStyle?.remove();

    const style = document.createElement('style');
    style.id = STYLE_IDS.reducedMotion;
    style.textContent = `
      html[${DATA_ATTRS.reducedMotion}="true"] *,
      html[${DATA_ATTRS.reducedMotion}="true"] *::before,
      html[${DATA_ATTRS.reducedMotion}="true"] *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    root.removeAttribute(DATA_ATTRS.reducedMotion);
    existingStyle?.remove();
  }
}

/**
 * Apply increased text size simulation.
 * Scales font-size to 150% to test zoom behavior.
 */
export function applyIncreasedTextSize(enabled: boolean): void {
  const root = document.documentElement;
  const existingStyle = document.getElementById(STYLE_IDS.increasedText);

  if (enabled) {
    root.setAttribute(DATA_ATTRS.increasedText, 'true');
    existingStyle?.remove();

    const style = document.createElement('style');
    style.id = STYLE_IDS.increasedText;
    style.textContent = `
      html[${DATA_ATTRS.increasedText}="true"] {
        font-size: 150% !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    root.removeAttribute(DATA_ATTRS.increasedText);
    existingStyle?.remove();
  }
}

/**
 * Apply forced focus visibility simulation.
 * Makes focus indicators unmissable with a bright outline.
 */
export function applyForceFocusVisibility(enabled: boolean): void {
  const root = document.documentElement;
  const existingStyle = document.getElementById(STYLE_IDS.forceFocus);

  if (enabled) {
    root.setAttribute(DATA_ATTRS.forceFocus, 'true');
    existingStyle?.remove();

    const style = document.createElement('style');
    style.id = STYLE_IDS.forceFocus;
    style.textContent = `
      /* Force focus visibility - exclude a11y panel */
      html[${DATA_ATTRS.forceFocus}="true"] *:focus:not([data-a11y-panel] *),
      html[${DATA_ATTRS.forceFocus}="true"] *:focus-visible:not([data-a11y-panel] *) {
        outline: 3px solid #005fcc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    root.removeAttribute(DATA_ATTRS.forceFocus);
    existingStyle?.remove();
  }
}

/**
 * Apply all simulations based on settings.
 */
export function applySimulations(settings: SimulationSettings): void {
  applyReducedMotion(settings.reducedMotion);
  applyIncreasedTextSize(settings.increasedTextSize);
  applyForceFocusVisibility(settings.forceFocusVisibility);
}

/**
 * Cleanup all simulations.
 */
export function cleanupSimulations(): void {
  applyReducedMotion(false);
  applyIncreasedTextSize(false);
  applyForceFocusVisibility(false);
}

/**
 * Default simulation settings (all off).
 */
export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  reducedMotion: false,
  increasedTextSize: false,
  forceFocusVisibility: false,
};
