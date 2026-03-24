'use client'

/**
 * Simplified A11y Panel - Radically simple accessibility testing.
 * Shows what users experience, with progressive disclosure of fix guidance.
 */

import type { MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { FloatingPanel } from '@ark-ui/react/floating-panel'
import { Menu } from '@ark-ui/react/menu'
import { Portal } from '@ark-ui/react/portal'
import { ArrowLeft, Check, GripVertical, Maximize2, Minus, Settings2, X } from 'lucide-react'
import { cx } from 'styled-system/css'

import type { MappedIssue } from '../map-violations'
import { sortBySeverity } from '../map-violations'
import {
  applySimulations,
  cleanupSimulations,
  DEFAULT_SIMULATION_SETTINGS,
  type SimulationSettings,
} from '../simulations'
import { useVoPlatform } from '../vo-platform'
import { FixView } from './panel-fix-view'
import { MainView } from './panel-main-view'
import {
  activeButtonStyles,
  backButtonStyles,
  badgeStyles,
  bodyStyles,
  contentStyles,
  controlButtonStyles,
  controlStyles,
  dragTriggerStyles,
  headerStyles,
  highlightIconStyles,
  platformActiveSegmentStyles,
  platformInactiveSegmentStyles,
  platformToggleStyles,
  positionerStyles,
  resizeCornerStyles,
  resizeTriggerStyles,
  simBadgeStyles,
  simCheckStyles,
  simMenuItemStyles,
  simMenuLabelStyles,
  simMenuPositionerStyles,
  simMenuStyles,
  titleStyles,
} from './panel-styles-shell'
import type { A11yPanelProps, PanelView, Stage } from './panel-types'

export function A11yPanel({
  isOpen,
  onOpenChange,
  focusInfo,
  showHighlight,
  onToggleHighlight,
  portalContainerRef,
}: A11yPanelProps) {
  const { current, prev, next, totalFocusable, currentIndex, issues, isChecking } = focusInfo
  const { platform, togglePlatform } = useVoPlatform()
  const [stage, setStage] = useState<Stage>('default')
  const [view, setView] = useState<PanelView>('main')
  const [selectedIssue, setSelectedIssue] = useState<MappedIssue | null>(null)
  const [simulations, setSimulations] = useState<SimulationSettings>(DEFAULT_SIMULATION_SETTINGS)
  const [showSnippet, setShowSnippet] = useState(false)

  useEffect(() => {
    applySimulations(simulations)
    return () => cleanupSimulations()
  }, [simulations])

  const toggleSimulation = useCallback((key: keyof SimulationSettings) => {
    setSimulations((prevSim) => ({ ...prevSim, [key]: !prevSim[key] }))
  }, [])

  const activeSimCount = Object.values(simulations).filter(Boolean).length

  const patternIssues = issues.filter((i) => i.source === 'pattern')
  const wcagIssues = issues.filter((i) => i.source !== 'pattern')
  const sortedPatternIssues = sortBySeverity(patternIssues)
  const sortedWcagIssues = sortBySeverity(wcagIssues)

  const openFixView = (issue: MappedIssue) => {
    setSelectedIssue(issue)
    setView('fix')
  }

  const goBack = () => {
    setView('main')
    setSelectedIssue(null)
  }

  const copyAnnouncement = () => {
    if (current?.announcement) {
      navigator.clipboard.writeText(current.announcement)
    }
  }

  const inspectElement = () => {
    if (current?.element) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any
      if (win.inspect) {
        win.inspect(current.element)
      } else {
        console.log('[A11y Panel]', current.element)
      }
    }
  }

  const focusPrevElement = () => {
    if (prev?.element) {
      prev.element.focus()
    }
  }

  const focusNextElement = () => {
    if (next?.element) {
      next.element.focus()
    }
  }

  if (!isOpen) return null

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
      <Portal container={portalContainerRef}>
        <FloatingPanel.Positioner className={positionerStyles}>
          <FloatingPanel.Content
            className={contentStyles}
            data-a11y-panel
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
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
                      <span>ACLint</span>
                      <span className={badgeStyles}>
                        {currentIndex}/{totalFocusable}
                      </span>
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
                  className={platformToggleStyles}
                  onClick={togglePlatform}
                  onMouseDown={(e) => e.preventDefault()}
                  tabIndex={-1}
                  title={`VoiceOver platform: ${platform === 'macos' ? 'macOS' : 'iOS'}`}
                >
                  <span
                    className={
                      platform === 'macos'
                        ? platformActiveSegmentStyles
                        : platformInactiveSegmentStyles
                    }
                  >
                    Mac
                  </span>
                  <span
                    className={
                      platform === 'ios'
                        ? platformActiveSegmentStyles
                        : platformInactiveSegmentStyles
                    }
                  >
                    iOS
                  </span>
                </button>
                <button
                  className={cx(controlButtonStyles, showHighlight && activeButtonStyles)}
                  onClick={onToggleHighlight}
                  onMouseDown={(e) => e.preventDefault()}
                  tabIndex={-1}
                  title="Toggle highlight"
                >
                  <span className={highlightIconStyles} />
                </button>
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
                  <Portal container={portalContainerRef}>
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
                    onMouseDown={(e: MouseEvent) => e.preventDefault()}
                    tabIndex={-1}
                    title="Expand"
                  >
                    <Maximize2 size={14} />
                  </FloatingPanel.StageTrigger>
                ) : (
                  <FloatingPanel.StageTrigger
                    stage="minimized"
                    className={controlButtonStyles}
                    onMouseDown={(e: MouseEvent) => e.preventDefault()}
                    tabIndex={-1}
                    title="Minimize"
                  >
                    <Minus size={14} />
                  </FloatingPanel.StageTrigger>
                )}
                <FloatingPanel.CloseTrigger
                  className={controlButtonStyles}
                  onMouseDown={(e: MouseEvent) => e.preventDefault()}
                  tabIndex={-1}
                  title="Close"
                >
                  <X size={14} />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>

            {stage !== 'minimized' && (
              <FloatingPanel.Body className={bodyStyles}>
                {view === 'main' && (
                  <MainView
                    current={current}
                    prev={prev}
                    next={next}
                    patternIssues={sortedPatternIssues}
                    wcagIssues={sortedWcagIssues}
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
                  <FixView issue={selectedIssue} currentElement={current} />
                )}
              </FloatingPanel.Body>
            )}

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
  )
}
