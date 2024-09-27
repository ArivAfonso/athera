import { FolderIcon } from 'lucide-react'

export default function Empty({
    mainText,
    subText,
    className = 'text-center py-8',
}: {
    className?: string
    subText: string
    mainText: string
}) {
    return (
        <div className={className}>
            <FolderIcon
                strokeWidth={1.5}
                className="inline-block h-12 w-12 text-neutral-400 "
            />
            <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-neutral-300">
                {mainText}
            </h3>
            <p
                dangerouslySetInnerHTML={{ __html: subText }}
                className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400"
            />
        </div>
    )
}
