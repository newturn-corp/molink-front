import React, { useState } from 'react'
import { observer } from 'mobx-react'
import PageManager from '../../../manager/Blog/PageManager'
import { Avatar } from 'antd'
import UserInfoMap from '../../../manager/global/User/UserInfoMap'
import { getRelativeTime } from '../../../utils/getRelativeTime'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { CommentInputContainer } from '../../Blog/EditorPage/Comment/CommentInputContainer'
import { Collapse, List } from '@material-ui/core'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'

export const PageCommentComponent: React.FC<{
    commentId: string,
    depth: number
}> = observer(({
    commentId,
    depth
}) => {
    const [openCommentResponseInput, setOpenCommentResponseInput] = useState(false)
    const [openCommentResponse, setOpenCommentResponse] = useState(!!depth)
    const comment = PageManager.pageCommentInfo.commentMap[commentId]
    if (!comment) {
        return <></>
    }
    const {
        userId,
        createdAt,
        content,
        children
    } = comment
    const commentUserInfo = UserInfoMap.map[userId]
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
                                            {`${comment.getAllChildrenCommentCount(PageManager.pageCommentInfo.commentMap)}개의 답글 보기`}
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
