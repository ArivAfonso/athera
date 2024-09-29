import React, { FC, useEffect, useState } from 'react'
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox'
import AuthorType from '@/types/AuthorType'
import { createClient } from '@/utils/supabase/client'
import { SearchIcon } from 'lucide-react'
import CircleLoading from '@/components/CircleLoading/CircleLoading'
import { debounce } from 'lodash'
import { Modal } from 'ui'
import Empty from '@/components/Empty'

export interface FollowButtonProps {
    show: boolean
    author: string
    onCloseModal: () => void
}

const PostOptionsBtn: FC<FollowButtonProps> = ({
    show,
    author,
    onCloseModal,
}) => {
    const supabase = createClient()

    const [data, setData] = useState<AuthorType[]>()
    const [loading, setLoading] = useState(true)
    const [allFollowing, setAllFollowing] = useState<AuthorType[]>()

    useEffect(() => {
        async function getData() {
            console.log('hi')
            const { data, error } = await supabase
                .from('followers')
                .select(
                    `
                     following(
                        id,
                        username,
                        avatar,
                        name,
                        verified
                     )
                    `
                )
                .eq('follower', author)

            setData(data as unknown as AuthorType[])
            setAllFollowing(data as unknown as AuthorType[])

            setLoading(false)
        }
        getData()
    }, [author])

    const renderBtnOpenPopover = (openModal: () => void) => {
        return <></>
    }

    const renderContent = () => {
        return (
            <div className="">
                {/* <div className="p-5">
                    <form
                        action=""
                        method="POST"
                        className="flex-1 text-slate-900 dark:text-slate-200"
                    >
                        <div className="bg-slate-50 dark:bg-neutral-700 flex items-center space-x-1 py-2 px-4 rounded-xl h-full">
                            <SearchIcon strokeWidth={1.5} />
                            <input
                                type="search"
                                placeholder="Type and press enter"
                                className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-sm "
                                onChange={(e) => {
                                    if (e.target.value.trim().length === 0) {
                                        setData(allFollowing)
                                        return
                                    }
                                    console.log(e.target.value)
                                    fetchFollowers(e.target.value)
                                }}
                            />
                        </div>
                    </form>
                </div> */}
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row ">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <CircleLoading />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 p-5">
                            {!data ? (
                                <div className="text-center w-full">
                                    <Empty
                                        subText=""
                                        mainText="No following found"
                                    />

                                    <p className="text-lg font-medium mt-4">
                                        No following found
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {data?.map((author, key) => (
                                        <CardAuthorBox
                                            key={key}
                                            //@ts-ignore
                                            author={author.following}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <Modal
                isOpenProp={show}
                containerClassName="flex"
                contentPaddingClass=""
                contentExtraClass="max-w-screen-md"
                renderContent={renderContent}
                renderTrigger={renderBtnOpenPopover}
                modalTitle={'Following'}
                onCloseModal={() => {
                    onCloseModal()
                }}
            />
        </>
    )
}

export default PostOptionsBtn
