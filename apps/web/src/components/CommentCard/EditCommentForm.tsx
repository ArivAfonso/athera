import React, { FC } from 'react'
import { Button, Textarea, Label, ButtonPrimary } from 'ui'
import { useForm, Controller } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

export interface SingleCommentFormProps {
    className?: string
    onClickSubmit?: () => void
    onClickCancel?: () => void
    textareaRef?: React.MutableRefObject<null>
    defaultValue?: string
    onEditComment: (comment: string) => void // Add this prop
    id: string
    rows?: number
}

const EditCommentForm: FC<SingleCommentFormProps> = ({
    className = 'mt-5',
    onClickSubmit,
    onClickCancel,
    textareaRef,
    defaultValue = '',
    onEditComment, // Add this prop
    id,
    rows = 4,
}) => {
    const { control, handleSubmit } = useForm()
    const onSubmit = async (data: any) => {
        const supabase = createClient()
        const { data: commentConfirm, error } = await supabase
            .from('comments')
            .update({ comment: data.comment })
            .eq('id', id)
        onEditComment(data.comment)
    }

    return (
        <form
            action="#"
            className={`EditCommentForm ${className}`}
            onSubmit={handleSubmit(async (data) => await onSubmit(data))}
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

export default EditCommentForm
