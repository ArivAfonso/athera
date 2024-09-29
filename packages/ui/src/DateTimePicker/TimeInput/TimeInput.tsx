import { useState, useRef, forwardRef } from 'react'
import useUniqueId from '../hooks/useUniqueId'
import useMergedRef from '../hooks/useMergeRef'
import useDidUpdate from '../hooks/useDidUpdate'
import TimeInputField from './TimeInputField'
import AmPmInput from './AmPmInput'
// import CloseButton from '../CloseButton'
import Input from './Input'
import {
    getTimeValues,
    getDate,
    createAmPmHandler,
    createTimeHandler,
} from './utils'
import type { ReactNode, RefObject, Ref } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'

type Value = Date | null

export interface TimeInputProps {
    amLabel?: string
    amPmPlaceholder?: string
    clearable?: boolean
    defaultValue?: Value
    disabled?: boolean
    format?: '12' | '24'
    id?: string
    invalid?: boolean
    name?: string
    nextRef?: RefObject<HTMLInputElement>
    onChange?: (value: Value) => void
    pmLabel?: string
    prefix?: string | ReactNode
    showSeconds?: boolean
    size?: any
    suffix?: string | ReactNode
    timeFieldPlaceholder?: string
    timeFieldClass?: string
    unstyle?: boolean
    value?: Value
    field?: any
    form?: any
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
    const {
        amLabel = 'am',
        amPmPlaceholder = 'am',
        // @ts-ignore
        className,
        clearable = true,
        defaultValue,
        disabled = false,
        format = '24',
        field,
        form,
        id,
        invalid,
        name,
        nextRef,
        onChange,
        pmLabel = 'pm',
        prefix,
        showSeconds = false,
        size = 'md',
        // @ts-ignore
        style,
        suffix = <ClockIcon className="w-5 h-5" />,
        timeFieldPlaceholder = '--',
        timeFieldClass,
        value,
        ...rest
    } = props

    //@ts-ignore
    const uuid = useUniqueId(id)

    const hoursRef = useRef<HTMLInputElement>()
    const minutesRef = useRef<HTMLInputElement>()
    const secondsRef = useRef<HTMLInputElement>()
    const amPmRef = useRef<HTMLInputElement>()
    const [time, setTime] = useState(
        getTimeValues(value || (defaultValue as Date), format, amLabel, pmLabel)
    )
    const [_value, setValue] = useState<Value>(
        (value as Date) || (defaultValue as Date)
    )

    useDidUpdate(() => {
        setTime(getTimeValues(_value as Date, format, amLabel, pmLabel))
    }, [_value, format, amLabel, pmLabel])

    useDidUpdate(() => {
        if (value?.getTime() !== _value?.getTime()) {
            setValue(value as Date | null)
        }
    }, [value])

    const setDate = (change: Partial<typeof time>) => {
        const timeWithChange = { ...time, ...change }
        const newDate = getDate(
            timeWithChange.hours,
            timeWithChange.minutes,
            timeWithChange.seconds,
            format,
            pmLabel,
            timeWithChange.amPm
        )
        setValue(newDate)
        typeof onChange === 'function' && onChange(newDate)
    }

    const handleHoursChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                hours: val,
                minutes: carryOver ?? time.minutes,
            })
        },
        min: format === '12' ? 1 : 0,
        max: format === '12' ? 12 : 23,
        nextRef: minutesRef as RefObject<HTMLInputElement>,
        nextMax: 59,
    })

    const handleMinutesChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                minutes: val,
                seconds: carryOver ?? time.seconds,
            })
        },
        min: 0,
        max: 59,
        nextRef: showSeconds
            ? (secondsRef as RefObject<HTMLInputElement>)
            : format === '12'
              ? (amPmRef as RefObject<HTMLInputElement>)
              : (nextRef as RefObject<HTMLInputElement>),
        nextMax: showSeconds ? 59 : undefined,
    })

    const handleSecondsChange = createTimeHandler({
        onChange: (val) => {
            setDate({ seconds: val })
        },
        min: 0,
        max: 59,
        nextRef:
            format === '12'
                ? (amPmRef as RefObject<HTMLInputElement>)
                : (nextRef as RefObject<HTMLInputElement>),
    })

    const handleAmPmChange = createAmPmHandler({
        amLabel,
        pmLabel,
        onChange: (val) => {
            setDate({ amPm: val })
        },
        nextRef,
    })

    const handleClear = () => {
        setTime({ hours: '', minutes: '', seconds: '', amPm: '' })
        setValue(null)
        onChange?.(null)
        hoursRef?.current?.focus()
    }

    const suffixSlot = clearable && _value ? <></> : suffix

    return (
        <Input
            asElement="div"
            invalid={invalid}
            disabled={disabled}
            style={style}
            className={className}
            size={size}
            // @ts-ignore
            prefix={prefix}
            suffix={suffixSlot}
            field={field}
            form={form}
            onClick={() => hoursRef?.current?.focus()}
            {...rest}
        >
            <div className="flex items-center h-full ml-4 rtl:flex-row-reverse rtl:justify-end">
                <TimeInputField
                    ref={useMergedRef(hoursRef as Ref<HTMLInputElement>, ref)}
                    withSeparator
                    value={time.hours}
                    setValue={(val) =>
                        setTime((current) => ({ ...current, hours: val }))
                    }
                    //@ts-ignore
                    id={uuid}
                    className={timeFieldClass}
                    max={format === '12' ? 12 : 23}
                    placeholder={timeFieldPlaceholder}
                    aria-label="hours"
                    disabled={disabled}
                    name={name}
                    onChange={handleHoursChange}
                />
                <TimeInputField
                    ref={minutesRef as Ref<HTMLInputElement>}
                    value={time.minutes}
                    setValue={(val) =>
                        setTime((current) => ({ ...current, minutes: val }))
                    }
                    className={timeFieldClass}
                    withSeparator={showSeconds}
                    max={59}
                    placeholder={timeFieldPlaceholder}
                    aria-label="minutes"
                    disabled={disabled}
                    onChange={handleMinutesChange}
                />
                {showSeconds && (
                    <TimeInputField
                        ref={secondsRef as Ref<HTMLInputElement>}
                        value={time.seconds}
                        setValue={(val) =>
                            setTime((current) => ({ ...current, seconds: val }))
                        }
                        className={timeFieldClass}
                        max={59}
                        placeholder={timeFieldPlaceholder}
                        aria-label="seconds"
                        disabled={disabled}
                        onChange={handleSecondsChange}
                    />
                )}
                {format === '12' && (
                    <AmPmInput
                        ref={amPmRef as Ref<HTMLInputElement>}
                        value={time.amPm}
                        placeholder={amPmPlaceholder}
                        amLabel={amLabel}
                        pmLabel={pmLabel}
                        aria-label="am pm"
                        disabled={disabled}
                        onChange={handleAmPmChange}
                    />
                )}
            </div>
        </Input>
    )
})

TimeInput.displayName = 'TimeInput'

export default TimeInput
