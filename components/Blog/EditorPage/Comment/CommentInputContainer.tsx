import React, { useState } from 'react'
import { observer } from 'mobx-react'
import PageManager from '../../../../manager/Blog/PageManager'
import { PageCommentComponent } from '../../Page/PageCommentComponent'
import { Avatar, Input } from 'antd'
import UserManager from '../../../../manager/global/User/UserManager'
import { Button } from '../../../global/Button'
const TextArea = Input.TextArea

export const CommentInputContainer: React.FC<{
    parentCommentId: string
    onCancel?: Function
}> = observer(({ parentCommentId, onCancel }) => {
    const [content, setContent] = useState('')
    const [isTextAreaFocus, setIsTextAreaFocus] = useState(false)
    return <div
        className={'comment-input-container'}
        style={{
            marginBottom: parentCommentId ? 0 : 20
        }}
    >
        <div
            className={'profile-container'}
        >
            <Avatar
                className={'profile'}
                size={parentCommentId ? 32 : 40}
                src={UserManager.profile.profileImageUrl}
            />
        </div>
        <div
            className={'interaction-container'}
        >
            <TextArea
                className={'comment-input'}
                placeholder={'댓글 작성하기'}
                rows={1}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onFocus={() => setIsTextAreaFocus(true)}
                onBlur={() => setIsTextAreaFocus(false)}
                autoSize
            />
            {
                isTextAreaFocus || (content !== '' || parentCommentId)
                    ? <div
                        className={'button-container'}
                    >
                        <Button
                            theme={'primary'}
                            text={'댓글'}
                            style={{
                                width: 60,
                                height: 35,
                                marginLeft: 10
                            }}
                            fontSize={14}
                            onClick={async () => {
                                await PageManager.pageCommentInfo.saveComment(parentCommentId, content)
                                setContent('')
                            }}
                        />
                        <Button
                            theme={'gray-stroke'}
                            text={'취소'}
                            style={{
                                width: 60,
                                height: 35,
                                marginLeft: 10
                            }}
                            fontSize={14}
                            onClick={async () => {
                                setContent('')
                                if (onCancel) {
                                    onCancel()
                                }
                            }}
                        />
                    </div>
                    : <></>
            }

        </div>

    </div>
})
