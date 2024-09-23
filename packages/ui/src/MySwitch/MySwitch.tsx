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
                <p className="text-neutral-500 dark:text-neutral-400 text-base">
                    {desc}
                </p>
            </div>
            <Switch
                checked={enabledState}
                onChange={(e: boolean) => {
                    setEnabledState(e)
                    onChange && onChange(e)
                }}
                className={`${
                    enabledState
                        ? 'bg-blue-700'
                        : 'bg-neutral-400 dark:bg-neutral-6000'
                }
          relative inline-flex flex-shrink-0 ${switchSize} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span className="sr-only">{label}</span>
                <span
                    aria-hidden="true"
                    className={`${
                        enabledState ? 'translate-x-9' : 'translate-x-0'
                    }
            pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
            </Switch>
        </div>
    )
}

export default MySwitch
