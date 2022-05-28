import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import EditorManager from '../../../manager/Blog/EditorManager'
import { Tag } from 'antd'
import NotificationManager from '../../../manager/global/NotificationManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../../manager/global/FeedbackManager'

export const PageTagList: React.FC<{
}> = observer(() => {
    const [newTag, setNewTag] = useState('')
    console.log(EditorManager.tags)
    return <div
        className={'page-tag-list-container'}
    >
        {
            EditorManager.tags.map((tag, index) =>
                <Tag
                    key={`page-tag-${index}`}
                    closable={EditorManager.editable && !EditorManager.isLocked}
                    onClose={(event) => {
                        event.preventDefault()
                        if (EditorManager.editable) {
                            EditorManager.removeTag(index)
                        }
                    }}
                >
                    {tag}
                </Tag>)
        }
        {
            EditorManager.editable &&
            !EditorManager.isLocked
                ? <input
                    className={'tag-input'}
                    placeholder={'태그 입력'}
                    value={newTag}
                    onChange={(event) => {
                        setNewTag(event.target.value)
                    }}
                    onKeyDown={(event) => {
                        if (newTag !== '') {
                            if (event.key === 'Enter' || event.key === ',') {
                                // 중복이 없으면
                                event.preventDefault()
                                if (EditorManager.tags.filter(v => v === newTag).length === 0) {
                                    EditorManager.addTag(newTag)
                                } else {
                                    FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '이미 태그가 존재합니다.', '', 5)
                                }
                                setNewTag('')
                            }
                        }
                    }}
                />
                : <></>
        }
    </div>
})
