import React from 'react'
import { observer } from 'mobx-react'
import { PageCommentComponent } from '../../../global/PageList/PageCommentComponent'
import { CommentInputContainer } from './CommentInputContainer'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const CommentContainer: React.FC<{
}> = observer(() => {
    const commentInfo = EditorPage.commentInfo
    return <div
        className={'comment-container'}
    >
        <div
            className={'comment-count'}
        >
            {`댓글 ${commentInfo.commentCount}개`}
        </div>
        <CommentInputContainer
            parentCommentId={null}
        />
        {
            commentInfo.topLevelCommentIDList.map(commentId => {
                return <PageCommentComponent
                    key={`page-comment-${commentId}`}
                    commentId={commentId}
                    depth={0}
                />
            })
        }
    </div>
})
