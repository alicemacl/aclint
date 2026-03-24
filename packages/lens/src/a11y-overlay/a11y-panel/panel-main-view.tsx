'use client';

import { useState } from 'react';

import { AlertTriangle, ChevronDown, Copy, Eye, Loader2 } from 'lucide-react';
import { cx } from 'styled-system/css';

import type { MappedIssue } from '../map-violations';
import type { FocusedElementInfo } from '../use-focus-tracking';
import { useVoPlatform, VO_PLATFORM_LABELS } from '../vo-platform';
import { IssueCard } from './panel-issue-card';
import { NavButton } from './panel-nav-button';
import {
  announcementBoxStyles,
  announcementHeaderStyles,
  announcementTextStyles,
  announcementTitleStyles,
  checkingStyles,
  elementHeaderStyles,
  elementLabelStyles,
  elementRowStyles,
  elementSectionStyles,
  emptyStateStyles,
  hintStyles,
  iconButtonStyles,
  inspectButtonStyles,
  issuesSectionStyles,
  kbdStyles,
  mainViewStyles,
  nameValueStyles,
  navSectionStyles,
  noIssuesStyles,
  ownershipWarningStyles,
  patternSectionStyles,
  positionValueStyles,
  roleValueStyles,
  sectionTitleStyles,
  selectorRowStyles,
  selectorStyles,
  snippetChevronOpenStyles,
  snippetChevronStyles,
  snippetCodeStyles,
  snippetCopyButtonStyles,
  snippetHeaderStyles,
  snippetToggleStyles,
  spinnerStyles,
  stateTagStyles,
  statesStyles,
  subsectionHintStyles,
  subsectionTitleStyles,
  contextNameStyles,
  contextStyles,
  contextTagStyles,
  voBreakdownItemStyles,
  voBreakdownLabelStyles,
  voBreakdownListStyles,
  voBreakdownTextStyles,
  voHintStyles,
} from './panel-styles-content';

export type MainViewProps = {
  current: FocusedElementInfo | null;
  prev: FocusedElementInfo | null;
  next: FocusedElementInfo | null;
  patternIssues: MappedIssue[];
  wcagIssues: MappedIssue[];
  isChecking: boolean;
  showSnippet: boolean;
  onToggleSnippet: () => void;
  onOpenFix: (issue: MappedIssue) => void;
  onCopyAnnouncement: () => void;
  onInspect: () => void;
  onFocusPrev: () => void;
  onFocusNext: () => void;
};

export function MainView({
  current,
  prev,
  next,
  patternIssues,
  wcagIssues,
  isChecking,
  showSnippet,
  onToggleSnippet,
  onOpenFix,
  onCopyAnnouncement,
  onInspect,
  onFocusPrev,
  onFocusNext,
}: MainViewProps) {
  const [showVoBreakdown, setShowVoBreakdown] = useState(false);
  const { platform } = useVoPlatform();

  if (!current) {
    return (
      <div className={emptyStateStyles}>
        <p>No element focused</p>
        <p className={hintStyles}>Press <kbd className={kbdStyles}>Tab</kbd> to navigate</p>
      </div>
    );
  }

  const totalIssueCount = patternIssues.length + wcagIssues.length;

  return (
    <div className={mainViewStyles}>
      <div className={announcementBoxStyles}>
        <div className={announcementHeaderStyles}>
          <span className={announcementTitleStyles}>VoiceOver ({VO_PLATFORM_LABELS[platform]}) says</span>
          <button
            className={iconButtonStyles}
            onClick={onCopyAnnouncement}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
            title="Copy"
          >
            <Copy size={12} />
          </button>
        </div>
        <p className={announcementTextStyles}>&ldquo;{current.announcement}&rdquo;</p>
        <p className={voHintStyles}>
          Approximation for learning — verify with VoiceOver on a real {platform === 'ios' ? 'iOS' : 'Mac'} device.
        </p>
        <div
          className={snippetToggleStyles}
          onClick={() => setShowVoBreakdown((v) => !v)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ChevronDown
            size={12}
            className={cx(snippetChevronStyles, showVoBreakdown && snippetChevronOpenStyles)}
          />
          <span>How this line is built</span>
        </div>
        {showVoBreakdown && (
          <ul className={voBreakdownListStyles}>
            {current.voOutput.parts.map((part, i) => (
              <li key={i} className={voBreakdownItemStyles}>
                <span className={voBreakdownLabelStyles}>{part.label}</span>
                <span className={voBreakdownTextStyles}>{part.text}</span>
              </li>
            ))}
          </ul>
        )}
        {current.ownershipIssue && (
          <div className={ownershipWarningStyles}>
            <AlertTriangle size={12} />
            <span>{current.ownershipIssue}</span>
          </div>
        )}
      </div>

      <div className={elementSectionStyles}>
        <div className={elementHeaderStyles}>
          <span className={sectionTitleStyles}>Element</span>
        </div>

        <div className={elementRowStyles}>
          <span className={elementLabelStyles}>Role</span>
          <span className={roleValueStyles}>{current.role}</span>
        </div>

        <div className={elementRowStyles}>
          <span className={elementLabelStyles}>Name</span>
          <span className={nameValueStyles}>{current.name || '(empty)'}</span>
        </div>

        {current.positionInSet && (
          <div className={elementRowStyles}>
            <span className={elementLabelStyles}>Position</span>
            <span className={positionValueStyles}>
              {current.positionInSet.current} of {current.positionInSet.total}
            </span>
          </div>
        )}

        {current.parentContext.length > 0 && (
          <div className={elementRowStyles}>
            <span className={elementLabelStyles}>Context</span>
            <div className={contextStyles}>
              {current.parentContext.map((ctx, i) => (
                <span key={i} className={contextTagStyles}>
                  {ctx.role}
                  {ctx.name && <span className={contextNameStyles}> &ldquo;{ctx.name}&rdquo;</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {current.states.length > 0 && (
          <div className={elementRowStyles}>
            <span className={elementLabelStyles}>States</span>
            <div className={statesStyles}>
              {current.states.map((state) => (
                <span key={state} className={stateTagStyles}>{state}</span>
              ))}
            </div>
          </div>
        )}

        <div className={selectorRowStyles}>
          <code className={selectorStyles}>{current.selector}</code>
          <button
            className={inspectButtonStyles}
            onClick={onInspect}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
          >
            <Eye size={12} />
            <span>Inspect</span>
          </button>
        </div>

        <div className={snippetHeaderStyles}>
          <div
            className={snippetToggleStyles}
            onClick={onToggleSnippet}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ChevronDown
              size={12}
              className={cx(snippetChevronStyles, showSnippet && snippetChevronOpenStyles)}
            />
            <span>HTML</span>
          </div>
          {showSnippet && (
            <button
              className={snippetCopyButtonStyles}
              onClick={() => {
                navigator.clipboard.writeText(current.snippet);
              }}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
              title="Copy HTML"
            >
              <Copy size={10} />
            </button>
          )}
        </div>

        {showSnippet && (
          <pre className={snippetCodeStyles}>
            <code>{current.snippet}</code>
          </pre>
        )}
      </div>

      {isChecking && (
        <div className={checkingStyles}>
          <Loader2 size={14} className={spinnerStyles} />
          <span>Checking...</span>
        </div>
      )}

      {!isChecking && patternIssues.length > 0 && (
        <div className={patternSectionStyles}>
          <div className={subsectionTitleStyles}>Semantic patterns</div>
          <p className={subsectionHintStyles}>
            Context Lighthouse-style tools often miss — role vs. real behavior.
          </p>
          <div className={issuesSectionStyles}>
            {patternIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onOpenFix={onOpenFix} />
            ))}
          </div>
        </div>
      )}

      {!isChecking && wcagIssues.length > 0 && (
        <div className={patternSectionStyles}>
          <div className={subsectionTitleStyles}>WCAG (axe / AccessLint)</div>
          <div className={issuesSectionStyles}>
            {wcagIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onOpenFix={onOpenFix} />
            ))}
          </div>
        </div>
      )}

      {!isChecking && totalIssueCount === 0 && (
        <div className={noIssuesStyles}>
          <span>No issues found</span>
        </div>
      )}

      <div className={navSectionStyles}>
        <NavButton direction="prev" info={prev} onClick={onFocusPrev} />
        <NavButton direction="next" info={next} onClick={onFocusNext} />
      </div>
    </div>
  );
}
