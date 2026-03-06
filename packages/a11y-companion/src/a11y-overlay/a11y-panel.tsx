'use client';

/**
 * Simplified A11y Panel - Radically simple accessibility testing.
 * Shows what users experience, with progressive disclosure of fix guidance.
 */

import { useCallback, useEffect, useState } from 'react';

import { FloatingPanel } from '@ark-ui/react/floating-panel';
import { Menu } from '@ark-ui/react/menu';
import { Portal } from '@ark-ui/react/portal';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Copy,
  ExternalLink,
  Eye,
  GripVertical,
  Lightbulb,
  Loader2,
  Maximize2,
  Minus,
  Settings2,
  X,
} from 'lucide-react';

import { css, cx } from 'styled-system/css';

import { getRequiredParentGuidance, type VoiceOverTest } from './assistant-rules';
import type { VoiceOverGuide } from './fix-guidance';
import type { MappedIssue } from './map-violations';
import { getSeverityLabel, getVoiceOverGuide, sortBySeverity } from './map-violations';
import {
  applySimulations,
  cleanupSimulations,
  DEFAULT_SIMULATION_SETTINGS,
  type SimulationSettings,
} from './simulations';
import type { FocusedElementInfo, FocusTrackingResult } from './use-focus-tracking';

type Stage = 'default' | 'minimized';

type PanelView = 'main' | 'fix';

type A11yPanelProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  focusInfo: FocusTrackingResult;
  showHighlight: boolean;
  onToggleHighlight: () => void;
};

export function A11yPanel({
  isOpen,
  onOpenChange,
  focusInfo,
  showHighlight,
  onToggleHighlight,
}: A11yPanelProps) {
  const { current, prev, next, totalFocusable, currentIndex, issues, isChecking } = focusInfo;
  const [stage, setStage] = useState<Stage>('default');
  const [view, setView] = useState<PanelView>('main');
  const [selectedIssue, setSelectedIssue] = useState<MappedIssue | null>(null);
  const [simulations, setSimulations] = useState<SimulationSettings>(DEFAULT_SIMULATION_SETTINGS);
  const [showSnippet, setShowSnippet] = useState(false);

  // Apply simulations when settings change
  useEffect(() => {
    applySimulations(simulations);
    return () => cleanupSimulations();
  }, [simulations]);

  // Toggle individual simulation
  const toggleSimulation = useCallback((key: keyof SimulationSettings) => {
    setSimulations((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Count active simulations
  const activeSimCount = Object.values(simulations).filter(Boolean).length;

  // Sort issues by severity
  const sortedIssues = sortBySeverity(issues);

  const openFixView = (issue: MappedIssue) => {
    setSelectedIssue(issue);
    setView('fix');
  };

  const goBack = () => {
    setView('main');
    setSelectedIssue(null);
  };

  const copyAnnouncement = () => {
    if (current?.announcement) {
      navigator.clipboard.writeText(current.announcement);
    }
  };

  const inspectElement = () => {
    if (current?.element) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (win.inspect) {
        win.inspect(current.element);
      } else {
        // eslint-disable-next-line no-console
        console.log('[A11y Panel]', current.element);
      }
    }
  };

  const focusPrevElement = () => {
    if (prev?.element) {
      prev.element.focus();
    }
  };

  const focusNextElement = () => {
    if (next?.element) {
      next.element.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <FloatingPanel.Root
      open={isOpen}
      onOpenChange={(details) => onOpenChange(details.open)}
      onStageChange={(details) => setStage(details.stage as Stage)}
      defaultPosition={{ x: window.innerWidth - 400, y: 100 }}
      defaultSize={{ width: 360, height: 500 }}
      minSize={{ width: 300, height: 60 }}
      persistRect
      closeOnEscape={false}
    >
      <Portal>
        <FloatingPanel.Positioner className={positionerStyles}>
          <FloatingPanel.Content
            className={contentStyles}
            data-a11y-panel
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <FloatingPanel.Header className={headerStyles}>
              <FloatingPanel.DragTrigger
                className={dragTriggerStyles}
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
              >
                <FloatingPanel.Title className={titleStyles}>
                  {view === 'main' ? (
                    <>
                      <GripVertical size={14} />
                      <span>A11y</span>
                      <span className={badgeStyles}>{currentIndex}/{totalFocusable}</span>
                    </>
                  ) : (
                    <button
                      className={backButtonStyles}
                      onClick={goBack}
                      onMouseDown={(e) => e.preventDefault()}
                      tabIndex={-1}
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                  )}
                </FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control className={controlStyles}>
                <button
                  className={cx(controlButtonStyles, showHighlight && activeButtonStyles)}
                  onClick={onToggleHighlight}
                  onMouseDown={(e) => e.preventDefault()}
                  tabIndex={-1}
                  title="Toggle highlight"
                >
                  <span className={highlightIconStyles} />
                </button>
                {/* Simulations Menu */}
                <Menu.Root closeOnSelect={false}>
                  <Menu.Trigger asChild>
                    <button
                      className={cx(controlButtonStyles, activeSimCount > 0 && activeButtonStyles)}
                      onMouseDown={(e) => e.preventDefault()}
                      tabIndex={-1}
                      title="Simulations"
                    >
                      <Settings2 size={14} />
                      {activeSimCount > 0 && (
                        <span className={simBadgeStyles}>{activeSimCount}</span>
                      )}
                    </button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner className={simMenuPositionerStyles}>
                      <Menu.Content
                        className={simMenuStyles}
                        data-a11y-panel
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Menu.ItemGroup>
                          <Menu.ItemGroupLabel className={simMenuLabelStyles}>
                            Simulations
                          </Menu.ItemGroupLabel>
                          <Menu.Item
                            value="reducedMotion"
                            className={simMenuItemStyles}
                            onClick={() => toggleSimulation('reducedMotion')}
                          >
                            <span className={simCheckStyles}>
                              {simulations.reducedMotion && <Check size={12} />}
                            </span>
                            Reduced motion
                          </Menu.Item>
                          <Menu.Item
                            value="increasedTextSize"
                            className={simMenuItemStyles}
                            onClick={() => toggleSimulation('increasedTextSize')}
                          >
                            <span className={simCheckStyles}>
                              {simulations.increasedTextSize && <Check size={12} />}
                            </span>
                            Increased text (150%)
                          </Menu.Item>
                          <Menu.Item
                            value="forceFocusVisibility"
                            className={simMenuItemStyles}
                            onClick={() => toggleSimulation('forceFocusVisibility')}
                          >
                            <span className={simCheckStyles}>
                              {simulations.forceFocusVisibility && <Check size={12} />}
                            </span>
                            Force focus visibility
                          </Menu.Item>
                        </Menu.ItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                {stage === 'minimized' ? (
                  <FloatingPanel.StageTrigger
                    stage="default"
                    className={controlButtonStyles}
                    onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                    tabIndex={-1}
                    title="Expand"
                  >
                    <Maximize2 size={14} />
                  </FloatingPanel.StageTrigger>
                ) : (
                  <FloatingPanel.StageTrigger
                    stage="minimized"
                    className={controlButtonStyles}
                    onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                    tabIndex={-1}
                    title="Minimize"
                  >
                    <Minus size={14} />
                  </FloatingPanel.StageTrigger>
                )}
                <FloatingPanel.CloseTrigger
                  className={controlButtonStyles}
                  onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                  tabIndex={-1}
                  title="Close"
                >
                  <X size={14} />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>

            {/* Body */}
            {stage !== 'minimized' && (
              <FloatingPanel.Body className={bodyStyles}>
                {view === 'main' && (
                  <MainView
                    current={current}
                    prev={prev}
                    next={next}
                    issues={sortedIssues}
                    isChecking={isChecking}
                    showSnippet={showSnippet}
                    onToggleSnippet={() => setShowSnippet((p) => !p)}
                    onOpenFix={openFixView}
                    onCopyAnnouncement={copyAnnouncement}
                    onInspect={inspectElement}
                    onFocusPrev={focusPrevElement}
                    onFocusNext={focusNextElement}
                  />
                )}
                {view === 'fix' && selectedIssue && (
                  <FixView
                    issue={selectedIssue}
                    currentElement={current}
                  />
                )}
              </FloatingPanel.Body>
            )}

            {/* Resize handles */}
            {stage !== 'minimized' && (
              <>
                <FloatingPanel.ResizeTrigger axis="e" className={resizeTriggerStyles} />
                <FloatingPanel.ResizeTrigger axis="s" className={resizeTriggerStyles} />
                <FloatingPanel.ResizeTrigger axis="se" className={resizeCornerStyles} />
              </>
            )}
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}

// ============================================================================
// Main View
// ============================================================================

type MainViewProps = {
  current: FocusedElementInfo | null;
  prev: FocusedElementInfo | null;
  next: FocusedElementInfo | null;
  issues: MappedIssue[];
  isChecking: boolean;
  showSnippet: boolean;
  onToggleSnippet: () => void;
  onOpenFix: (issue: MappedIssue) => void;
  onCopyAnnouncement: () => void;
  onInspect: () => void;
  onFocusPrev: () => void;
  onFocusNext: () => void;
};

function MainView({
  current,
  prev,
  next,
  issues,
  isChecking,
  showSnippet,
  onToggleSnippet,
  onOpenFix,
  onCopyAnnouncement,
  onInspect,
  onFocusPrev,
  onFocusNext,
}: MainViewProps) {
  if (!current) {
    return (
      <div className={emptyStateStyles}>
        <p>No element focused</p>
        <p className={hintStyles}>Press <kbd className={kbdStyles}>Tab</kbd> to navigate</p>
      </div>
    );
  }

  return (
    <div className={mainViewStyles}>
      {/* Screen reader announcement - PRIMARY FOCUS */}
      <div className={announcementBoxStyles}>
        <div className={announcementHeaderStyles}>
          <span className={announcementTitleStyles}>Screen reader says</span>
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
        {/* Ownership warning */}
        {current.ownershipIssue && (
          <div className={ownershipWarningStyles}>
            <AlertTriangle size={12} />
            <span>{current.ownershipIssue}</span>
          </div>
        )}
      </div>

      {/* Element section */}
      <div className={elementSectionStyles}>
        <div className={elementHeaderStyles}>
          <span className={sectionTitleStyles}>Element</span>
        </div>

        {/* Role */}
        <div className={elementRowStyles}>
          <span className={elementLabelStyles}>Role</span>
          <span className={roleValueStyles}>{current.role}</span>
        </div>

        {/* Name */}
        <div className={elementRowStyles}>
          <span className={elementLabelStyles}>Name</span>
          <span className={nameValueStyles}>{current.name || '(empty)'}</span>
        </div>

        {/* Position in set */}
        {current.positionInSet && (
          <div className={elementRowStyles}>
            <span className={elementLabelStyles}>Position</span>
            <span className={positionValueStyles}>
              {current.positionInSet.current} of {current.positionInSet.total}
            </span>
          </div>
        )}

        {/* Context */}
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

        {/* States (if any) */}
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

        {/* Selector + Inspect */}
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

        {/* HTML Snippet Toggle */}
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

        {/* HTML Snippet */}
        {showSnippet && (
          <pre className={snippetCodeStyles}>
            <code>{current.snippet}</code>
          </pre>
        )}
      </div>

      {/* Issues */}
      {isChecking && (
        <div className={checkingStyles}>
          <Loader2 size={14} className={spinnerStyles} />
          <span>Checking...</span>
        </div>
      )}

      {!isChecking && issues.length > 0 && (
        <div className={issuesSectionStyles}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onOpenFix={onOpenFix} />
          ))}
        </div>
      )}

      {!isChecking && issues.length === 0 && (
        <div className={noIssuesStyles}>
          <span>No issues found</span>
        </div>
      )}

      {/* Navigation */}
      <div className={navSectionStyles}>
        <NavButton direction="prev" info={prev} onClick={onFocusPrev} />
        <NavButton direction="next" info={next} onClick={onFocusNext} />
      </div>
    </div>
  );
}

// ============================================================================
// Issue Card
// ============================================================================

type IssueCardProps = {
  issue: MappedIssue;
  onOpenFix: (issue: MappedIssue) => void;
};

function IssueCard({ issue, onOpenFix }: IssueCardProps) {
  return (
    <div className={cx(issueCardStyles, getSeverityClass(issue.severity))}>
      <div className={issueCardHeaderStyles}>
        <AlertTriangle size={14} />
        <span className={issueCardTitleStyles}>{issue.title}</span>
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

// ============================================================================
// Fix View
// ============================================================================

type FixViewProps = {
  issue: MappedIssue;
  currentElement: FocusedElementInfo | null;
};

function FixView({ issue, currentElement }: FixViewProps) {
  const [copied, setCopied] = useState(false);
  const [showHowToFix, setShowHowToFix] = useState(false);
  const [showCodeExample, setShowCodeExample] = useState(false);
  const [showCommonMistakes, setShowCommonMistakes] = useState(false);
  const [showVoiceOver, setShowVoiceOver] = useState(false);
  const guidance = issue.guidance;

  // Copy issue as markdown
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

  // Get VoiceOver guide (handles both new and legacy formats)
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
      {/* Title */}
      <div className={fixHeaderStyles}>
        <span className={cx(severityBadgeStyles, getSeverityBadgeClass(issue.severity))}>
          {getSeverityLabel(issue.severity)}
        </span>
        <h3 className={fixTitleStyles}>{issue.title}</h3>
      </div>

      {/* Why it matters - always visible */}
      <section className={fixSectionStyles}>
        <h4 className={fixSectionTitleStyles}>Why it matters</h4>
        <p className={fixTextStyles}>{guidance.why}</p>
      </section>

      {/* Context-specific guidance for aria-required-parent */}
      {issue.id === 'aria-required-parent' && currentElement?.role && (
        <ContextSpecificGuidance role={currentElement.role} />
      )}

      {/* How to fix - collapsible */}
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

      {/* Code example - collapsible */}
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

      {/* Common mistakes - collapsible */}
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

      {/* VoiceOver testing - collapsible */}
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

      {/* Actions */}
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

/**
 * Context-specific guidance for aria-required-parent based on element role.
 */
function ContextSpecificGuidance({ role }: { role: string }) {
  const guidance = getRequiredParentGuidance(role);

  if (!guidance) {
    return null;
  }

  return (
    <div className={contextGuidanceStyles}>
      <AlertTriangle size={14} />
      <span>{guidance}</span>
    </div>
  );
}

/**
 * Inline VoiceOver guide that works with both new and legacy formats.
 */
function InlineVoiceOverGuide({ guide }: { guide: VoiceOverTest | VoiceOverGuide }) {
  // Determine if this is the new format (has expectedOutput) or legacy (has expect)
  const isNewFormat = 'expectedOutput' in guide;

  const goal = isNewFormat ? (guide as VoiceOverTest).goal : (guide as VoiceOverGuide).goal;
  const steps = isNewFormat ? (guide as VoiceOverTest).steps : (guide as VoiceOverGuide).steps;
  const expectedOutput = isNewFormat
    ? (guide as VoiceOverTest).expectedOutput
    : (guide as VoiceOverGuide).expect;

  return (
    <div className={inlineVoGuideStyles}>
      <p className={voGoalStyles}>{goal}</p>
      <ol className={voInlineStepsStyles}>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div className={voExpectInlineStyles}>
        <span className={voExpectLabelStyles}>You should hear:</span>
        <span>{expectedOutput}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Navigation Button
// ============================================================================

type NavButtonProps = {
  direction: 'prev' | 'next';
  info: FocusedElementInfo | null;
  onClick: () => void;
};

function NavButton({ direction, info, onClick }: NavButtonProps) {
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

// ============================================================================
// Styles
// ============================================================================

const positionerStyles = css({
  position: 'fixed!',
  zIndex: 9999,
});

const contentStyles = css({
  backgroundColor: 'gray.900',
  borderRadius: 'lg',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  border: '1px solid',
  borderColor: 'gray.700',
  display: 'flex',
  flexDirection: 'column',
  color: 'gray.100',
  fontSize: '13px',
  fontFamily: 'sans-serif',
  overflow: 'hidden',
});

const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  backgroundColor: 'gray.800',
  borderBottom: '1px solid',
  borderColor: 'gray.700',
});

const dragTriggerStyles = css({
  cursor: 'grab',
  _active: { cursor: 'grabbing' },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: 'semibold',
  fontSize: '13px',
});

const badgeStyles = css({
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'full',
  fontSize: '10px',
  fontWeight: 'normal',
  color: 'gray.400',
});

const backButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: 'gray.300',
  cursor: 'pointer',
  _hover: { color: 'white' },
});

const controlStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

const controlButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: 'sm',
  color: 'gray.400',
  cursor: 'pointer',
  transition: 'all 0.15s',
  position: 'relative',
  _hover: { backgroundColor: 'gray.700', color: 'white' },
});

const activeButtonStyles = css({
  backgroundColor: 'blue.600!',
  color: 'white!',
});

const highlightIconStyles = css({
  width: '10px',
  height: '10px',
  border: '2px solid currentColor',
  borderRadius: 'sm',
});

// Simulations menu
const simBadgeStyles = css({
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  width: '12px',
  height: '12px',
  backgroundColor: 'blue.500',
  color: 'white',
  borderRadius: 'full',
  fontSize: '9px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const simMenuPositionerStyles = css({
  zIndex: 10001,
});

const simMenuStyles = css({
  backgroundColor: 'gray.800',
  borderRadius: 'md',
  padding: '4px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  minWidth: '180px',
});

const simMenuLabelStyles = css({
  padding: '6px 10px',
  fontSize: '10px',
  fontWeight: 'semibold',
  color: 'gray.500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const simMenuItemStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 10px',
  fontSize: '12px',
  color: 'gray.300',
  borderRadius: 'sm',
  cursor: 'pointer',
  _hover: { backgroundColor: 'gray.700', color: 'white' },
});

const simCheckStyles = css({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'green.400',
});

const bodyStyles = css({
  padding: '10px',
  /* maxHeight: '360px', */
  overflowY: 'auto',
});

// Main view
const mainViewStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

// Announcement - PRIMARY FOCUS
const announcementBoxStyles = css({
  backgroundColor: 'blue.900/30',
  borderRadius: 'md',
  padding: '12px',
  border: '1px solid',
  borderColor: 'blue.800/50',
});

const announcementHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '6px',
});

const announcementTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'blue.300',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const iconButtonStyles = css({
  padding: '2px',
  borderRadius: 'sm',
  color: 'gray.500',
  cursor: 'pointer',
  _hover: { color: 'white', backgroundColor: 'gray.700' },
});

const announcementTextStyles = css({
  fontSize: '14px',
  color: 'blue.100',
  lineHeight: '1.4',
  fontStyle: 'italic',
});

const ownershipWarningStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6px',
  marginTop: '8px',
  padding: '6px 8px',
  backgroundColor: 'yellow.900/30',
  border: '1px solid',
  borderColor: 'yellow.700/50',
  borderRadius: 'sm',
  fontSize: '11px',
  color: 'yellow.200',
  lineHeight: '1.3',
  '& svg': {
    flexShrink: 0,
    marginTop: '1px',
  },
});

// Element section
const elementSectionStyles = css({
  backgroundColor: 'gray.800/50',
  borderRadius: 'md',
  padding: '10px',
});

const elementHeaderStyles = css({
  marginBottom: '8px',
});

const sectionTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const elementRowStyles = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginBottom: '4px',
});

const elementLabelStyles = css({
  fontSize: '11px',
  color: 'gray.500',
  minWidth: '50px',
});

const roleValueStyles = css({
  fontSize: '12px',
  color: 'white',
  fontWeight: 'semibold',
});

const nameValueStyles = css({
  fontSize: '12px',
  color: 'gray.200',
});

const positionValueStyles = css({
  fontSize: '12px',
  color: 'gray.300',
});

const contextStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

const contextTagStyles = css({
  fontSize: '11px',
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'sm',
  color: 'gray.300',
});

const contextNameStyles = css({
  color: 'gray.400',
  fontStyle: 'italic',
});

const statesStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

const stateTagStyles = css({
  fontSize: '10px',
  backgroundColor: 'yellow.900/50',
  color: 'yellow.200',
  padding: '2px 6px',
  borderRadius: 'sm',
});

const selectorRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
  paddingTop: '6px',
  borderTop: '1px solid',
  borderColor: 'gray.700',
});

const selectorStyles = css({
  flex: 1,
  fontSize: '10px',
  color: 'gray.400',
  fontFamily: 'monospace',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const inspectButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: 'gray.700',
  color: 'gray.300',
  borderRadius: 'sm',
  fontSize: '10px',
  cursor: 'pointer',
  flexShrink: 0,
  _hover: { backgroundColor: 'gray.600', color: 'white' },
});

// HTML Snippet
const snippetHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '4px',
});

const snippetToggleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 0',
  fontSize: '10px',
  color: 'gray.500',
  cursor: 'pointer',
  _hover: { color: 'gray.300' },
});

const snippetCopyButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  color: 'gray.500',
  borderRadius: 'sm',
  cursor: 'pointer',
  _hover: { color: 'white', backgroundColor: 'gray.700' },
});

const snippetChevronStyles = css({
  transition: 'transform 0.15s',
});

const snippetChevronOpenStyles = css({
  transform: 'rotate(180deg)',
});

const snippetCodeStyles = css({
  padding: '8px',
  backgroundColor: 'gray.900',
  borderRadius: 'sm',
  fontSize: '10px',
  fontFamily: 'monospace',
  color: 'gray.400',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  maxHeight: '80px',
  lineHeight: '1.4',
});

// Checking state
const checkingStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 10px',
  fontSize: '11px',
  color: 'gray.400',
});

const spinnerStyles = css({
  animation: 'spin 1s linear infinite',
});

// No issues
const noIssuesStyles = css({
  padding: '8px 10px',
  fontSize: '11px',
  color: 'green.400',
  backgroundColor: 'green.900/20',
  borderRadius: 'md',
  textAlign: 'center',
});

// Issues section
const issuesSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const issueCardStyles = css({
  padding: '8px 10px',
  borderRadius: 'md',
  border: '1px solid',
});

const issueCardCriticalStyles = css({
  backgroundColor: 'red.900/20',
  borderColor: 'red.800',
});

const issueCardSeriousStyles = css({
  backgroundColor: 'orange.900/20',
  borderColor: 'orange.800',
});

const issueCardModerateStyles = css({
  backgroundColor: 'yellow.900/20',
  borderColor: 'yellow.800',
});

const issueCardMinorStyles = css({
  backgroundColor: 'gray.800/50',
  borderColor: 'gray.700',
});

const issueCardHeaderStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6px',
  marginBottom: '6px',
  '& svg': {
    flexShrink: 0,
    marginTop: '2px',
  },
});

const issueCardTitleStyles = css({
  fontSize: '12px',
  fontWeight: 'medium',
  color: 'white',
  lineHeight: '1.3',
});

const issueCardFooterStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

const howToFixButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'blue.400',
  cursor: 'pointer',
  _hover: { color: 'blue.300' },
});

const learnMoreStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'gray.400',
  textDecoration: 'none',
  _hover: { color: 'gray.300' },
});

// Navigation
const navSectionStyles = css({
  display: 'flex',
  gap: '6px',
  paddingTop: '6px',
  borderTop: '1px solid',
  borderColor: 'gray.800',
});

const navButtonStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 8px',
  backgroundColor: 'gray.800',
  borderRadius: 'md',
  color: 'gray.300',
  cursor: 'pointer',
  _hover: { backgroundColor: 'gray.700' },
});

const navButtonDisabledStyles = css({
  opacity: 0.4,
  cursor: 'not-allowed',
  _hover: { backgroundColor: 'gray.800' },
});

const navButtonTextStyles = css({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

const navButtonLabelStyles = css({
  fontSize: '10px',
  color: 'gray.500',
});

const navButtonRoleStyles = css({
  fontSize: '11px',
  fontWeight: 'medium',
});

// Empty state
const emptyStateStyles = css({
  textAlign: 'center',
  padding: '20px',
  color: 'gray.400',
});

const hintStyles = css({
  marginTop: '8px',
  fontSize: '12px',
});

const kbdStyles = css({
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'sm',
  fontSize: '11px',
  fontFamily: 'monospace',
});

// Fix view
const fixViewStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const fixHeaderStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
});

const severityBadgeStyles = css({
  padding: '2px 6px',
  borderRadius: 'sm',
  fontSize: '10px',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
  flexShrink: 0,
});

const severityCriticalStyles = css({
  backgroundColor: 'red.900',
  color: 'red.200',
});

const severitySeriousStyles = css({
  backgroundColor: 'orange.900',
  color: 'orange.200',
});

const severityModerateStyles = css({
  backgroundColor: 'yellow.900',
  color: 'yellow.200',
});

const severityMinorStyles = css({
  backgroundColor: 'gray.700',
  color: 'gray.300',
});

const fixTitleStyles = css({
  fontSize: '14px',
  fontWeight: 'semibold',
  color: 'white',
  lineHeight: '1.3',
});

const fixDescStyles = css({
  fontSize: '12px',
  color: 'gray.300',
  lineHeight: '1.5',
});

const fixSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const fixSectionTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const fixTextStyles = css({
  fontSize: '12px',
  color: 'gray.200',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap',
});

const codeBlockStyles = css({
  padding: '10px',
  backgroundColor: 'gray.900',
  borderRadius: 'md',
  fontSize: '11px',
  fontFamily: 'monospace',
  color: 'gray.300',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.4',
  marginTop: '6px',
});

const avoidListStyles = css({
  paddingLeft: '16px',
  fontSize: '12px',
  color: 'gray.300',
  lineHeight: '1.5',
  marginTop: '6px',
  '& li': {
    marginBottom: '4px',
  },
});

// Context-specific guidance highlight
const contextGuidanceStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '10px',
  backgroundColor: 'yellow.900/20',
  border: '1px solid',
  borderColor: 'yellow.700/50',
  borderRadius: 'md',
  fontSize: '12px',
  color: 'yellow.200',
  marginBottom: '8px',
  '& svg': {
    flexShrink: 0,
    marginTop: '2px',
  },
});

// Collapsible sections (like HTML snippet toggle)
const collapsibleSectionStyles = css({
  borderTop: '1px solid',
  borderColor: 'gray.700',
  paddingTop: '6px',
  marginTop: '6px',
});

const collapsibleToggleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 0',
  fontSize: '11px',
  color: 'gray.400',
  cursor: 'pointer',
  _hover: { color: 'gray.200' },
});

const collapsibleChevronStyles = css({
  transition: 'transform 0.15s',
});

const collapsibleChevronOpenStyles = css({
  transform: 'rotate(180deg)',
});

const collapsibleContentStyles = css({
  paddingTop: '6px',
});

// Inline VoiceOver guide
const inlineVoGuideStyles = css({
  padding: '10px',
  marginTop: '6px',
  backgroundColor: 'gray.800/50',
  borderRadius: 'md',
});

const voGoalStyles = css({
  fontSize: '12px',
  color: 'gray.300',
  marginBottom: '8px',
});

const voInlineStepsStyles = css({
  paddingLeft: '16px',
  fontSize: '12px',
  color: 'gray.300',
  lineHeight: '1.5',
  marginBottom: '8px',
  '& li': {
    marginBottom: '4px',
  },
});

const voExpectInlineStyles = css({
  fontSize: '12px',
  color: 'gray.400',
  backgroundColor: 'gray.900/50',
  padding: '8px',
  borderRadius: 'sm',
});

const voExpectLabelStyles = css({
  fontWeight: 'semibold',
  color: 'gray.300',
  marginRight: '4px',
});

const learnMoreLinkStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'blue.400',
  textDecoration: 'none',
  _hover: { textDecoration: 'underline' },
});

const fixActionsStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid',
  borderColor: 'gray.700',
});

const copyIssueButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: 'gray.700',
  color: 'gray.300',
  borderRadius: 'sm',
  fontSize: '11px',
  cursor: 'pointer',
  _hover: { backgroundColor: 'gray.600', color: 'white' },
});

// Resize handles
const resizeTriggerStyles = css({
  position: 'absolute',
  backgroundColor: 'transparent',
  '&[data-axis="e"]': {
    right: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'ew-resize',
  },
  '&[data-axis="s"]': {
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    cursor: 'ns-resize',
  },
});

const resizeCornerStyles = css({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '12px',
  height: '12px',
  cursor: 'se-resize',
});
