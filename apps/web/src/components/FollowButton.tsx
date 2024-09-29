import { PlusCircleIcon } from '@heroicons/react/24/solid'
import React, { FC, useEffect } from 'react'
import { ButtonPrimary, Button, ButtonProps, Alert } from 'ui'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

export interface FollowButtonProps extends ButtonProps {
    authorId: string
}

const FollowButton: FC<FollowButtonProps> = ({
    className,
    sizeClass,
    fontSize,
    authorId,
}) => {
    const [following, setFollowing] = React.useState(false)

    useEffect(() => {
        async function fetchInitialFollowingStatus() {
            // Get local followers array
            const localFollowers = localStorage.getItem('followers')
                ? JSON.parse(localStorage.getItem('followers') || '')
                : []

            // Check if authorId is in local followers array
            if (localFollowers) {
                const isFollowing = localFollowers.includes(authorId)
                if (isFollowing) setFollowing(true)
            } else {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getUser()
                const userId = session.user?.id

                if (!userId) {
                    toast.custom((t) => (
                        <Alert
                            type="danger"
                            message="You need to be logged in to follow users."
                        />
                    ))
                }

                if (!userId) {
                    toast.custom((t) => (
                        <Alert
                            type="danger"
                            message="You need to be logged in to follow users."
                        />
                    ))
                    return
                }

                const { data: follows, error } = await supabase
                    .from('followers')
                    .select('id')
                    .eq('follower', userId)
                    .eq('following', authorId)

                //Set local followers array
                if (follows && follows.length > 0 && !error) {
                    localStorage.setItem('followers', JSON.stringify(follows))
                    setFollowing(true)
                }
            }
        }
        fetchInitialFollowingStatus()
    }, [authorId])

    async function toggleFollowing() {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()
        const userId = session.user?.id

        if (!userId) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to follow users."
                />
            ))
            return
        }

        try {
            if (following) {
                const { data, error } = await supabase
                    .from('followers')
                    .delete()
                    .eq('follower', userId)
                    .eq('following', authorId)
                if (!error) {
                    setFollowing(false)
                }
            } else {
                const { data, error } = await supabase
                    .from('followers')
                    .insert([{ follower: userId, following: authorId }])
                if (!error) {
                    setFollowing(true)
                }
            }
        } catch (error) {
            console.error('Error toggling following:', error)
        }
    }

    return !following ? (
        <ButtonPrimary
            className={className}
            sizeClass={sizeClass}
            fontSize={fontSize}
            onClick={toggleFollowing}
        >
            <PlusCircleIcon className="w-5 h-5 sm:-ml-2.5" />
            <span className="ml-2">Follow</span>
        </ButtonPrimary>
    ) : (
        <Button
            className={className}
            sizeClass={sizeClass}
            fontSize={fontSize}
            onClick={toggleFollowing}
        >
            <span className="text-sm ">Following</span>
        </Button>
    )
}

export default FollowButton
