'use client'

import { Checkbox } from '@ark-ui/react/checkbox'
import { Collapsible } from '@ark-ui/react/collapsible'
import { createListCollection } from '@ark-ui/react/collection'
import { Dialog } from '@ark-ui/react/dialog'
import { Menu } from '@ark-ui/react/menu'
import { Portal } from '@ark-ui/react/portal'
import { RadioGroup } from '@ark-ui/react/radio-group'
import { Select } from '@ark-ui/react/select'
import { Switch } from '@ark-ui/react/switch'
import { Tabs } from '@ark-ui/react/tabs'
import { Check, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { css } from 'styled-system/css'

import { Button } from '@/src/components/buttons'
import { Card } from '@/src/components/data-display'
import { Box } from '@/src/components/layout'

const triggerClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  padding: '2',
  paddingX: '3',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'slate.300',
  backgroundColor: 'white',
  fontSize: 'sm',
  cursor: 'pointer',
  _hover: { backgroundColor: 'slate.50' },
})

const menuContentClass = css({
  minWidth: '200px',
  padding: '1',
  backgroundColor: 'white',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'slate.200',
  boxShadow: 'lg',
  zIndex: 50,
})

const menuItemClass = css({
  padding: '2',
  paddingX: '3',
  borderRadius: 'sm',
  cursor: 'pointer',
  fontSize: 'sm',
  '&[data-highlighted]': { backgroundColor: 'slate.100' },
})

const selectContentClass = css({
  maxHeight: '240px',
  overflowY: 'auto',
  backgroundColor: 'white',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'slate.200',
  boxShadow: 'lg',
  zIndex: 50,
})

const selectItemClass = css({
  padding: '2',
  paddingX: '3',
  cursor: 'pointer',
  fontSize: 'sm',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2',
  '&[data-highlighted]': { backgroundColor: 'slate.100' },
})

const backdropClass = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'black/40',
  zIndex: 40,
})

const dialogPositionerClass = css({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
})

const dialogContentClass = css({
  width: 'min(400px, 92vw)',
  padding: '6',
  backgroundColor: 'white',
  borderRadius: 'lg',
  boxShadow: 'xl',
})

const tabListClass = css({
  display: 'flex',
  gap: '1',
  borderBottom: '1px solid',
  borderColor: 'slate.200',
  marginBottom: '3',
})

const tabTriggerClass = css({
  padding: '2',
  paddingX: '3',
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'slate.600',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  marginBottom: '-1px',
  '&[data-selected]': { color: 'blue.700', borderBottomColor: 'blue.600', fontWeight: 'semibold' },
})

const tabContentClass = css({
  fontSize: 'sm',
  color: 'slate.700',
  lineHeight: 'relaxed',
})

const checkboxRowClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  marginBottom: '2',
})

const controlBoxClass = css({
  width: '18px',
  height: '18px',
  border: '2px solid',
  borderColor: 'slate.400',
  borderRadius: 'sm',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
})

const switchTrackClass = css({
  width: '36px',
  height: '20px',
  borderRadius: 'full',
  backgroundColor: 'slate.300',
  position: 'relative',
  transition: 'background 0.2s',
  '&[data-state="checked"]': { backgroundColor: 'blue.600' },
})

const switchThumbClass = css({
  width: '16px',
  height: '16px',
  borderRadius: 'full',
  backgroundColor: 'white',
  position: 'absolute',
  top: '2px',
  left: '2px',
})

const warningBoxClass = css({
  padding: '3',
  borderRadius: 'md',
  border: '1px dashed',
  borderColor: 'amber.400',
  backgroundColor: 'amber.50',
  fontSize: 'sm',
  color: 'amber.900',
})

export function DashboardPlayground() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const languageCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'English', value: 'en' },
          { label: 'Norsk', value: 'no' },
          { label: 'Deutsch', value: 'de' },
          { label: 'Français', value: 'fr' },
        ],
      }),
    [],
  )

  const priorityCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'med' },
          { label: 'High', value: 'high' },
        ],
      }),
    [],
  )

  return (
    <Box display="flex" flexDirection="column" gap="6" marginTop="6" maxWidth="720px">
      <Box fontSize="sm" color="slate.600" lineHeight="relaxed">
        Use <strong>⌘⇧A</strong> (mac) or <strong>Ctrl⇧A</strong> (Win) to open the a11y panel, then
        tab through these controls. Mix of Ark UI primitives (accessible) and a small “intentional
        issues” area for pattern checks.
      </Box>

      {/* Dropdown menu */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Actions menu (Ark Menu)</Card.Title>
          <Card.Description>
            Dropdown with grouped items — test menu / menuitem roles and keyboard.
          </Card.Description>
        </Card.Header>
        <Card.Body className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
          <Menu.Root closeOnSelect>
            <Menu.Trigger className={triggerClass}>
              Open actions
              <ChevronDown size={16} aria-hidden />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className={menuContentClass}>
                  <Menu.ItemGroup>
                    <Menu.ItemGroupLabel
                      className={css({
                        padding: '2',
                        fontSize: 'xs',
                        fontWeight: 'semibold',
                        color: 'slate.500',
                      })}
                    >
                      Project
                    </Menu.ItemGroupLabel>
                    <Menu.Item value="new" className={menuItemClass}>
                      <Menu.ItemText>New file</Menu.ItemText>
                    </Menu.Item>
                    <Menu.Item value="duplicate" className={menuItemClass}>
                      <Menu.ItemText>Duplicate</Menu.ItemText>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.Separator
                    className={css({ height: '1px', backgroundColor: 'slate.200', marginY: '1' })}
                  />
                  <Menu.ItemGroup>
                    <Menu.ItemGroupLabel
                      className={css({
                        padding: '2',
                        fontSize: 'xs',
                        fontWeight: 'semibold',
                        color: 'slate.500',
                      })}
                    >
                      Account
                    </Menu.ItemGroupLabel>
                    <Menu.Item value="settings" className={menuItemClass}>
                      <Menu.ItemText>Settings</Menu.ItemText>
                    </Menu.Item>
                    <Menu.Item value="logout" className={menuItemClass} disabled>
                      <Menu.ItemText>Logout (disabled demo)</Menu.ItemText>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Card.Body>
      </Card.Root>

      {/* Selects */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Selects (Ark Select)</Card.Title>
          <Card.Description>
            Language-style select and a smaller priority field — combobox / listbox behavior.
          </Card.Description>
        </Card.Header>
        <Card.Body className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <Box>
            <Select.Root collection={languageCollection} defaultValue={['en']}>
              <Select.Label
                className={css({
                  display: 'block',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  marginBottom: '1',
                })}
              >
                Interface language
              </Select.Label>
              <Select.Control>
                <Select.Trigger className={triggerClass}>
                  <Select.ValueText placeholder="Choose language" />
                  <Select.Indicator>
                    <ChevronDown size={16} />
                  </Select.Indicator>
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content className={selectContentClass}>
                    <Select.List>
                      {languageCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item} className={selectItemClass}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check size={14} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Portal>
              <Select.HiddenSelect name="language" />
            </Select.Root>
          </Box>

          <Box>
            <Select.Root collection={priorityCollection} defaultValue={['med']}>
              <Select.Label
                className={css({
                  display: 'block',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  marginBottom: '1',
                })}
              >
                Priority
              </Select.Label>
              <Select.Control>
                <Select.Trigger className={triggerClass}>
                  <Select.ValueText placeholder="Priority" />
                  <Select.Indicator>
                    <ChevronDown size={16} />
                  </Select.Indicator>
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content className={selectContentClass}>
                    <Select.List>
                      {priorityCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item} className={selectItemClass}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check size={14} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Dialog */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Modal dialog (Ark Dialog)</Card.Title>
          <Card.Description>
            Focus moves into the dialog; Escape closes — good for focus-trap / dialog checks.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Dialog.Root open={dialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
            <Dialog.Trigger className={triggerClass}>Open sample dialog</Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop className={backdropClass} />
              <Dialog.Positioner className={dialogPositionerClass}>
                <Dialog.Content className={dialogContentClass}>
                  <Dialog.Title
                    className={css({ fontSize: 'lg', fontWeight: 'bold', marginBottom: '2' })}
                  >
                    Confirm action
                  </Dialog.Title>
                  <Dialog.Description
                    className={css({ fontSize: 'sm', color: 'slate.600', marginBottom: '4' })}
                  >
                    This is a modal dialog with a title and description. Tab should stay inside
                    until you close it.
                  </Dialog.Description>
                  <Box display="flex" gap="2" justifyContent="flex-end">
                    <Dialog.CloseTrigger asChild>
                      <Button variant="surface">Cancel</Button>
                    </Dialog.CloseTrigger>
                    <Dialog.CloseTrigger asChild>
                      <Button>Confirm</Button>
                    </Dialog.CloseTrigger>
                  </Box>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Card.Body>
      </Card.Root>

      {/* Tabs */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Tabs (Ark Tabs)</Card.Title>
          <Card.Description>
            Tab list, selected tab, and panels — compare with VoiceOver “tab group”.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Tabs.Root defaultValue="overview">
            <Tabs.List className={tabListClass}>
              <Tabs.Trigger value="overview" className={tabTriggerClass}>
                Overview
              </Tabs.Trigger>
              <Tabs.Trigger value="details" className={tabTriggerClass}>
                Details
              </Tabs.Trigger>
              <Tabs.Trigger value="history" className={tabTriggerClass}>
                History
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="overview" className={tabContentClass}>
              Overview content: summary metrics and status for this workspace.
            </Tabs.Content>
            <Tabs.Content value="details" className={tabContentClass}>
              Details: extended metadata and configuration options.
            </Tabs.Content>
            <Tabs.Content value="history" className={tabContentClass}>
              History: audit log of recent changes (placeholder).
            </Tabs.Content>
          </Tabs.Root>
        </Card.Body>
      </Card.Root>

      {/* Collapsible */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Collapsible (Ark Collapsible)</Card.Title>
          <Card.Description>
            Expandable region with a trigger — disclosure-style behavior.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Collapsible.Root>
            <Collapsible.Trigger className={triggerClass}>
              <Collapsible.Indicator>
                <ChevronDown size={16} />
              </Collapsible.Indicator>
              Advanced options
            </Collapsible.Trigger>
            <Collapsible.Content
              className={css({ paddingTop: '3', fontSize: 'sm', color: 'slate.600' })}
            >
              Hidden content: API keys, webhooks, and rate limits (demo copy only).
            </Collapsible.Content>
          </Collapsible.Root>
        </Card.Body>
      </Card.Root>

      {/* Checkboxes, radios, switch */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Form controls</Card.Title>
          <Card.Description>
            Checkbox group, radio group, and switch — tick box / radio button / switch in VO.
          </Card.Description>
        </Card.Header>
        <Card.Body className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <Box>
            <Box as="span" fontSize="sm" fontWeight="semibold" display="block" marginBottom="2">
              Notifications
            </Box>
            <Checkbox.Group defaultValue={['email']}>
              <Checkbox.Root value="email" className={checkboxRowClass}>
                <Checkbox.Control className={controlBoxClass}>
                  <Checkbox.Indicator>
                    <Check size={12} strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>Email</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
              <Checkbox.Root value="push" className={checkboxRowClass}>
                <Checkbox.Control className={controlBoxClass}>
                  <Checkbox.Indicator>
                    <Check size={12} strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>Push</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
              <Checkbox.Root value="sms" className={checkboxRowClass} disabled>
                <Checkbox.Control className={controlBoxClass}>
                  <Checkbox.Indicator>
                    <Check size={12} strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>SMS (disabled)</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </Checkbox.Group>
          </Box>

          <Box>
            <RadioGroup.Root defaultValue="standard">
              <RadioGroup.Label
                className={css({
                  display: 'block',
                  fontSize: 'sm',
                  fontWeight: 'semibold',
                  marginBottom: '2',
                })}
              >
                Shipping speed
              </RadioGroup.Label>
              {(
                [
                  { value: 'standard', label: 'Standard (5–7 days)' },
                  { value: 'express', label: 'Express (2 days)' },
                ] as const
              ).map((opt) => (
                <RadioGroup.Item key={opt.value} value={opt.value} className={checkboxRowClass}>
                  <RadioGroup.ItemControl className={controlBoxClass}>
                    <RadioGroup.Indicator>
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        backgroundColor="blue.600"
                      />
                    </RadioGroup.Indicator>
                  </RadioGroup.ItemControl>
                  <RadioGroup.ItemText>{opt.label}</RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </Box>

          <Box display="flex" alignItems="center" gap="3">
            <Switch.Root className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
              <Switch.Control className={switchTrackClass}>
                <Switch.Thumb className={switchThumbClass} />
              </Switch.Control>
              <Switch.Label className={css({ fontSize: 'sm', fontWeight: 'medium' })}>
                Dark mode preview
              </Switch.Label>
              <Switch.HiddenInput />
            </Switch.Root>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Intentional anti-patterns for tool testing */}
      <Box borderWidth="2px" borderColor="amber.300" borderRadius="md" overflow="hidden">
        <Card.Root variant="outline">
          <Card.Header>
            <Card.Title>Intentional issues (demo)</Card.Title>
            <Card.Description>
              For testing semantic-pattern detection — do not copy into production UI.
            </Card.Description>
          </Card.Header>
          <Card.Body className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            <div className={warningBoxClass}>
              <strong>Link as trigger:</strong> the control below uses{' '}
              <code>&lt;a href=&quot;#&quot;&gt;</code> like a button — your panel should flag “link
              as trigger” patterns.
            </div>
            <a
              href="#"
              className={css({
                fontSize: 'sm',
                color: 'blue.700',
                textDecoration: 'underline',
                cursor: 'pointer',
              })}
              onClick={(e) => e.preventDefault()}
              aria-expanded="false"
            >
              Choose language (fake link pattern)
            </a>

            <div className={warningBoxClass}>
              <strong>Unlabeled input:</strong> text field with no associated label — pattern + WCAG
              checks.
            </div>
            <input
              type="text"
              placeholder="Search…"
              className={css({
                width: '100%',
                maxWidth: '280px',
                padding: '2',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'slate.300',
              })}
            />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  )
}
