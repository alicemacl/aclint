import { css } from 'styled-system/css';
// Main view
export const mainViewStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

// Announcement - PRIMARY FOCUS
export const announcementBoxStyles = css({
  backgroundColor: 'blue.900/30',
  borderRadius: 'md',
  padding: '12px',
  border: '1px solid',
  borderColor: 'blue.800/50',
});

export const announcementHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '6px',
});

export const announcementTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'blue.300',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const iconButtonStyles = css({
  padding: '2px',
  borderRadius: 'sm',
  color: 'gray.500',
  cursor: 'pointer',
  _hover: { color: 'white', backgroundColor: 'gray.700' },
});

export const announcementTextStyles = css({
  fontSize: '14px',
  color: 'blue.100',
  lineHeight: '1.4',
  fontStyle: 'italic',
});

export const voHintStyles = css({
  fontSize: '10px',
  color: 'blue.400/80',
  marginTop: '6px',
  lineHeight: '1.3',
});

export const voBreakdownListStyles = css({
  margin: '8px 0 0 0',
  paddingLeft: '16px',
  fontSize: '11px',
  color: 'gray.300',
  lineHeight: '1.45',
});

export const voBreakdownItemStyles = css({
  marginBottom: '4px',
});

export const voBreakdownLabelStyles = css({
  display: 'block',
  fontSize: '9px',
  fontWeight: 'semibold',
  color: 'gray.500',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const voBreakdownTextStyles = css({
  color: 'gray.200',
});

export const patternSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const subsectionTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const subsectionHintStyles = css({
  fontSize: '10px',
  color: 'gray.500',
  lineHeight: '1.3',
  marginTop: '-2px',
});

export const ownershipWarningStyles = css({
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
export const elementSectionStyles = css({
  backgroundColor: 'gray.800/50',
  borderRadius: 'md',
  padding: '10px',
});

export const elementHeaderStyles = css({
  marginBottom: '8px',
});

export const sectionTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const elementRowStyles = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginBottom: '4px',
});

export const elementLabelStyles = css({
  fontSize: '11px',
  color: 'gray.500',
  minWidth: '50px',
});

export const roleValueStyles = css({
  fontSize: '12px',
  color: 'white',
  fontWeight: 'semibold',
});

export const nameValueStyles = css({
  fontSize: '12px',
  color: 'gray.200',
});

export const positionValueStyles = css({
  fontSize: '12px',
  color: 'gray.300',
});

export const contextStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

export const contextTagStyles = css({
  fontSize: '11px',
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'sm',
  color: 'gray.300',
});

export const contextNameStyles = css({
  color: 'gray.400',
  fontStyle: 'italic',
});

export const statesStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

export const stateTagStyles = css({
  fontSize: '10px',
  backgroundColor: 'yellow.900/50',
  color: 'yellow.200',
  padding: '2px 6px',
  borderRadius: 'sm',
});

export const selectorRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
  paddingTop: '6px',
  borderTop: '1px solid',
  borderColor: 'gray.700',
});

export const selectorStyles = css({
  flex: 1,
  fontSize: '10px',
  color: 'gray.400',
  fontFamily: 'monospace',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const inspectButtonStyles = css({
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
export const snippetHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '4px',
});

export const snippetToggleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 0',
  fontSize: '10px',
  color: 'gray.500',
  cursor: 'pointer',
  _hover: { color: 'gray.300' },
});

export const snippetCopyButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  color: 'gray.500',
  borderRadius: 'sm',
  cursor: 'pointer',
  _hover: { color: 'white', backgroundColor: 'gray.700' },
});

export const snippetChevronStyles = css({
  transition: 'transform 0.15s',
});

export const snippetChevronOpenStyles = css({
  transform: 'rotate(180deg)',
});

export const snippetCodeStyles = css({
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
export const checkingStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 10px',
  fontSize: '11px',
  color: 'gray.400',
});

export const spinnerStyles = css({
  animation: 'spin 1s linear infinite',
});

// No issues
export const noIssuesStyles = css({
  padding: '8px 10px',
  fontSize: '11px',
  color: 'green.400',
  backgroundColor: 'green.900/20',
  borderRadius: 'md',
  textAlign: 'center',
});

// Issues section
export const issuesSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const issueCardStyles = css({
  padding: '8px 10px',
  borderRadius: 'md',
  border: '1px solid',
});

export const issueCardCriticalStyles = css({
  backgroundColor: 'red.900/20',
  borderColor: 'red.800',
});

export const issueCardSeriousStyles = css({
  backgroundColor: 'orange.900/20',
  borderColor: 'orange.800',
});

export const issueCardModerateStyles = css({
  backgroundColor: 'yellow.900/20',
  borderColor: 'yellow.800',
});

export const issueCardMinorStyles = css({
  backgroundColor: 'gray.800/50',
  borderColor: 'gray.700',
});

export const issueCardHeaderStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6px',
  marginBottom: '6px',
  '& svg': {
    flexShrink: 0,
    marginTop: '2px',
  },
});

export const issueCardTitleStyles = css({
  fontSize: '12px',
  fontWeight: 'medium',
  color: 'white',
  lineHeight: '1.3',
});

export const sourceBadgeStyles = css({
  fontSize: '9px',
  fontWeight: 'bold',
  padding: '1px 4px',
  borderRadius: 'sm',
  backgroundColor: 'gray.700',
  color: 'gray.400',
  flexShrink: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const sourceBadgeAccessLintStyles = css({
  backgroundColor: 'purple.900/60',
  color: 'purple.300',
});

export const sourceBadgePatternStyles = css({
  backgroundColor: 'teal.900/60',
  color: 'teal.300',
});

export const issueCardFooterStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const howToFixButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'blue.400',
  cursor: 'pointer',
  _hover: { color: 'blue.300' },
});

export const learnMoreStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'gray.400',
  textDecoration: 'none',
  _hover: { color: 'gray.300' },
});

// Navigation
export const navSectionStyles = css({
  display: 'flex',
  gap: '6px',
  paddingTop: '6px',
  borderTop: '1px solid',
  borderColor: 'gray.800',
});

export const navButtonStyles = css({
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

export const navButtonDisabledStyles = css({
  opacity: 0.4,
  cursor: 'not-allowed',
  _hover: { backgroundColor: 'gray.800' },
});

export const navButtonTextStyles = css({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const navButtonLabelStyles = css({
  fontSize: '10px',
  color: 'gray.500',
});

export const navButtonRoleStyles = css({
  fontSize: '11px',
  fontWeight: 'medium',
});

// Empty state
export const emptyStateStyles = css({
  textAlign: 'center',
  padding: '20px',
  color: 'gray.400',
});

export const hintStyles = css({
  marginTop: '8px',
  fontSize: '12px',
});

export const kbdStyles = css({
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'sm',
  fontSize: '11px',
  fontFamily: 'monospace',
});

// Fix view
export const fixViewStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const fixHeaderStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
});

export const severityBadgeStyles = css({
  padding: '2px 6px',
  borderRadius: 'sm',
  fontSize: '10px',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
  flexShrink: 0,
});

export const severityCriticalStyles = css({
  backgroundColor: 'red.900',
  color: 'red.200',
});

export const severitySeriousStyles = css({
  backgroundColor: 'orange.900',
  color: 'orange.200',
});

export const severityModerateStyles = css({
  backgroundColor: 'yellow.900',
  color: 'yellow.200',
});

export const severityMinorStyles = css({
  backgroundColor: 'gray.700',
  color: 'gray.300',
});

export const fixTitleStyles = css({
  fontSize: '14px',
  fontWeight: 'semibold',
  color: 'white',
  lineHeight: '1.3',
});

export const fixDescStyles = css({
  fontSize: '12px',
  color: 'gray.300',
  lineHeight: '1.5',
});

export const fixSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const fixSectionTitleStyles = css({
  fontSize: '11px',
  fontWeight: 'semibold',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const fixTextStyles = css({
  fontSize: '12px',
  color: 'gray.200',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap',
});

export const codeBlockStyles = css({
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

export const avoidListStyles = css({
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
export const contextGuidanceStyles = css({
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
export const collapsibleSectionStyles = css({
  borderTop: '1px solid',
  borderColor: 'gray.700',
  paddingTop: '6px',
  marginTop: '6px',
});

export const collapsibleToggleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 0',
  fontSize: '11px',
  color: 'gray.400',
  cursor: 'pointer',
  _hover: { color: 'gray.200' },
});

export const collapsibleChevronStyles = css({
  transition: 'transform 0.15s',
});

export const collapsibleChevronOpenStyles = css({
  transform: 'rotate(180deg)',
});

export const collapsibleContentStyles = css({
  paddingTop: '6px',
});

// Inline VoiceOver guide
export const inlineVoGuideStyles = css({
  padding: '10px',
  marginTop: '6px',
  backgroundColor: 'gray.800/50',
  borderRadius: 'md',
});

export const voGoalStyles = css({
  fontSize: '12px',
  color: 'gray.300',
  marginBottom: '8px',
});

export const voInlineStepsStyles = css({
  paddingLeft: '16px',
  fontSize: '12px',
  color: 'gray.300',
  lineHeight: '1.5',
  marginBottom: '8px',
  '& li': {
    marginBottom: '4px',
  },
});

export const voExpectInlineStyles = css({
  fontSize: '12px',
  color: 'gray.400',
  backgroundColor: 'gray.900/50',
  padding: '8px',
  borderRadius: 'sm',
});

export const voExpectLabelStyles = css({
  fontWeight: 'semibold',
  color: 'gray.300',
  marginRight: '4px',
});

export const learnMoreLinkStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: 'blue.400',
  textDecoration: 'none',
  _hover: { textDecoration: 'underline' },
});

export const fixActionsStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid',
  borderColor: 'gray.700',
});

export const copyIssueButtonStyles = css({
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
