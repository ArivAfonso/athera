import React, { FC, useEffect, useState } from 'react'
import { Modal } from 'ui'
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox'
import AuthorType from '@/types/AuthorType'
import { debounce, set } from 'lodash'
import { createClient } from '@/utils/supabase/client'

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
    const [allFollowers, setAllFollowers] = useState<AuthorType[]>()

    useEffect(() => {
        async function getData() {
            const { data, error } = await supabase
                .from('followers')
                .select(
                    `
                     follower(
                        id,
                        username,
                        avatar,
                        name,
                        verified
                     )
                    `
                )
                .eq('following', author)

            if (error) {
                // Handle the error.
                return
            }

            setData(data as unknown as AuthorType[])
            setAllFollowers(data as unknown as AuthorType[])
        }
        getData()
    }, [author])

    const fetchFollowers = debounce(async (inputValue: String) => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('followers')
            .select(
                `follower(
                    id,
                    username,
                    avatar,
                    name,
                    verified
                 )`
            )
            .eq('following', author)
            .ilike('follower.name', `${inputValue}%`)
            .ilike('follower.username', `${inputValue}%`)

        if (error) {
            return
        }

        setData(data as unknown as AuthorType[])
    }, 300) // 500ms delay

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
                                        setData(allFollowers)
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 p-5">
                        <>
                            {data?.map((author, key) => (
                                <CardAuthorBox
                                    key={key}
                                    //@ts-ignore
                                    author={author.follower}
                                />
                            ))}
                        </>
                    </div>
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
                modalTitle={'Followers'}
                onCloseModal={() => {
                    onCloseModal()
                }}
            />
        </>
    )
}

export default PostOptionsBtn
