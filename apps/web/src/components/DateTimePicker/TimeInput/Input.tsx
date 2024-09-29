import { forwardRef, useState, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import get from 'lodash/get'
import type {
    InputHTMLAttributes,
    ElementType,
    ReactNode,
    HTMLInputTypeAttribute,
} from 'react'

import './input.scss'

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    className?: string
    children?: ReactNode
    asElement?: ElementType
    disabled?: boolean
    invalid?: boolean
    prefix?: string | ReactNode
    rows?: number
    size?: string
    suffix?: string | ReactNode
    textArea?: boolean
    type?: HTMLInputTypeAttribute
    unstyle?: boolean
    field?: any
    form?: any
}

const Input = forwardRef<ElementType | HTMLInputElement, InputProps>(
    (props, ref) => {
        const {
            asElement: Component = 'input',
            className,
            disabled,
            invalid,
            prefix,
            size,
            suffix,
            textArea,
            type = 'text',
            rows,
            style,
            unstyle = false,
            field,
            form,
            ...rest
        } = props

        const [prefixGutter, setPrefixGutter] = useState(0)
        const [suffixGutter, setSuffixGutter] = useState(0)

        const fixControlledValue = (
            val: string | number | readonly string[] | undefined
        ) => {
            if (typeof val === 'undefined' || val === null) {
                return ''
            }
            return val
        }

        if ('value' in props) {
            rest.value = fixControlledValue(props.value)
            delete rest.defaultValue
        }

        const isInvalid = useMemo(() => {
            let validate = false
            if (!isEmpty(form)) {
                const { touched, errors } = form
                const touchedField = get(touched, field.name)
                const errorField = get(errors, field.name)
                validate = touchedField && errorField
            }
            if (typeof invalid === 'boolean') {
                validate = invalid
            }
            return validate
        }, [form, invalid, field])

        const inputDefaultClass = 'input'
        const inputSizeClass = `input-sm h-sm`
        const inputFocusClass = `focus:ring-primary-500 focus-within:ring-primary-500 focus-within:border-primary-500 focus:border-primary-500`
        const inputWrapperClass = `input-wrapper ${
            prefix || suffix ? className : ''
        }`
        const inputClass = classNames(
            inputDefaultClass,
            !textArea && inputSizeClass,
            !isInvalid && inputFocusClass,
            !prefix && !suffix ? className : '',
            disabled && 'input-disabled',
            isInvalid && 'input-invalid',
            textArea && 'input-textarea'
        )

        const prefixNode = useRef<HTMLDivElement>(null)
        const suffixNode = useRef<HTMLDivElement>(null)

        const getAffixSize = () => {
            if (!prefixNode.current && !suffixNode.current) {
                return
            }
            const prefixNodeWidth = prefixNode?.current?.offsetWidth
            const suffixNodeWidth = suffixNode?.current?.offsetWidth

            if (isNil(prefixNodeWidth) && isNil(suffixNodeWidth)) {
                return
            }

            if (prefixNodeWidth) {
                setPrefixGutter(prefixNodeWidth)
            }

            if (suffixNodeWidth) {
                setSuffixGutter(suffixNodeWidth)
            }
        }

        useEffect(() => {
            getAffixSize()
        }, [prefix, suffix])

        const remToPxConvertion = (pixel: number) => 0.0625 * pixel

        const affixGutterStyle = () => {
            const leftGutter = `${remToPxConvertion(prefixGutter) + 1}rem`
            const rightGutter = `${remToPxConvertion(suffixGutter) + 1}rem`
            const gutterStyle: {
                paddingLeft?: string
                paddingRight?: string
            } = {}

            if (prefix) {
                gutterStyle.paddingLeft = leftGutter
            }

            if (suffix) {
                gutterStyle.paddingRight = rightGutter
            }

            // if (direction === 'ltr') {
            //     if (prefix) {
            //         gutterStyle.paddingLeft = leftGutter
            //     }

            //     if (suffix) {
            //         gutterStyle.paddingRight = rightGutter
            //     }
            // }

            // if (direction === 'rtl') {
            //     if (prefix) {
            //         gutterStyle.paddingRight = leftGutter
            //     }

            //     if (suffix) {
            //         gutterStyle.paddingLeft = rightGutter
            //     }
            // }

            return gutterStyle
        }

        const inputProps = {
            className: !unstyle ? inputClass : '',
            disabled,
            type,
            ref,
            ...field,
            ...rest,
        }

        const renderTextArea = (
            <textarea style={style} rows={rows} {...inputProps}></textarea>
        )

        const renderInput = (
            <Component
                style={{ ...affixGutterStyle(), ...style }}
                {...inputProps}
            />
        )

        const renderAffixInput = (
            <span className={inputWrapperClass}>
                {prefix ? (
                    <div ref={prefixNode} className="input-suffix-start">
                        {' '}
                        {prefix}{' '}
                    </div>
                ) : null}
                {renderInput}
                {suffix ? (
                    <div ref={suffixNode} className="ml-2 input-suffix-end">
                        {suffix}
                    </div>
                ) : null}
            </span>
        )

        const renderChildren = () => {
            if (textArea) {
                return renderTextArea
            }

            if (prefix || suffix) {
                return renderAffixInput
            } else {
                return renderInput
            }
        }

        return renderChildren()
    }
)

Input.displayName = 'Input'

export default Input
