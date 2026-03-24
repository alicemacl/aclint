'use client';

import { useCallback, useState } from 'react';

import { ChevronDown, ClipboardCopy, ExternalLink, Lightbulb } from 'lucide-react';
import { cx } from 'styled-system/css';

import type { MappedIssue } from '../map-violations';
import { getSeverityLabel, getVoiceOverGuide } from '../map-violations';
import type { FocusedElementInfo } from '../use-focus-tracking';
import { ContextSpecificGuidance, InlineVoiceOverGuide } from './panel-inline-guidance';
import {
  avoidListStyles,
  codeBlockStyles,
  collapsibleChevronOpenStyles,
  collapsibleChevronStyles,
  collapsibleContentStyles,
  collapsibleSectionStyles,
  collapsibleToggleStyles,
  copyIssueButtonStyles,
  fixActionsStyles,
  fixDescStyles,
  fixHeaderStyles,
  fixSectionStyles,
  fixSectionTitleStyles,
  fixTextStyles,
  fixTitleStyles,
  fixViewStyles,
  learnMoreLinkStyles,
  severityBadgeStyles,
  severityCriticalStyles,
  severityMinorStyles,
  severityModerateStyles,
  severitySeriousStyles,
} from './panel-styles-content';

type FixViewProps = {
  issue: MappedIssue;
  currentElement: FocusedElementInfo | null;
};

export function FixView({ issue, currentElement }: FixViewProps) {
  const [copied, setCopied] = useState(false);
  const [showHowToFix, setShowHowToFix] = useState(false);
  const [showCodeExample, setShowCodeExample] = useState(false);
  const [showCommonMistakes, setShowCommonMistakes] = useState(false);
  const [showVoiceOver, setShowVoiceOver] = useState(false);
  const guidance = issue.guidance;

  const copyIssueAsMarkdown = useCallback(() => {
    const severity = getSeverityLabel(issue.severity);
    const selector = currentElement?.selector ?? 'Unknown';
    const role = currentElement?.role ?? 'Unknown';
    const name = currentElement?.name || '(empty)';

    const fixSteps = guidance?.fix
      ? guidance.fix
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => `- ${line.replace(/^[-•*]\s*/, '')}`)
          .join('\n')
      : `See: ${issue.learnMoreUrl}`;

    const markdown = `## ${issue.title}

**Severity:** ${severity}

### Element
- **Selector:** \`${selector}\`
- **Role:** ${role}
- **Accessible name:** ${name}

### How to fix
${fixSteps}

### Learn more
${issue.learnMoreUrl}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [issue, currentElement, guidance]);

  const voGuide = getVoiceOverGuide(issue);

  if (!guidance) {
    return (
      <div className={fixViewStyles}>
        <h3 className={fixTitleStyles}>{issue.title}</h3>
        <p className={fixDescStyles}>{issue.axeDescription}</p>
        <a
          href={issue.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={learnMoreLinkStyles}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={-1}
        >
          Learn more on Deque
          <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  return (
    <div className={fixViewStyles}>
      <div className={fixHeaderStyles}>
        <span className={cx(severityBadgeStyles, getSeverityBadgeClass(issue.severity))}>
          {getSeverityLabel(issue.severity)}
        </span>
        <h3 className={fixTitleStyles}>{issue.title}</h3>
      </div>

      <section className={fixSectionStyles}>
        <h4 className={fixSectionTitleStyles}>Why it matters</h4>
        <p className={fixTextStyles}>{guidance.why}</p>
      </section>

      {issue.id === 'aria-required-parent' && currentElement?.role && (
        <ContextSpecificGuidance role={currentElement.role} />
      )}

      {guidance.fix && (
        <div className={collapsibleSectionStyles}>
          <div
            className={collapsibleToggleStyles}
            onClick={(e) => {
              e.stopPropagation();
              setShowHowToFix((p) => !p);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronDown
              size={12}
              className={cx(collapsibleChevronStyles, showHowToFix && collapsibleChevronOpenStyles)}
            />
            <span>How to fix</span>
          </div>
          {showHowToFix && (
            <div className={collapsibleContentStyles}>
              <p className={fixTextStyles}>{guidance.fix}</p>
            </div>
          )}
        </div>
      )}

      {guidance.codeExample && (
        <div className={collapsibleSectionStyles}>
          <div
            className={collapsibleToggleStyles}
            onClick={(e) => {
              e.stopPropagation();
              setShowCodeExample((p) => !p);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronDown
              size={12}
              className={cx(collapsibleChevronStyles, showCodeExample && collapsibleChevronOpenStyles)}
            />
            <span>Code example</span>
          </div>
          {showCodeExample && (
            <pre className={codeBlockStyles}>
              <code>{guidance.codeExample}</code>
            </pre>
          )}
        </div>
      )}

      {guidance.commonMistakes && guidance.commonMistakes.length > 0 && (
        <div className={collapsibleSectionStyles}>
          <div
            className={collapsibleToggleStyles}
            onClick={(e) => {
              e.stopPropagation();
              setShowCommonMistakes((p) => !p);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronDown
              size={12}
              className={cx(collapsibleChevronStyles, showCommonMistakes && collapsibleChevronOpenStyles)}
            />
            <span>Common mistakes</span>
          </div>
          {showCommonMistakes && (
            <ul className={avoidListStyles}>
              {guidance.commonMistakes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {voGuide && (
        <div className={collapsibleSectionStyles}>
          <div
            className={collapsibleToggleStyles}
            onClick={(e) => {
              e.stopPropagation();
              setShowVoiceOver((p) => !p);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronDown
              size={12}
              className={cx(collapsibleChevronStyles, showVoiceOver && collapsibleChevronOpenStyles)}
            />
            <Lightbulb size={12} />
            <span>Test with VoiceOver</span>
          </div>
          {showVoiceOver && <InlineVoiceOverGuide guide={voGuide} />}
        </div>
      )}

      <div className={fixActionsStyles}>
        <a
          href={issue.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={learnMoreLinkStyles}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={-1}
        >
          Learn more
          <ExternalLink size={12} />
        </a>
        <button
          className={copyIssueButtonStyles}
          onClick={copyIssueAsMarkdown}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={-1}
        >
          <ClipboardCopy size={12} />
          <span>{copied ? 'Copied!' : 'Copy issue'}</span>
        </button>
      </div>
    </div>
  );
}

function getSeverityBadgeClass(severity: MappedIssue['severity']): string {
  switch (severity) {
    case 'critical':
      return severityCriticalStyles;
    case 'serious':
      return severitySeriousStyles;
    case 'moderate':
      return severityModerateStyles;
    default:
      return severityMinorStyles;
  }
}
