import React, { FC, useState } from 'react'
import { Button, Textarea, ButtonPrimary, ButtonThird } from 'ui'
import { useForm, Controller } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

export interface NewsCommentFormProps {
    newsId: string
    onAddComment: (comment: any) => void
}

const NewsCommentForm: FC<NewsCommentFormProps> = ({
    newsId,
    onAddComment,
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const onSubmit = async (data: any) => {
        if (!data.comment || data.comment.trim() === '') {
            setSubmitError('Comment cannot be empty')
            return
        }

        setSubmitError(null)

        try {
            const supabase = createClient()
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getUser()

            if (sessionError || !sessionData.user) {
                setSubmitError('You must be logged in to comment')
                return
            }

            const { data: commentInserted, error } = await supabase
                .from('comments')
                .insert([
                    {
                        comment: data.comment,
                        commenter: sessionData.user.id,
                        news: newsId,
                    },
                ])
                .select()

            if (error) {
                console.log('Error adding comment:', error)
                setSubmitError('Failed to submit comment. Please try again.')
                return
            }

            const newComment = {
                id:
                    commentInserted?.[0]?.id ||
                    Math.random().toString(36).slice(2),
                comment: data.comment,
                created_at:
                    commentInserted?.[0]?.created_at ||
                    new Date().toISOString(),
                is_liked_by_current_user: false,
                likes: 0,
                commenter: {
                    name: sessionData.user.user_metadata?.name || 'Anonymous',
                    username:
                        sessionData.user.user_metadata?.name || 'Anonymous',
                    avatar: sessionData.user.user_metadata?.avatar_url,
                },
            }

            onAddComment(newComment)
            reset()
        } catch (err) {
            console.error('Unexpected error:', err)
            setSubmitError('An unexpected error occurred')
        }
    }

    return (
        <form
            action="#"
            className="NewsCommentForm mt-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                name="comment"
                control={control}
                defaultValue=""
                rules={{ required: 'Comment is required' }}
                render={({ field, fieldState }) => (
                    <Textarea
                        {...field}
                        placeholder="Add your comment"
                        rows={4}
                        // error={fieldState.error?.message}
                    />
                )}
            />

            {submitError && (
                <p className="mt-2 text-red-500 text-sm">{submitError}</p>
            )}

            <div className="mt-2 space-x-3">
                <ButtonPrimary type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </ButtonPrimary>
                <ButtonThird
                    type="button"
                    onClick={() => reset()}
                    disabled={isSubmitting}
                >
                    Cancel
                </ButtonThird>
            </div>
        </form>
    )
}

export default NewsCommentForm
