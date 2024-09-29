import { cn } from '@/utils/cn'
export default function HorizontalFormBlockWrapper({
    title,
    titleClassName,
    description,
    children,
    className,
    descriptionClassName,
    childrenWrapperClassName,
}: React.PropsWithChildren<{
    title: React.ReactNode
    description?: React.ReactNode
    titleClassName?: string
    className?: string
    descriptionClassName?: string
    childrenWrapperClassName?: string
}>) {
    return (
        <div
            className={cn(
                'border-b border-dashed border-muted border-gray-300 dark:border-neutral-700 py-10 @5xl:grid @5xl:grid-cols-6',
                className
            )}
        >
            <div className="col-span-2 mb-6 @5xl:mb-0">
                <h5
                    className={cn(
                        'mb-2 text-[17px] font-semibold',
                        titleClassName
                    )}
                >
                    {title}
                </h5>
                <span
                    className={cn(
                        'mt-1 leading-relaxed text-gray-500 text-sm',
                        descriptionClassName
                    )}
                >
                    {description}
                </span>
            </div>
            <div
                className={cn(
                    'col-span-4 grid grid-cols-1 gap-4 @lg:gap-5 @3xl:grid-cols-2',
                    childrenWrapperClassName
                )}
            >
                {children}
            </div>
        </div>
    )
}
