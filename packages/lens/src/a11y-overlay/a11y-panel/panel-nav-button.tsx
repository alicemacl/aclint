'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from 'styled-system/css';

import type { FocusedElementInfo } from '../use-focus-tracking';
import {
  navButtonDisabledStyles,
  navButtonLabelStyles,
  navButtonRoleStyles,
  navButtonStyles,
  navButtonTextStyles,
} from './panel-styles-content';

type NavButtonProps = {
  direction: 'prev' | 'next';
  info: FocusedElementInfo | null;
  onClick: () => void;
};

export function NavButton({ direction, info, onClick }: NavButtonProps) {
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      className={cx(navButtonStyles, !info && navButtonDisabledStyles)}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      tabIndex={-1}
      disabled={!info}
    >
      {isPrev && <Icon size={14} />}
      <div className={navButtonTextStyles}>
        <span className={navButtonLabelStyles}>{isPrev ? 'Previous' : 'Next'}</span>
        {info && <span className={navButtonRoleStyles}>{info.role}</span>}
      </div>
      {!isPrev && <Icon size={14} />}
    </button>
  );
}
