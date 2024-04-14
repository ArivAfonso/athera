import { ReactNode } from 'react'
import { File, FileArchive, FileJson } from 'lucide-react'

const BYTE = 1000
const getKB = (bytes: number) => Math.round(bytes / BYTE)

// const FileIcon = ({ children }: CommonProps) => {
//     return <span className="text-4xl">{children}</span>
// }

export interface FileItemProps {
    file: File
    children: ReactNode
}

const FileItem = (props: FileItemProps) => {
    const { file, children } = props
    const { type, name, size } = file

    const renderThumbnail = () => {
        const isImageFile = type.split('/')[0] === 'image'

        if (isImageFile) {
            return (
                <img
                    className="max-w-full"
                    src={URL.createObjectURL(file)}
                    alt={`file preview ${name}`}
                />
            )
        }

        if (type === 'application/json') {
            return (
                <span className="text-8xl">
                    <FileJson size="40" strokeWidth={1.5} />
                </span>
            )
        }

        if (type === 'application/zip') {
            return (
                <span className="text-8xl">
                    <FileArchive size="40" strokeWidth={1.5} />
                </span>
            )
        }

        if (type === 'application/pdf') {
            return (
                <span className="text-8xl">
                    <FileArchive size="40" strokeWidth={1.5} />
                </span>
            )
        }

        return (
            <span className="text-4xl">
                <File size="40" strokeWidth={1.5} />
            </span>
        )
    }

    // ...

    return (
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg mb-2 justify-between p-4">
            <div className="flex">
                <div className="p-2 flex justify-center items-center w-16 h-16">
                    {renderThumbnail()}
                </div>
                <div className="min-h-8 flex flex-col justify-center ltr:ml-3 rtl:mr-3">
                    <h6 className="flex text-center text-lg font-semibold text-overflow ellipsis whitespace-nowrap">
                        {/* Add only the first 16 charcters of the name */}
                        {name.slice(0, 42)}
                    </h6>
                    <span className="upload-file-size text-sm text-gray-500">
                        {getKB(size)} kb
                    </span>
                </div>
            </div>
            {children}
        </div>
    )

    // ...
}

FileItem.displayName = 'UploadFileItem'

export default FileItem
