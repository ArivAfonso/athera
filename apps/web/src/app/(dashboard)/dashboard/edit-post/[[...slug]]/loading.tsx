import Skeleton from 'react-loading-skeleton'

export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto lg:pt-5 pt-10 sm:pt-26 pb-24 lg:pb-32">
            <div className="rounded-xl md:p-6">
                <Skeleton height={40} /> {/* Title */}
                <Skeleton height={40} /> {/* Tags */}
                <Skeleton height={200} /> {/* Featured Image */}
                <Skeleton height={700} /> {/* TiptapEditor */}
                <Skeleton height={700} className="hidden md:block" />{' '}
                {/* TiptapEditor for md and larger screens */}
                <div className="pt-2 md:col-span-2 flex space-x-12 justify-center flex-wrap">
                    <Skeleton height={50} width={200} />{' '}
                    {/* Update Post button */}
                    <Skeleton height={50} width={200} /> {/* PostOptionsBtn */}
                </div>
                <Skeleton height={40} /> {/* Error message */}
            </div>
        </div>
    )
}
