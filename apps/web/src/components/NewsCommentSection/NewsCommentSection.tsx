import React, { useState, useEffect } from 'react'
import CommentCard from '@/components/CommentCard/CommentCard'
import CommentType from '@/types/CommentType'
import { createClient } from '@/utils/supabase/client'
import NewsCommentForm from '@/components/NewsCommentForm/NewsCommentForm'

interface NewsCommentSectionProps {
    newsId: string
    currentUserID: string
}

async function getNewsCommentData(newsId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('comments')
        .select(
            'id, comment, created_at, commenter(name, username, avatar, id)'
        )
        .eq('news', newsId)
        .order('created_at', { ascending: true })

    if (error) {
        console.log(error)
        return []
    }

    const { data: session } = await supabase.auth.getUser()

    const { data: commentLikes } = await supabase
        .from('comment_likes')
        .select('comment, liker')
        .eq('liker', session.user ? session.user.id : '')

    data.forEach((comment: any) => {
        comment.likes =
            commentLikes?.filter((like: any) => like.comment === comment.id)
                .length || 0
        comment.is_liked_by_current_user =
            commentLikes?.some((like: any) => like.comment === comment.id) ||
            false
    })
    return data.map((comment: any) => ({
        ...comment,
        likes: comment.likes || 0,
        is_liked_by_current_user: comment.is_liked_by_current_user || false,
    }))
}

const NewsCommentSection: React.FC<NewsCommentSectionProps> = ({
    newsId,
    currentUserID,
}) => {
    const [comments, setComments] = useState<CommentType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getNewsCommentData(newsId)
            setComments(data)
        }
        fetchData()
    }, [newsId])

    const handleAddComment = (newComment: CommentType) => {
        setComments((prev) => [...prev, newComment])
    }
    const handleEditComment = (commentId: string, newComment: string) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? { ...comment, comment: newComment }
                    : comment
            )
        )
    }
    const handleDeleteComment = (commentId: string) => {
        setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId)
        )
    }

    return (
        <div>
            <NewsCommentForm newsId={newsId} onAddComment={handleAddComment} />
            <ul className="space-y-5">
                {comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        currentUserID={currentUserID}
                        commentObj={comment}
                        onDeleteComment={handleDeleteComment}
                        onEditComment={handleEditComment}
                    />
                ))}
            </ul>
        </div>
    )
}

export default NewsCommentSection
