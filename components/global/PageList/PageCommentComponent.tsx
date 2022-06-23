import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Avatar } from 'antd'
import UserInfoMap from '../../../manager/global/User/UserInfoMap'
import { getRelativeTime } from '../../../utils/getRelativeTime'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { CommentInputContainer } from '../../BlogPage/EditorPage/Comment/CommentInputContainer'
import { Collapse } from '@material-ui/core'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const PageCommentComponent: React.FC<{
    commentId: string,
    depth: number
}> = observer(({
    commentId,
    depth
}) => {
    const [openCommentResponseInput, setOpenCommentResponseInput] = useState(false)
    const [openCommentResponse, setOpenCommentResponse] = useState(!!depth)
    const commentMap = EditorPage.commentInfo.commentMap
    const comment = commentMap[commentId]
    if (!comment) {
        return <></>
    }
    const {
        userId,
        createdAt,
        content,
        children
    } = comment
    const commentUserInfo = UserInfoMap.idMap[userId]
    if (!commentUserInfo) {
        return <></>
    }
    const {
        profileImageUrl,
        nickname
    } = commentUserInfo

    return <div
        className={'page-comment'}
    >
        <div className={'main-container'}>
            <div
                className={'avatar-container'}
                onClick={() => {
                    RoutingManager.moveTo(Page.Blog, `/${nickname}`)
                }}
            >
                <Avatar
                    src={profileImageUrl}
                    size={depth > 0 ? 32 : 40}
                />
            </div>
            <div
                className={'text-container'}
            >
                <div
                    className={'top-container'}
                >
                    <div className={'info-container'}>
                        <div
                            className={'nickname'}
                            onClick={() => {
                                RoutingManager.moveTo(Page.Blog, `/${nickname}`)
                            }}
                        >
                            {nickname}
                        </div>
                        <div
                            className={'created-at'}
                        >
                            {getRelativeTime(createdAt)}
                        </div>
                    </div>
                </div>
                <div className={'content'}>
                    {content}
                </div>
                <div className={'comment-interaction-container'}>
                    <div
                        className={'comment-response-input-button'}
                        onClick={() => setOpenCommentResponseInput(true)}
                    >
                        {'답글 달기'}
                    </div>
                </div>
                {
                    openCommentResponseInput && <CommentInputContainer
                        parentCommentId={commentId}
                        onCancel={() => setOpenCommentResponseInput(false)}
                        onComment={() => {
                            setOpenCommentResponseInput(false)
                            setOpenCommentResponse(true)
                        }}
                    />
                }
                {
                    depth === 0 && children.length > 0
                        ? <div
                            className={'comment-response-button'}
                            onClick={() => setOpenCommentResponse(!openCommentResponse)}
                        >
                            {
                                openCommentResponse
                                    ? <>
                                        <ArrowDropDown/>
                                        <div>
                                            {'답글 숨기기'}
                                        </div>
                                    </>
                                    : <>
                                        <ArrowRight/>
                                        <div>
                                            {`${comment.getAllChildrenCommentCount(commentMap)}개의 답글 보기`}
                                        </div>
                                    </>
                            }
                        </div>
                        : <></>
                }
                <Collapse in={openCommentResponse} timeout="auto" unmountOnExit>
                    {
                        children.map(commentId => {
                            return <PageCommentComponent
                                key={`page-comment-${commentId}`}
                                commentId={commentId}
                                depth={depth + 1}
                            />
                        })
                    }
                </Collapse>

            </div>
        </div>
    </div>
})
