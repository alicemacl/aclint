'use client';

/**
 * Visual highlight component that draws an outline around the focused element.
 */

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { Portal } from '@ark-ui/react/portal';

import { css } from 'styled-system/css';

type A11yHighlightProps = {
  element: HTMLElement | null;
  isVisible: boolean;
  portalContainerRef?: RefObject<HTMLElement | null>;
};

type Position = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function A11yHighlight({ element, isVisible, portalContainerRef }: A11yHighlightProps) {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!element || !isVisible) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      // Viewport coordinates (fixed positioning) — works when portaled to body or Shadow DOM.
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    updatePosition();

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [element, isVisible]);

  if (!position || !isVisible) {
    return null;
  }

  return (
    <Portal container={portalContainerRef}>
      <div
        className={highlightStyles}
        style={{
          top: position.top - 2,
          left: position.left - 2,
          width: position.width + 4,
          height: position.height + 4,
        }}
        data-a11y-highlight
      />
    </Portal>
  );
}

const highlightStyles = css({
  position: 'fixed',
  pointerEvents: 'none',
  border: '2px solid #3b82f6',
  borderRadius: '4px',
  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
  zIndex: 9998,
  transition: 'all 0.1s ease-out',
});
