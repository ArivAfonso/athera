'use client'
import { FC, useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import Label from '../Label/Label'

export interface MySwitchProps {
    enabled?: boolean
    label?: string
    desc?: string
    className?: string
    onChange?: (enabled: boolean) => void
    size?: 'small' | 'medium' | 'large'
}

const MySwitch: FC<MySwitchProps> = ({
    enabled = false,
    label = 'Put on sale',
    desc = '',
    className = '',
    onChange,
    size = 'medium',
}) => {
    const [enabledState, setEnabledState] = useState(false)

    useEffect(() => {
        setEnabledState(enabled)
    }, [enabled])

    const switchSize =
        size === 'small'
            ? 'h-6 w-[56px]'
            : size === 'large'
              ? 'h-10 w-[80px]'
              : 'h-8 w-[68px]'

    return (
        <div
            className={`MySwitch flex fle justify-between items-center space-x-2 ${className}`}
        >
            <div>
                <Label className="text-base">{label}</Label>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm pt-1">
                    {desc}
                </p>
            </div>
            <Switch
                checked={enabled}
                onChange={(value) => {
                    setEnabledState(value)
                    onChange && onChange(value)
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    enabled
                        ? 'bg-indigo-600'
                        : 'bg-gray-200 dark:bg-neutral-700'
                }`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </Switch>
        </div>
    )
}

export default MySwitch
