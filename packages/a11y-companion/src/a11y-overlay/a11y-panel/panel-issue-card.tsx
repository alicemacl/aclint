'use client';

import { AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react';
import { cx } from 'styled-system/css';

import type { MappedIssue } from '../map-violations';
import {
  howToFixButtonStyles,
  issueCardCriticalStyles,
  issueCardFooterStyles,
  issueCardHeaderStyles,
  issueCardMinorStyles,
  issueCardModerateStyles,
  issueCardSeriousStyles,
  issueCardStyles,
  issueCardTitleStyles,
  learnMoreStyles,
  sourceBadgeAccessLintStyles,
  sourceBadgePatternStyles,
  sourceBadgeStyles,
} from './panel-styles-content';

type IssueCardProps = {
  issue: MappedIssue;
  onOpenFix: (issue: MappedIssue) => void;
};

export function IssueCard({ issue, onOpenFix }: IssueCardProps) {
  return (
    <div className={cx(issueCardStyles, getSeverityClass(issue.severity))}>
      <div className={issueCardHeaderStyles}>
        <AlertTriangle size={14} />
        <span className={issueCardTitleStyles}>{issue.title}</span>
        {issue.source && (
          <span
            className={cx(
              sourceBadgeStyles,
              issue.source === 'accesslint' && sourceBadgeAccessLintStyles,
              issue.source === 'pattern' && sourceBadgePatternStyles,
            )}
          >
            {issue.source === 'accesslint' ? 'AL' : issue.source === 'pattern' ? 'sem' : 'axe'}
          </span>
        )}
      </div>
      <div className={issueCardFooterStyles}>
        {issue.guidance ? (
          <button
            className={howToFixButtonStyles}
            onClick={() => onOpenFix(issue)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
          >
            How to fix
            <ChevronRight size={12} />
          </button>
        ) : (
          <a
            href={issue.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={learnMoreStyles}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
          >
            Learn more
            <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

function getSeverityClass(severity: MappedIssue['severity']): string {
  switch (severity) {
    case 'critical':
      return issueCardCriticalStyles;
    case 'serious':
      return issueCardSeriousStyles;
    case 'moderate':
      return issueCardModerateStyles;
    default:
      return issueCardMinorStyles;
  }
}
