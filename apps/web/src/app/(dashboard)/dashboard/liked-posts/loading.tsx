export default function Loading() {
    return (
        <div className="flex space-x-8 mt-3">
            {[...Array(16)].map((_, index) => (
                <div key={index} className="animate-pulse flex-shrink-0 w-72">
                    <div className="bg-gray-200 dark:bg-gray-800 h-48 w-full rounded-3xl mb-4" />
                    <div className="flex flex-col space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
