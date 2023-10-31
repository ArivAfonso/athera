import { PlusCircleIcon } from '@heroicons/react/24/solid'
import React, { FC, useEffect } from 'react'
import Button, { ButtonProps } from './Button/Button'
import ButtonPrimary from './Button/ButtonPrimary'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
            const supabase = createClientComponentClient()
            const { data: session } = await supabase.auth.getSession()
            const userId = session?.session?.user.id

            const { data: follows, error } = await supabase
                .from('followers')
                .select('id')
                .eq('follower', userId)
                .eq('following', authorId)

            if (follows && follows.length > 0 && !error) {
                setFollowing(true)
            }
        }
        fetchInitialFollowingStatus()
    }, [authorId])

    async function toggleFollowing() {
        const supabase = createClientComponentClient()
        const { data: session } = await supabase.auth.getSession()
        const userId = session?.session?.user.id

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
                console.log(data, error)
            } else {
                const { data, error } = await supabase
                    .from('followers')
                    .insert([{ follower: userId, following: authorId }])
                if (!error) {
                    setFollowing(true)
                }
                console.log(data, error)
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
