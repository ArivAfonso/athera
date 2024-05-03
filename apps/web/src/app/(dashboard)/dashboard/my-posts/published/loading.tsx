const LoadingPublishedPosts = () => {
    return (
        <>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                <div className="flex flex-col sm:items-center sm:justify-between rounded-lg sm:flex-row pb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold bg-gray-300 dark:bg-gray-600 h-8 w-32 animate-pulse"></h2>
                </div>
                <div className="flex flex-col space-y-8">
                    <div className="flex-1 text-slate-900 dark:text-slate-200">
                        <div className="bg-gray-300 dark:bg-gray-600 flex items-center space-x-1 py-2 px-4 rounded-xl h-full animate-pulse">
                            <div className="h-7 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                        </div>
                    </div>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-start text-sm font-normal text-neutral-600 dark:text-neutral-400 sm:pl-0 capitalize"
                                        >
                                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="pr-3 pl-8 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                        >
                                            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap pl-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-md space-y-2 animate-pulse"></div>
                                                        <div>
                                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 w-48 animate-pulse"></div>
                                                            <div className="h-4 mt-2 bg-gray-300 dark:bg-gray-600 w-48 animate-pulse"></div>
                                                            <div className="h-3 mt-2 bg-gray-300 dark:bg-gray-600 w-20 animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 flex mt-3 items-center">
                                                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse mr-1"></div>
                                                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 pl-8">
                                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 pl-8">
                                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-gray-500 flex mt-3 items-center">
                                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mr-"></div>
                                                    {` | `}
                                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse ml-1"></div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoadingPublishedPosts
