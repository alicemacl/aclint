import type {HTMLStyledProps, BoxProps as PandaBoxProps} from 'styled-system/jsx'
import {Box as PandaBox, styled} from 'styled-system/jsx'

export type BoxProps = HTMLStyledProps<'div'> & PandaBoxProps & {as?: React.ElementType}

export const Box = styled(PandaBox) as React.FC<BoxProps>
