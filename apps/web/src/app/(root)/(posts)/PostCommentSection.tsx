import React, { FC, useEffect, useState } from 'react' // Import useState
import CommentCard from '@/components/CommentCard/CommentCard'
import CommentType from '@/types/CommentType'
import { Button, Textarea, Label, ButtonPrimary } from 'ui'
import { useForm, Controller } from 'react-hook-form'
import { AuthSession } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

async function getCommentData(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('comments')
        .select(
            'id, comment, created_at, commenter(name, username, avatar, id)'
        )
        .eq('post', id)
        .order('created_at', { ascending: true })

    if (error) {
        // Handle the error.
        return
    }

    // Get the current user's ID.
    const { data: session } = await supabase.auth.getUser()

    // Query the comment_likes table to get the number of likes for each comment and whether the current user has liked each comment.
    const { data: commentLikes, error: errorComment } = await supabase
        .from('comment_likes')
        .select('comment, liker')
        .eq('liker', session.user ? session.user?.id : '')

    // Add the likes and is_liked_by_current_user properties to each comment.
    data.forEach((comment) => {
        //@ts-ignore
        comment.likes = commentLikes?.filter(
            (like) => like.comment === comment.id
        ).length
        //@ts-ignore
        comment.is_liked_by_current_user = commentLikes?.find(
            (like) => like.comment === comment.id
        )
    })
    return data
}

export interface SingleCommentFormProps {
    className?: string
    onClickSubmit?: () => void
    onClickCancel?: () => void
    textareaRef?: React.MutableRefObject<null>
    defaultValue?: string
    id: string
    rows?: number
    currentUserID: string
}

const SingleCommentForm: FC<SingleCommentFormProps> = ({
    className = 'mt-5',
    onClickSubmit,
    onClickCancel,
    textareaRef,
    defaultValue = '',
    id,
    currentUserID,
    rows = 4,
}) => {
    const { control, handleSubmit, reset } = useForm()
    const [submittedComment, setSubmittedComment] = useState(null) // State to store submitted comment

    const [comments, setComments] = useState<CommentType[]>([]) // State to store comments
    const [session, setSession] = useState<AuthSession>()

    useEffect(() => {
        const getData = async () => {
            const supabase = createClient()
            const data = await getCommentData(id)
            const { data: session } = await supabase.auth.getUser()
            //@ts-ignore
            setSession(session.session)
            //@ts-ignore
            setComments(data)
        }

        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEditComment = (commentId: string, newComment: string) => {
        // Update the comments state with the edited comment
        const updatedComments = comments.map((comment) =>
            comment.id === commentId
                ? { ...comment, comment: newComment }
                : comment
        )
        setComments(updatedComments)
    }

    const handleDeleteComment = async (commentId: string) => {
        // Remove the deleted comment from the comments state
        const updatedComments = comments.filter(
            (comment) => comment.id !== commentId
        )
        setComments(updatedComments)
    }

    const onSubmit = async (data: any) => {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        const { data: commentConfirm, error } = await supabase
            .from('comments')
            .insert([
                {
                    comment: data.comment,
                    commenter: session.user?.id,
                    post: id,
                },
            ])

        if (!error) {
            // Comment successfully submitted
            setSubmittedComment({
                //@ts-ignore
                comment: data.comment,
                created_at: new Date(),
                is_liked_by_current_user: false,
                likes: 0,
                commenter: {
                    name: session?.user?.user_metadata.name,
                    username: session?.user?.user_metadata.name,
                    avatar: session?.user?.user_metadata.avatar_url,
                },
            }) // Store the submitted comment
            reset() // Reset the form
        }
    }
    return (
        <>
            {session ? (
                <div className="pb-10">
                    <form
                        action="#"
                        className={`SingleCommentForm ${className}`}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            name="comment"
                            control={control}
                            defaultValue={defaultValue}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Add to discussion"
                                    rows={rows}
                                />
                            )}
                        />
                        <div className="mt-2 space-x-3">
                            <ButtonPrimary type="submit">Submit</ButtonPrimary>
                            <Button
                                type="button"
                                pattern="white"
                                onClick={onClickCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <></>
            )}
            {submittedComment && ( // Render the submitted comment if available
                <ul className="space-y-5">
                    <CommentCard
                        currentUserID={currentUserID}
                        commentObj={submittedComment}
                        onDeleteComment={handleDeleteComment} // Pass the delete callback
                        onEditComment={handleEditComment} // Pass the edit callback
                    />
                </ul>
            )}
            <ul className="SingleCommentLists space-y-5">
                {
                    //@ts-ignore
                    comments.map((comment, key) => (
                        <CommentCard
                            currentUserID={currentUserID}
                            commentObj={comment}
                            key={key}
                            onDeleteComment={handleDeleteComment} // Pass the delete callback
                            onEditComment={handleEditComment} // Pass the edit callback
                        />
                    ))
                }
            </ul>
        </>
    )
}

export default SingleCommentForm
