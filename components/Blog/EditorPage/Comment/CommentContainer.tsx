import React from 'react'
import { observer } from 'mobx-react'
import PageManager from '../../../../manager/Blog/PageManager'
import { PageCommentComponent } from '../../Page/PageCommentComponent'
import { Input } from 'antd'
import { CommentInputContainer } from './CommentInputContainer'
const TextArea = Input.TextArea

export const CommentContainer: React.FC<{
}> = observer(() => {
    return <div
        className={'comment-container'}
    >
        <div
            className={'comment-count'}
        >
            {`댓글 ${PageManager.pageCommentInfo.commentCount}개`}
        </div>
        <CommentInputContainer
            parentCommentId={null}
        />
        {
            PageManager.pageCommentInfo.topLevelCommentIDList.map(commentId => {
                return <PageCommentComponent
                    key={`page-comment-${commentId}`}
                    commentId={commentId}
                    depth={0}
                />
            })
        }
    </div>
})
