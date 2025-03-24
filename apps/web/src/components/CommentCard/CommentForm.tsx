import React, { FC } from 'react'
import { Button, Textarea, Label, ButtonPrimary } from 'ui'
import { useForm, Controller } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

export interface CommentFormProps {
    className?: string
    onClickSubmit?: () => void
    onClickCancel?: () => void
    textareaRef?: React.MutableRefObject<null>
    defaultValue?: string
    id: string
    rows?: number
}

const CommentForm: FC<CommentFormProps> = ({
    className = 'mt-5',
    onClickSubmit,
    onClickCancel,
    textareaRef,
    defaultValue = '',
    id,
    rows = 4,
}) => {
    const { control, handleSubmit } = useForm()
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
    }

    return (
        <form
            action="#"
            className={`CommentForm ${className}`}
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
                <Button type="button" pattern="white" onClick={onClickCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

export default CommentForm
