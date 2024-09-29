import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _TimeInput, { TimeInputProps } from './TimeInput'

export type { TimeInputProps } from './TimeInput'

type CompoundedComponent = ForwardRefExoticComponent<
    TimeInputProps & RefAttributes<HTMLSpanElement>
> & {}

const TimeInput = _TimeInput as CompoundedComponent

export { TimeInput }

export default TimeInput
