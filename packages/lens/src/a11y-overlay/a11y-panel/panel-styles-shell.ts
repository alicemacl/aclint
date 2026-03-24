import { css } from 'styled-system/css';
export const positionerStyles = css({
  position: 'fixed!',
  zIndex: 9999,
});

export const contentStyles = css({
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

export const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  backgroundColor: 'gray.800',
  borderBottom: '1px solid',
  borderColor: 'gray.700',
});

export const dragTriggerStyles = css({
  cursor: 'grab',
  _active: { cursor: 'grabbing' },
});

export const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: 'semibold',
  fontSize: '13px',
});

export const badgeStyles = css({
  backgroundColor: 'gray.700',
  padding: '2px 6px',
  borderRadius: 'full',
  fontSize: '10px',
  fontWeight: 'normal',
  color: 'gray.400',
});

export const backButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: 'gray.300',
  cursor: 'pointer',
  _hover: { color: 'white' },
});

export const controlStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const controlButtonStyles = css({
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

export const activeButtonStyles = css({
  backgroundColor: 'blue.600!',
  color: 'white!',
});

export const highlightIconStyles = css({
  width: '10px',
  height: '10px',
  border: '2px solid currentColor',
  borderRadius: 'sm',
});

export const platformToggleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '2px 6px',
  borderRadius: 'sm',
  fontSize: '10px',
  fontWeight: 'semibold',
  color: 'gray.400',
  cursor: 'pointer',
  transition: 'all 0.15s',
  _hover: { backgroundColor: 'gray.700', color: 'white' },
});

export const platformActiveSegmentStyles = css({
  backgroundColor: 'blue.600',
  color: 'white',
  padding: '1px 5px',
  borderRadius: 'sm',
  fontSize: '10px',
});

export const platformInactiveSegmentStyles = css({
  padding: '1px 5px',
  fontSize: '10px',
});

// Simulations menu
export const simBadgeStyles = css({
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

export const simMenuPositionerStyles = css({
  zIndex: 10001,
});

export const simMenuStyles = css({
  backgroundColor: 'gray.800',
  borderRadius: 'md',
  padding: '4px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  minWidth: '180px',
});

export const simMenuLabelStyles = css({
  padding: '6px 10px',
  fontSize: '10px',
  fontWeight: 'semibold',
  color: 'gray.500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const simMenuItemStyles = css({
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

export const simCheckStyles = css({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'green.400',
});

export const bodyStyles = css({
  padding: '10px',
  /* maxHeight: '360px', */
  overflowY: 'auto',
});

// Resize handles
export const resizeTriggerStyles = css({
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

export const resizeCornerStyles = css({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '12px',
  height: '12px',
  cursor: 'se-resize',
});
