import React, { FC, useEffect, useState } from 'react'
import NcModal from '@/components/NcModal/NcModal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox'
import AuthorType from '@/types/AuthorType'

export interface FollowButtonProps {
    show: boolean
    author: string
    type: string
    onCloseModal: () => void
}

const PostOptionsBtn: FC<FollowButtonProps> = ({
    show,
    author,
    type,
    onCloseModal,
}) => {
    const supabase = createClientComponentClient()

    const [data, setData] = useState<AuthorType[]>()

    useEffect(() => {
        async function getData() {
            if (type == 'followers') {
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
                    .single()
                if (error) {
                    // Handle the error.
                    return
                }
                //@ts-ignore
                setData(data)
                console.log(data)
            } else {
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
                    .single()
                if (error) {
                    // Handle the error.
                    return
                }
                //@ts-ignore
                setData(data)
                console.log(data)
            }
        }
        getData()
    }, [author])

    const renderBtnOpenPopover = (openModal: () => void) => {
        return <></>
    }

    const renderContent = () => {
        return (
            <div className="">
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row ">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 p-5">
                        {type === 'followers' ? (
                            <>
                                {!Array.isArray(data) && data ? (
                                    //@ts-ignore
                                    <CardAuthorBox author={data.follower} />
                                ) : (
                                    <>
                                        {data?.map((author, key) => (
                                            <CardAuthorBox
                                                key={key}
                                                //@ts-ignore
                                                author={author.follower}
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {!Array.isArray(data) && data ? (
                                    //@ts-ignore
                                    <CardAuthorBox author={data.following} />
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <NcModal
                isOpenProp={show}
                containerClassName="flex"
                contentPaddingClass=""
                contentExtraClass="max-w-screen-md"
                renderContent={renderContent}
                renderTrigger={renderBtnOpenPopover}
                modalTitle={type === 'followers' ? 'Followers' : 'Following'}
                onCloseModal={() => {
                    onCloseModal()
                }}
            />
        </>
    )
}

export default PostOptionsBtn
