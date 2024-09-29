import classNames from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export interface HeaderProps {
    className?: string
    children?: React.ReactNode
    hasNext: boolean
    hasPrevious: boolean
    onNext?: () => void
    onPrevious?: () => void
    onNextLevel?: () => void
    label?: string
    nextLevelDisabled?: boolean
    nextLabel?: string
    previousLabel?: string
    preventLevelFocus?: boolean
    renderCenter?: boolean
    preventFocus?: boolean
}

const Header = (props: HeaderProps) => {
    const {
        hasNext,
        hasPrevious,
        onNext,
        onPrevious,
        onNextLevel,
        label,
        nextLevelDisabled,
        nextLabel,
        previousLabel,
        preventLevelFocus = false,
        renderCenter = false,
        preventFocus,
        children,
        className,
        ...rest
    } = props

    const headerLabel = (
        <button
            className="cursor-pointer mx-0.5 select-none text-gray-900 dark:text-gray-100"
            disabled={nextLevelDisabled}
            tabIndex={preventLevelFocus ? -1 : 0}
            type="button"
            onClick={onNextLevel}
            onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
            {label}
        </button>
    )

    const renderChildren = children ? children : headerLabel

    return (
        <div
            className={classNames(
                'flex items-center justify-between mb-2',
                className
            )}
            {...rest}
        >
            {!renderCenter && renderChildren}
            <div
                className={classNames(
                    renderCenter && 'justify-between w-full',
                    'flex items-center rtl:flex-row-reverse'
                )}
            >
                <button
                    type="button"
                    className={classNames(
                        !hasPrevious &&
                            renderCenter &&
                            'opacity-0 cursor-default pr-3'
                    )}
                    disabled={!hasPrevious}
                    aria-label={previousLabel}
                    onClick={onPrevious}
                    onMouseDown={(event: any) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronLeftIcon width={20} height={20} />{' '}
                    {/* Add this line */}
                </button>
                {renderCenter && renderChildren}
                <button
                    type="button"
                    className={classNames(
                        !hasNext &&
                            renderCenter &&
                            'p-1 hover:bg-gray-300 dark:bg-gray-700 opacity-0 cursor-default'
                    )}
                    disabled={!hasNext}
                    aria-label={nextLabel}
                    onClick={onNext}
                    onMouseDown={(event: any) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronRightIcon width={20} height={20} />{' '}
                    {/* Add this line */}
                </button>
            </div>
        </div>
    )
}

export default Header
